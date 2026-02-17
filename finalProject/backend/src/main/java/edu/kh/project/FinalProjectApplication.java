package edu.kh.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

/**
 * HONDI 제주 혼행 플랫폼 – Spring Boot 메인 애플리케이션
 *
 * <p>SecurityAutoConfiguration을 제외하고 JWT 기반 커스텀 인증을 사용한다.</p>
 *
 * @author HONDI
 */
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class FinalProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);
	}

}
