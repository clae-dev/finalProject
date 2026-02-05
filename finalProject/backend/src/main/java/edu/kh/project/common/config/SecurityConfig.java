package edu.kh.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * PasswordEncoder Bean 등록
     * - 비밀번호 암호화에 사용
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * SecurityFilterChain 설정
     * - 인증/인가 규칙 정의
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            // CSRF 비활성화 (API 서버용)
            .csrf(csrf -> csrf.disable())
            
            // 요청별 인증 설정
            .authorizeHttpRequests(auth -> auth
                // 일단 모든 요청 허용 (테스트용)
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}