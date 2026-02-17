package edu.kh.project.common.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * 데이터베이스 설정 클래스
 *
 * <p>HikariCP 커넥션 풀, MyBatis SqlSession, 트랜잭션 매니저를 구성한다.
 * config.properties의 {@code spring.datasource.hikari.*} 설정값을 기반으로
 * 데이터베이스 연결을 관리한다.</p>
 *
 * <h3>구성 요소</h3>
 * <ul>
 *   <li>{@link HikariConfig} - HikariCP 커넥션 풀 설정</li>
 *   <li>{@link DataSource} - DB 연결 관리 객체</li>
 *   <li>{@link SqlSessionFactory} - MyBatis SQL 세션 생성 팩토리</li>
 *   <li>{@link SqlSessionTemplate} - SQL 실행 + 트랜잭션 처리 템플릿</li>
 *   <li>{@link DataSourceTransactionManager} - @Transactional 트랜잭션 관리</li>
 * </ul>
 *
 * @author HONDI
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class DBConfig {

	/** Spring ApplicationContext (리소스 경로 탐색에 사용) */
	@Autowired
	private ApplicationContext applicationContext;

	// ==================== HikariCP 설정 ====================

	/**
	 * HikariCP 설정 객체를 생성한다.
	 *
	 * <p>config.properties의 {@code spring.datasource.hikari.*} 값들이
	 * {@link ConfigurationProperties}에 의해 자동으로 매핑된다.</p>
	 *
	 * @return HikariCP 설정 객체
	 */
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public HikariConfig hikariConfig() {
		return new HikariConfig();
	}

	/**
	 * DataSource(커넥션 풀)를 생성한다.
	 *
	 * <p>HikariCP를 사용하여 데이터베이스 커넥션 풀을 관리한다.</p>
	 *
	 * @param config HikariCP 설정 객체
	 * @return HikariCP 기반 DataSource
	 */
	@Bean
	public DataSource dataSource(HikariConfig config) {
		return new HikariDataSource(config);
	}

	// ==================== MyBatis 설정 ====================

	/**
	 * MyBatis SqlSessionFactory를 생성한다.
	 *
	 * <p>다음 항목을 설정한다:</p>
	 * <ol>
	 *   <li>Mapper XML 위치: {@code classpath:/mappers/**.xml}</li>
	 *   <li>Type Alias 패키지: {@code edu.kh.project} (클래스명으로 별칭 자동 등록)</li>
	 *   <li>MyBatis 설정 파일: {@code classpath:/mybatis-config.xml}</li>
	 * </ol>
	 *
	 * @param dataSource 데이터베이스 연결 DataSource
	 * @return MyBatis SqlSessionFactory
	 * @throws Exception SqlSessionFactory 생성 실패 시
	 */
	@Bean
	public SqlSessionFactory sessionFactory(DataSource dataSource) throws Exception {

		SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
		sessionFactoryBean.setDataSource(dataSource);

		// Mapper XML 파일 경로 지정
		sessionFactoryBean.setMapperLocations(
				applicationContext.getResources("classpath:/mappers/**.xml"));

		// DTO 등 클래스의 별칭 자동 등록 (패키지 스캔)
		sessionFactoryBean.setTypeAliasesPackage("edu.kh.project");

		// MyBatis 설정 파일 경로 지정
		sessionFactoryBean.setConfigLocation(
				applicationContext.getResource("classpath:/mybatis-config.xml"));

		return sessionFactoryBean.getObject();
	}

	/**
	 * SqlSessionTemplate을 생성한다.
	 *
	 * <p>SQL 실행과 트랜잭션 처리를 담당하는 MyBatis 핵심 객체이다.
	 * Connection 관리, DBCP 연동, 예외 변환을 자동으로 처리한다.</p>
	 *
	 * @param sessionFactory MyBatis SqlSessionFactory
	 * @return SqlSessionTemplate
	 */
	@Bean
	public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sessionFactory) {
		return new SqlSessionTemplate(sessionFactory);
	}

	/**
	 * 트랜잭션 매니저를 생성한다.
	 *
	 * <p>{@code @Transactional} 어노테이션에 의한 선언적 트랜잭션 처리를 지원한다.</p>
	 *
	 * @param dataSource 데이터베이스 연결 DataSource
	 * @return DataSourceTransactionManager
	 */
	@Bean
	public DataSourceTransactionManager dataSourceTransactionManager(DataSource dataSource) {
		return new DataSourceTransactionManager(dataSource);
	}
}
