package edu.kh.project.accommodation.mapper;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import edu.kh.project.accommodation.dto.ReviewImageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AccommodationReviewMapper {

    List<AccommodationReviewDTO> selectReviewList(
            @Param("accommodationNo") int accommodationNo,
            @Param("offset") int offset,
            @Param("limit") int limit);

    int selectReviewCount(@Param("accommodationNo") int accommodationNo);

    Map<String, Object> selectReviewSummary(@Param("accommodationNo") int accommodationNo);

    int insertReview(AccommodationReviewDTO dto);

    int insertReviewImage(ReviewImageDTO dto);

    List<ReviewImageDTO> selectReviewImages(@Param("reviewNo") int reviewNo);

    int deleteReview(@Param("reviewNo") int reviewNo, @Param("memberNo") int memberNo);

    int deleteReviewByAdmin(@Param("reviewNo") int reviewNo);

    String selectMemberVerifiedReviewer(@Param("memberNo") int memberNo);
}
