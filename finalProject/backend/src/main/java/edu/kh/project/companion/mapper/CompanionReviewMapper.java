package edu.kh.project.companion.mapper;

import edu.kh.project.companion.dto.CompanionReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 동행 후기 MyBatis Mapper
 */
@Mapper
public interface CompanionReviewMapper {

    /** 후기 목록 조회 (페이징) */
    List<CompanionReviewDTO> selectReviewList(
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    /** 후기 총 수 */
    int selectReviewCount();

    /** 후기 상세 조회 */
    CompanionReviewDTO selectReviewDetail(@Param("reviewNo") int reviewNo);

    /** 후기 등록 */
    int insertReview(CompanionReviewDTO review);

    /** 후기 삭제 (작성자) */
    int deleteReview(
        @Param("reviewNo") int reviewNo,
        @Param("memberNo") int memberNo
    );

    /** 최근 후기 목록 (메인페이지용) */
    List<CompanionReviewDTO> selectRecentReviews(@Param("limit") int limit);
}
