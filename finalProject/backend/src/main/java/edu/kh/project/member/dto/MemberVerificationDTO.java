package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 회원 인증 서류 DTO
 * - MEMBER_VERIFICATION 테이블과 매핑
 * - 인증뱃지 발급을 위한 서류 심사 정보
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MemberVerificationDTO {

    private int verificationNo;       // 인증 번호 (PK)
    private int memberNo;             // 신청 회원 번호 (FK)
    private String verificationFile;  // 인증 서류 파일 경로
    private String originalName;      // 원본 파일명
    private String renamedName;       // 저장된 파일명 (UUID)
    private String status;            // 상태 (W:대기, Y:승인, R:거부)
    private String adminComment;      // 관리자 코멘트
    private String submittedAt;       // 제출일
    private String processedAt;       // 처리일
    private int processedBy;          // 처리 관리자 번호

    // JOIN 결과 (신청자 정보)
    private String memberNickname;    // 신청자 닉네임
    private String memberEmail;       // 신청자 이메일
    private String memberProfileImg;  // 신청자 프로필 이미지
}
