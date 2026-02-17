package edu.kh.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

/**
 * HONDI 제주 혼행 플랫폼 - Spring Boot 메인 애플리케이션 (SecurityAutoConfiguration 제외: JWT 기반 인증 사용)
 */
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class FinalProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);
	}

}
