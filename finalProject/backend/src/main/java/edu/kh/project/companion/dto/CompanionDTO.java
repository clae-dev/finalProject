package edu.kh.project.companion.dto;

import lombok.*;

/**
 * 동행 모집 게시글 DTO
 * - COMPANION_BOARD 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionDTO {

    private int companionNo;       // 동행 게시글 번호 (PK)
    private String title;          // 제목
    private String content;        // 내용
    private String imageUrl;       // 대표 이미지 URL
    private String travelDate;     // 여행 날짜
    private int maxMembers;        // 최대 인원
    private String tags;           // 태그 (#등산 #한라산 등)
    private String status;         // 상태 (Y:모집중, N:마감)
    private int memberNo;          // 작성자 번호 (FK)
    private String createdAt;      // 작성일
    private String updatedAt;      // 수정일
    private String contentImages;  // 본문 내 이미지 URL 목록

    // JOIN 파생 필드 (작성자 정보)
    private String authorNickname; // 작성자 닉네임
    private String authorProfile;  // 작성자 프로필 이미지
    private String authorAgeRange; // 작성자 연령대
    private int currentMembers;    // 현재 참여 인원
}
