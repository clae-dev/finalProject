package edu.kh.project.companion.dto;

import lombok.*;

/**
 * 동행 참가 신청 DTO
 * - COMPANION_JOIN 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionJoinDTO {

    private int joinNo;            // 참가 신청 번호 (PK)
    private int companionNo;       // 동행 게시글 번호 (FK)
    private int memberNo;          // 신청자 번호 (FK)
    private String status;         // 상태 (W:대기, A:수락, C:거절)
    private String createdAt;      // 신청일

    // JOIN 파생 필드 (신청자 정보)
    private String memberNickname; // 신청자 닉네임
    private String memberProfile;  // 신청자 프로필 이미지
}
