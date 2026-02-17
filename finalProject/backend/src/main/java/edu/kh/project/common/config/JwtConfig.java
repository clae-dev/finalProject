package edu.kh.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import edu.kh.project.common.util.JwtUtil;

/**
 * JWT(JSON Web Token) 설정 클래스
 *
 * <p>config.properties에서 JWT 관련 설정값(비밀키, 토큰 유효시간)을 읽어와
 * {@link JwtUtil} 객체를 Spring Bean으로 등록한다.</p>
 *
 * <h3>설정 항목</h3>
 * <ul>
 *   <li>{@code jwt.secret} - HMAC SHA256 서명용 비밀키</li>
 *   <li>{@code jwt.access-token-validity} - Access Token 유효시간 (밀리초, 기본 30분)</li>
 *   <li>{@code jwt.refresh-token-validity} - Refresh Token 유효시간 (밀리초, 기본 7일)</li>
 * </ul>
 *
 * @author HONDI
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class JwtConfig {

	/** JWT 서명용 비밀키 */
	@Value("${jwt.secret}")
	private String secret;

	/** Access Token 유효시간 (밀리초, 기본 1800000ms = 30분) */
	@Value("${jwt.access-token-validity}")
	private long accessTokenValidity;

	/** Refresh Token 유효시간 (밀리초, 기본 604800000ms = 7일) */
	@Value("${jwt.refresh-token-validity}")
	private long refreshTokenValidity;

	/**
	 * JwtUtil 빈을 등록한다.
	 *
	 * <p>JWT 토큰 생성, 파싱, 검증 기능을 제공하는 유틸리티 객체를 생성하여
	 * 다른 컴포넌트에서 의존성 주입으로 사용할 수 있도록 한다.</p>
	 *
	 * @return JWT 토큰 관리 유틸리티 객체
	 */
	@Bean
	public JwtUtil jwtUtil() {
		return new JwtUtil(secret, accessTokenValidity, refreshTokenValidity);
	}
}
