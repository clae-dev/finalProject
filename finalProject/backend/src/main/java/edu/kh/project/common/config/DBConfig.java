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
 * 데이터베이스 관련 설정 클래스
 * 
 * @Configuration
 * - 스프링 설정용 클래스임을 명시
 * - 객체로 생성해서 내부 코드를 서버 실행시 모두 실행
 * 
 * @PropertySource("경로")
 * - 지정된 경로의 properties 파일 내용을 읽어와 사용
 * - classpath:/ 는 src/main/resources 경로를 의미
 * 
 * @ConfigurationProperties(prefix = "spring.datasource.hikari")
 * - config.properties 파일의 내용 중 접두사가 일치하는 값만 읽어옴
 * - spring.datasource.hikari로 시작하는 모든 설정이 HikariConfig에 자동 매핑
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class DBConfig {

	// 필드
	@Autowired
	private ApplicationContext applicationContext;

	
	///////////////// HikariCP 설정 ////////////////////

	/**
	 * HikariCP 설정 객체 생성
	 * - config.properties의 spring.datasource.hikari.* 값들이 자동으로 주입됨
	 */
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public HikariConfig hikariConfig() {
		return new HikariConfig();
	}

	/**
	 * DataSource 생성
	 * - 데이터베이스 연결을 관리하는 객체
	 * - HikariCP를 사용하여 커넥션 풀 관리
	 */
	@Bean
	public DataSource dataSource(HikariConfig config) {
		DataSource dataSource = new HikariDataSource(config);
		return dataSource;
	}

	
	/////////////// MyBatis 설정 ///////////////////

	/**
	 * SqlSessionFactory : SqlSession을 만드는 객체
	 * - MyBatis의 핵심 객체
	 */
	@Bean
	public SqlSessionFactory sessionFactory(DataSource dataSource) throws Exception {
		
		SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
		
		sessionFactoryBean.setDataSource(dataSource);
		
		// 1. mapper.xml 파일이 모이는 경로 지정
		sessionFactoryBean.setMapperLocations(
				applicationContext.getResources("classpath:/mappers/**.xml"));
		
		// 2. 해당 패키지 내 모든 클래스의 별칭을 등록
		// - edu.kh.project 패키지 하위의 모든 클래스가 클래스명으로 별칭 등록
		sessionFactoryBean.setTypeAliasesPackage("edu.kh.project");
		
		// 3. 마이바티스 설정 파일 경로 지정
		sessionFactoryBean.setConfigLocation(
				applicationContext.getResource("classpath:/mybatis-config.xml"));
		
		return sessionFactoryBean.getObject();
	}

	/**
	 * SqlSessionTemplate : 기본 SQL 실행 + 트랜잭션 처리
	 * - Connection + DBCP + MyBatis + 트랜잭션 처리
	 */
	@Bean
	public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sessionFactory) {
		return new SqlSessionTemplate(sessionFactory);
	}

	/**
	 * DataSourceTransactionManager : 트랜잭션 매니저
	 * - @Transactional 어노테이션 동작을 위해 필요
	 */
	@Bean
	public DataSourceTransactionManager dataSourceTransactionManager(DataSource dataSource) {
		return new DataSourceTransactionManager(dataSource);
	}
}