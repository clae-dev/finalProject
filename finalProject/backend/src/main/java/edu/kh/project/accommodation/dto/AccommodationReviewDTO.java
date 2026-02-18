package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 숙소 후기 DTO
 *
 * <p>ACCOMMODATION_REVIEW 테이블과 매핑되는 후기 데이터 객체.
 * 별점, 체크인/아웃 날짜, 추천 대상, 첨부 이미지 목록, 작성자 정보를 포함한다.</p>
 *
 * @author HONDI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationReviewDTO {

    private int reviewNo;
    private int accommodationNo;
    private int memberNo;
    /** 별점 (1~5) */
    private double rating;
    private String content;
    private String checkInDate;
    private String checkOutDate;
    /** 추천 대상 (혼행족, 커플 등) */
    private String recommendedFor;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    private String createdAt;
    private String updatedAt;

    private String authorNickname;
    private String authorProfileImg;
    /** 인증 리뷰어 여부 (Y/N) */
    private String verifiedReviewer;

    private List<ReviewImageDTO> images;
}
