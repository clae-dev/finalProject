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
 * 파일 업로드 및 정적 리소스 설정 클래스
 *
 * <p>업로드된 파일(이미지 등)에 브라우저에서 접근할 수 있도록
 * 웹 경로와 서버 물리 경로를 매핑한다.
 * config.properties에서 각 모듈별 이미지 경로를 읽어온다.</p>
 *
 * <h3>매핑 대상 모듈</h3>
 * <ul>
 *   <li>게시판(board) 이미지</li>
 *   <li>프로필(profile) 이미지</li>
 *   <li>동행(companion) 이미지</li>
 *   <li>후기(review) 이미지</li>
 *   <li>숙소(accommodation) 이미지</li>
 *   <li>명소(spot) 이미지</li>
 *   <li>인증서류(verification) 이미지</li>
 *   <li>공통 파일 업로드</li>
 * </ul>
 *
 * @author HONDI
 */
@Configuration
@PropertySource("classpath:/config.properties")
public class FileConfig implements WebMvcConfigurer {

	/** 게시판 이미지 웹 접근 경로 (예: /upload/board/) */
	@Value("${board.image.web-path}")
	private String boardImageWebPath;

	/** 게시판 이미지 서버 물리 경로 (예: C:/finalProject/upload/board/) */
	@Value("${board.image.folder-path}")
	private String boardImageFolderPath;

	/** 프로필 이미지 웹 접근 경로 */
	@Value("${profile.image.web-path}")
	private String profileImageWebPath;

	/** 프로필 이미지 서버 물리 경로 */
	@Value("${profile.image.folder-path}")
	private String profileImageFolderPath;

	/** 동행 게시글 이미지 웹 접근 경로 */
	@Value("${companion.image.web-path}")
	private String companionImageWebPath;

	/** 동행 게시글 이미지 서버 물리 경로 */
	@Value("${companion.image.folder-path}")
	private String companionImageFolderPath;

	/** 숙소 후기 이미지 웹 접근 경로 */
	@Value("${review.image.web-path}")
	private String reviewImageWebPath;

	/** 숙소 후기 이미지 서버 물리 경로 */
	@Value("${review.image.folder-path}")
	private String reviewImageFolderPath;

	/** 숙소 이미지 웹 접근 경로 */
	@Value("${accommodation.image.web-path}")
	private String accommodationImageWebPath;

	/** 숙소 이미지 서버 물리 경로 */
	@Value("${accommodation.image.folder-path}")
	private String accommodationImageFolderPath;

	/** 관광 명소 이미지 웹 접근 경로 */
	@Value("${spot.image.web-path}")
	private String spotImageWebPath;

	/** 관광 명소 이미지 서버 물리 경로 */
	@Value("${spot.image.folder-path}")
	private String spotImageFolderPath;

	/** 인증서류 이미지 웹 접근 경로 */
	@Value("${verification.image.web-path}")
	private String verificationImageWebPath;

	/** 인증서류 이미지 서버 물리 경로 */
	@Value("${verification.image.folder-path}")
	private String verificationImageFolderPath;

	/** 공통 파일 업로드 서버 물리 경로 */
	@Value("${file.upload.path}")
	private String fileUploadPath;

	/** 공통 파일 업로드 웹 접근 경로 */
	@Value("${file.upload.url}")
	private String fileUploadUrl;

	/**
	 * 정적 리소스 핸들러를 등록한다.
	 *
	 * <p>업로드된 파일에 브라우저에서 접근할 수 있도록
	 * 웹 경로(URL)와 서버의 물리적 폴더 경로를 매핑한다.</p>
	 *
	 * <pre>
	 * 예시:
	 * 웹 경로:  http://localhost/upload/board/image.jpg
	 * 실제 경로: file:///C:/finalProject/upload/board/image.jpg
	 * </pre>
	 *
	 * @param registry 리소스 핸들러 레지스트리
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		// 게시판 이미지
		registry.addResourceHandler(boardImageWebPath + "**")
				.addResourceLocations("file:///" + boardImageFolderPath);

		// 프로필 이미지
		registry.addResourceHandler(profileImageWebPath + "**")
				.addResourceLocations("file:///" + profileImageFolderPath);

		// 동행 이미지
		registry.addResourceHandler(companionImageWebPath + "**")
				.addResourceLocations("file:///" + companionImageFolderPath);

		// 후기 이미지
		registry.addResourceHandler(reviewImageWebPath + "**")
				.addResourceLocations("file:///" + reviewImageFolderPath);

		// 숙소 이미지
		registry.addResourceHandler(accommodationImageWebPath + "**")
				.addResourceLocations("file:///" + accommodationImageFolderPath);

		// 명소 이미지
		registry.addResourceHandler(spotImageWebPath + "**")
				.addResourceLocations("file:///" + spotImageFolderPath);

		// 인증서류 이미지
		registry.addResourceHandler(verificationImageWebPath + "**")
				.addResourceLocations("file:///" + verificationImageFolderPath);

		// 공통 파일 업로드
		registry.addResourceHandler(fileUploadUrl)
				.addResourceLocations("file:///" + fileUploadPath);
	}

	/**
	 * MultipartResolver 빈을 등록한다.
	 *
	 * <p>Servlet 3.0+ 표준 방식({@link StandardServletMultipartResolver})으로
	 * 멀티파트 파일 업로드 요청을 처리한다.</p>
	 *
	 * @return StandardServletMultipartResolver
	 */
	@Bean
	public MultipartResolver multipartResolver() {
		return new StandardServletMultipartResolver();
	}
}
