package edu.kh.project.accommodation.service;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 숙소 후기 서비스 인터페이스
 *
 * <p>숙소 후기 목록 조회, 요약 통계, 작성, 삭제 등
 * 숙소 리뷰 관련 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 * @see AccommodationReviewServiceImpl
 */
public interface AccommodationReviewService {

    /**
     * 숙소별 후기 목록을 페이징 조회한다.
     *
     * @param accommodationNo 숙소 번호
     * @param page            현재 페이지
     * @param size            페이지당 후기 수
     * @return 후기 목록 및 총 개수를 포함한 Map
     */
    Map<String, Object> getReviewList(int accommodationNo, int page, int size);

    /**
     * 숙소별 후기 요약 통계를 조회한다 (평균 별점, 총 후기 수 등).
     *
     * @param accommodationNo 숙소 번호
     * @return 후기 요약 통계 Map
     */
    Map<String, Object> getReviewSummary(int accommodationNo);

    /**
     * 숙소 후기를 작성한다 (인증 리뷰어만 가능).
     *
     * @param dto        후기 정보 DTO
     * @param images     후기 이미지 파일 목록 (최대 5장)
     * @param webPath    이미지 웹 접근 경로
     * @param folderPath 이미지 서버 저장 경로
     * @return 생성된 후기 번호
     */
    int createReview(AccommodationReviewDTO dto, List<MultipartFile> images,
                     MultipartFile verificationFile,
                     String webPath, String folderPath,
                     String verificationWebPath, String verificationFolderPath);

    /**
     * 숙소 후기를 삭제한다 (작성자만 가능).
     *
     * @param reviewNo 삭제할 후기 번호
     * @param memberNo 요청한 회원 번호
     * @return 삭제된 행 수
     */
    int deleteReview(int reviewNo, int memberNo);
}
