package edu.kh.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 설정
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