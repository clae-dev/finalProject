package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 숙소 후기 DTO
 * - ACCOMMODATION_REVIEW 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationReviewDTO {

    private int reviewNo;            // 후기 번호 (PK)
    private int accommodationNo;     // 숙소 번호 (FK)
    private int memberNo;            // 작성자 번호 (FK)
    private double rating;           // 별점 (1~5)
    private String content;          // 후기 내용
    private String checkInDate;      // 체크인 날짜
    private String checkOutDate;     // 체크아웃 날짜
    private String recommendedFor;   // 추천 대상 (혼행족, 커플 등)
    private String status;           // 상태 (A:활성, D:삭제)
    private String createdAt;        // 작성일
    private String updatedAt;        // 수정일

    // JOIN 결과 (작성자 정보)
    private String authorNickname;   // 작성자 닉네임
    private String authorProfileImg; // 작성자 프로필 이미지
    private String verifiedReviewer; // 인증 리뷰어 여부 (Y/N)

    // 후기 첨부 이미지 목록
    private List<ReviewImageDTO> images;
}
