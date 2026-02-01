package edu.kh.project.common.config;

import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security 설정
 * - CSR(React) 방식을 위한 CORS 설정
 * - JWT 기반 인증 (Session 비사용)
 * - REST API 보안 설정
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * BCrypt 비밀번호 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Security Filter Chain 설정
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 비활성화 (JWT 사용으로 불필요)
            .csrf(csrf -> csrf.disable())
            
            // CORS 설정 적용
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Session 사용 안함 (JWT 기반 인증)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 요청 권한 설정
            .authorizeHttpRequests(auth -> auth
                // 공개 API (인증 불필요)
                .requestMatchers(
                    "/api/member/signup",           // 회원가입
                    "/api/member/login",            // 로그인
                    "/api/member/check-email",      // 이메일 중복 체크
                    "/api/member/check-nickname",   // 닉네임 중복 체크
                    "/api/member/find-id",          // 아이디 찾기
                    "/api/member/find-password",    // 비밀번호 찾기
                    "/api/accommodation/**",        // 숙소 정보 조회 (공개)
                    "/api/board/notice/**",         // 공지사항 조회 (공개)
                    "/api/faq/**",                  // FAQ 조회 (공개)
                    "/api/main/**"                  // 메인 페이지 API
                ).permitAll()
                
                // 관리자 전용 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 나머지 API는 인증 필요
                .anyRequest().authenticated()
            );

        return http.build();
    }

    /**
     * CORS 설정 (React와 통신)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // React 개발 서버 주소 허용 - Vite 포트 5173 추가!
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",           // React (CRA)
            "http://localhost:5173",           // Vite 개발 서버 ⭐
            "http://localhost:80",             // 배포시 프론트엔드 주소
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"            // Vite (로컬 IP) ⭐
        ));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 인증 정보 포함 허용 (JWT 토큰)
        configuration.setAllowCredentials(true);
        
        // 브라우저가 응답 헤더를 읽을 수 있도록 노출
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", "Refresh-Token"
        ));
        
        // Preflight 요청 캐시 시간 (초)
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}