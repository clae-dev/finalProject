package edu.kh.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 설정
 * - CORS 설정 (React 연동)
 * - 파일 업로드 경로 매핑
 * - 정적 리소스 경로 설정
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // TODO: application.properties에 추가 필요
    // file.upload.path=C:/uploadFiles/
    // file.upload.url=/uploaded-files/**

    @Value("${file.upload.path:C:/uploadFiles/}")
    private String uploadPath;

    @Value("${file.upload.url:/uploaded-files/**}")
    private String uploadUrl;

    /**
     * CORS 설정
     * - React 개발 서버(localhost:5173)에서 API 호출 허용
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")  // React 개발 서버
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    /**
     * 정적 리소스 핸들러 등록
     * - 업로드된 파일에 접근 가능하도록 경로 매핑
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 파일 업로드 경로 매핑
        // 예: http://localhost:8080/uploaded-files/profile/image.jpg
        //   → C:/uploadFiles/profile/image.jpg
        registry.addResourceHandler(uploadUrl)
                .addResourceLocations("file:///" + uploadPath);
    }
}