package edu.kh.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * RestTemplate 설정 클래스
 *
 * <p>외부 API(OpenAI, 한국관광공사 TourAPI, 기상청 API 등) 호출을 위한
 * HTTP 클라이언트 {@link RestTemplate}을 Spring Bean으로 등록한다.</p>
 *
 * @author HONDI
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate 빈을 등록한다.
     *
     * <p>Spring의 동기식 HTTP 클라이언트로, GET/POST 등의 HTTP 요청을
     * 간편하게 수행할 수 있다.</p>
     *
     * @return RestTemplate 인스턴스
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
