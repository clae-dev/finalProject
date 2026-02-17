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

    /** 후기 번호 (PK) */
    private int reviewNo;
    /** 숙소 번호 (FK → ACCOMMODATION) */
    private int accommodationNo;
    /** 작성자 번호 (FK → MEMBER) */
    private int memberNo;
    /** 별점 (1~5) */
    private double rating;
    /** 후기 내용 */
    private String content;
    /** 체크인 날짜 */
    private String checkInDate;
    /** 체크아웃 날짜 */
    private String checkOutDate;
    /** 추천 대상 (혼행족, 커플 등) */
    private String recommendedFor;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    /** 작성일 */
    private String createdAt;
    /** 수정일 */
    private String updatedAt;

    // ==================== JOIN 파생 필드 ====================

    /** 작성자 닉네임 */
    private String authorNickname;
    /** 작성자 프로필 이미지 */
    private String authorProfileImg;
    /** 인증 리뷰어 여부 (Y/N) */
    private String verifiedReviewer;

    /** 후기 첨부 이미지 목록 */
    private List<ReviewImageDTO> images;
}
