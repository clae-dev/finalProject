package edu.kh.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import edu.kh.project.common.util.JwtUtil;

/**
 * JWT 관련 설정 클래스
 * 
 * @Configuration
 * - 스프링 설정용 클래스임을 명시
 * 
 * @PropertySource("classpath:/config.properties")
 * - config.properties 파일의 JWT 관련 설정값을 읽어옴
 * 
 * @Value("${key}")
 * - properties 파일의 특정 key 값을 필드에 주입
 * 
 * @Bean
 * - 개발자가 수동으로 생성한 객체를 Spring Bean으로 등록
 * - JwtUtil 객체를 Spring이 관리하도록 설정
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class JwtConfig {

	// config.properties에서 JWT 관련 값 주입
	@Value("${jwt.secret}")
	private String secret;
	
	@Value("${jwt.access-token-validity}")
	private long accessTokenValidity;
	
	@Value("${jwt.refresh-token-validity}")
	private long refreshTokenValidity;
	
	
	/**
	 * JwtUtil 빈 등록
	 * 
	 * - config.properties의 JWT 설정값을 사용하여 JwtUtil 객체 생성
	 * - 다른 클래스에서 @Autowired로 주입받아 사용 가능
	 * 
	 * @return JwtUtil 객체 (JWT 토큰 생성/검증 유틸리티)
	 */
	@Bean
	public JwtUtil jwtUtil() {
		return new JwtUtil(secret, accessTokenValidity, refreshTokenValidity);
	}
}