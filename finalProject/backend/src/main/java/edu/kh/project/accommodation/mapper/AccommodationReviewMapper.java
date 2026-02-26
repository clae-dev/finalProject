package edu.kh.project.accommodation.mapper;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import edu.kh.project.accommodation.dto.ReviewImageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 숙소 후기 MyBatis Mapper
 *
 * <p>ACCOMMODATION_REVIEW, REVIEW_IMAGE 테이블에 대한 SQL 매핑 인터페이스.
 * 후기 CRUD, 이미지 관리, 요약 통계, 인증 리뷰어 확인 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface AccommodationReviewMapper {

    /** 후기 목록 조회 (페이징) */
    List<AccommodationReviewDTO> selectReviewList(
            @Param("accommodationNo") int accommodationNo,
            @Param("offset") int offset,
            @Param("limit") int limit);

    /** 후기 총 개수 */
    int selectReviewCount(@Param("accommodationNo") int accommodationNo);

    /** 후기 요약 (평균 별점 + 총 개수) */
    Map<String, Object> selectReviewSummary(@Param("accommodationNo") int accommodationNo);

    /** 후기 등록 */
    int insertReview(AccommodationReviewDTO dto);

    /** 후기 이미지 등록 */
    int insertReviewImage(ReviewImageDTO dto);

    /** 후기 이미지 목록 조회 */
    List<ReviewImageDTO> selectReviewImages(@Param("reviewNo") int reviewNo);

    /** 후기 삭제 (본인) */
    int deleteReview(@Param("reviewNo") int reviewNo, @Param("memberNo") int memberNo);

}
