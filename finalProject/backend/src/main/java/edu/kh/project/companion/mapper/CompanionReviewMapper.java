package edu.kh.project.companion.mapper;

import edu.kh.project.companion.dto.CompanionReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CompanionReviewMapper {

    List<CompanionReviewDTO> selectReviewList(
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    int selectReviewCount();

    CompanionReviewDTO selectReviewDetail(@Param("reviewNo") int reviewNo);

    int insertReview(CompanionReviewDTO review);

    int deleteReview(
        @Param("reviewNo") int reviewNo,
        @Param("memberNo") int memberNo
    );

    List<CompanionReviewDTO> selectRecentReviews(@Param("limit") int limit);
}
