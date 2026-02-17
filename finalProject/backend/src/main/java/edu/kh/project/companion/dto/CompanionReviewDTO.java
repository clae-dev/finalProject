package edu.kh.project.companion.dto;

import lombok.*;

/**
 * 동행 후기 DTO
 *
 * <p>COMPANION_REVIEW 테이블과 매핑되는 후기 데이터 객체.
 * 별점(1~5), 이미지, 동행 게시글 연결(선택), 작성자 정보를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionReviewDTO {

    private int reviewNo;          // 후기 번호 (PK)
    private Integer companionNo;   // 동행 게시글 번호 (FK, null 가능)
    private int memberNo;          // 작성자 번호 (FK)
    private String title;          // 후기 제목
    private String content;        // 후기 내용
    private int rating;            // 별점 (1~5)
    private String imageUrl;       // 대표 이미지 URL
    private String contentImages;  // 본문 내 이미지 URL 목록
    private String status;         // 상태 (A:활성, D:삭제)
    private String createdAt;      // 작성일
    private String updatedAt;      // 수정일

    // JOIN 파생 필드
    private String authorNickname; // 작성자 닉네임
    private String authorProfile;  // 작성자 프로필 이미지
    private String companionTitle; // 원본 동행 게시글 제목
}
