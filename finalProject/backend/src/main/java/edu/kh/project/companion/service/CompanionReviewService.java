package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 동행 후기 서비스 인터페이스
 *
 * <p>동행 후기(여행 후기)의 CRUD 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 */
public interface CompanionReviewService {

    /**
     * 후기 목록을 페이징 조회한다.
     *
     * @param page   현재 페이지 번호
     * @param size   페이지당 후기 수
     * @param search 검색어 (제목/내용, 빈 문자열이면 전체)
     * @param sort   정렬 기준 (latest | rating_desc | rating_asc)
     * @return 후기 목록
     */
    List<CompanionReviewDTO> getReviewList(int page, int size, String search, String sort);

    /**
     * 후기 총 건수를 조회한다.
     *
     * @param search 검색어 (빈 문자열이면 전체)
     * @return 총 후기 수
     */
    int getReviewCount(String search);

    /**
     * 후기 상세 정보를 조회한다.
     *
     * @param reviewNo 후기 번호
     * @return 후기 상세 정보 (없으면 null)
     */
    CompanionReviewDTO getReviewDetail(int reviewNo);

    /**
     * 동행 후기를 작성한다 (이미지 업로드 포함).
     *
     * @param review        후기 데이터
     * @param thumbnail     썸네일 이미지 파일
     * @param contentImages 본문 이미지 파일 목록
     * @param webPath       이미지 웹 접근 경로
     * @param folderPath    이미지 서버 물리 경로
     * @return 삽입된 행 수
     */
    int createReview(CompanionReviewDTO review, MultipartFile thumbnail,
                     List<MultipartFile> contentImages,
                     String webPath, String folderPath);

    /**
     * 후기를 삭제한다 (작성자만 가능).
     *
     * @param reviewNo 후기 번호
     * @param memberNo 요청한 회원 번호
     * @return 삭제된 행 수 (권한 없으면 0)
     */
    int deleteReview(int reviewNo, int memberNo);

    /**
     * 메인페이지용 최신 후기 목록을 조회한다.
     *
     * @param limit 조회할 최대 건수
     * @return 최신 후기 목록
     */
    List<CompanionReviewDTO> getRecentReviews(int limit);
}
