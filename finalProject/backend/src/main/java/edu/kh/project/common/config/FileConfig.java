package edu.kh.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 파일 업로드 관련 설정 클래스
 * 
 * @Configuration
 * - 스프링 설정용 클래스임을 명시
 * 
 * @PropertySource("classpath:/config.properties")
 * - config.properties 파일의 파일 업로드 관련 설정값을 읽어옴
 * 
 * WebMvcConfigurer
 * - Spring MVC 설정을 커스터마이징할 수 있는 인터페이스
 * - 정적 리소스 경로 매핑, 인터셉터 등록 등 가능
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class FileConfig implements WebMvcConfigurer {

	// config.properties에서 파일 경로 값 주입
	
	// 게시판 이미지 경로
	@Value("${board.image.web-path}")
	private String boardImageWebPath;
	
	@Value("${board.image.folder-path}")
	private String boardImageFolderPath;
	
	// 프로필 이미지 경로
	@Value("${profile.image.web-path}")
	private String profileImageWebPath;
	
	@Value("${profile.image.folder-path}")
	private String profileImageFolderPath;
	
	// 공통 파일 업로드 경로
	@Value("${file.upload.path}")
	private String fileUploadPath;
	
	@Value("${file.upload.url}")
	private String fileUploadUrl;
	
	
	/**
	 * 정적 리소스 핸들러 등록
	 * - 업로드된 파일에 브라우저에서 접근 가능하도록 경로 매핑
	 * 
	 * 예시:
	 * - 웹 경로: http://localhost/upload/board/image.jpg
	 * - 실제 경로: C:/finalProject/upload/board/image.jpg
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		
		// 게시판 이미지 경로 매핑
		registry.addResourceHandler(boardImageWebPath + "**")
		        .addResourceLocations("file:///" + boardImageFolderPath);
		
		// 프로필 이미지 경로 매핑
		registry.addResourceHandler(profileImageWebPath + "**")
		        .addResourceLocations("file:///" + profileImageFolderPath);
		
		// 공통 파일 업로드 경로 매핑
		registry.addResourceHandler(fileUploadUrl)
		        .addResourceLocations("file:///" + fileUploadPath);
	}
	
	
	/**
	 * MultipartResolver 빈 등록
	 * - 파일 업로드 처리를 담당하는 객체
	 * - StandardServletMultipartResolver: Servlet 3.0+ 표준 방식
	 */
	@Bean
	public MultipartResolver multipartResolver() {
		return new StandardServletMultipartResolver();
	}
}