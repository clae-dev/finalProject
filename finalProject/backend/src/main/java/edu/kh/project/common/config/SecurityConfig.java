package edu.kh.project.common.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security 설정 클래스
 *
 * <p>비밀번호 암호화, CORS 정책, 보안 필터 체인을 구성한다.
 * JWT 기반 인증을 사용하므로 CSRF는 비활성화하고,
 * 인증/인가는 각 컨트롤러에서 JWT를 직접 검증하는 방식이다.</p>
 *
 * <h3>구성 요소</h3>
 * <ul>
 *   <li>{@link PasswordEncoder} - BCrypt 비밀번호 암호화</li>
 *   <li>{@link CorsConfigurationSource} - CORS 허용 정책</li>
 *   <li>{@link SecurityFilterChain} - 보안 필터 체인 (CSRF 비활성화, 전체 요청 허용)</li>
 * </ul>
 *
 * @author HONDI
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 비밀번호 암호화 인코더를 등록한다.
     *
     * <p>BCrypt 해시 알고리즘을 사용하여 비밀번호를 안전하게 암호화한다.
     * 회원가입, 로그인, 비밀번호 변경 시 사용된다.</p>
     *
     * @return BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS(Cross-Origin Resource Sharing) 설정을 구성한다.
     *
     * <p>프론트엔드(React)에서 백엔드 API로의 교차 출처 요청을 허용한다.</p>
     *
     * <h3>허용 정책</h3>
     * <ul>
     *   <li>Origin: localhost:5173, localhost:3000, 127.0.0.1:5173</li>
     *   <li>Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS</li>
     *   <li>Headers: 전체 허용</li>
     *   <li>Credentials: 허용 (쿠키, Authorization 헤더)</li>
     *   <li>Preflight 캐시: 1시간 (3600초)</li>
     * </ul>
     *
     * @return CORS 설정 소스
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 Origin (프론트엔드 개발 서버 + 배포 도메인)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "https://hondi.site",
            "https://www.hondi.site"
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // 모든 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 인증 정보(쿠키, Authorization 헤더) 포함 허용
        configuration.setAllowCredentials(true);

        // Preflight 요청 캐시 시간 (1시간)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * 보안 필터 체인을 구성한다.
     *
     * <p>JWT 기반 인증 구조이므로 다음과 같이 설정한다:</p>
     * <ul>
     *   <li>CORS: corsConfigurationSource() 적용</li>
     *   <li>CSRF: 비활성화 (REST API 서버이므로 불필요)</li>
     *   <li>X-Frame-Options: 비활성화 (SockJS WebSocket iframe 폴백 허용)</li>
     *   <li>요청 인가: 전체 허용 (JWT 검증은 컨트롤러 레벨에서 수행)</li>
     * </ul>
     *
     * @param http HttpSecurity 설정 빌더
     * @return 구성된 SecurityFilterChain
     * @throws Exception 보안 설정 실패 시
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
