package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * 회원 정보 DTO
 * - DB MEMBER 테이블과 매핑
 * - MyBatis 조회 결과 매핑용
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MemberDTO {
    
    private int memberNo;                    // 회원 번호 (PK)
    private String memberEmail;              // 이메일 (아이디)
    private String memberPw;                 // 비밀번호 (암호화)
    private String memberNickname;           // 닉네임
    private String memberName;               // 이름
    private String memberPhone;              // 휴대폰 번호
    private String memberGender;             // 성별 (M/F)
    private String memberAgeGroup;           // 연령대
    private String memberProfileImg;         // 프로필 이미지
    private String memberIntro;              // 자기소개
    private String memberRole;               // 권한 (USER, ADMIN)
    private String memberStatus;             // 상태 (ACTIVE, WITHDRAWN)
    private String emailVerified;            // 이메일 인증 여부 (Y/N)
    private LocalDateTime createdAt;         // 가입일
    private LocalDateTime updatedAt;         // 수정일
    private LocalDateTime withdrawnAt;       // 탈퇴일
    
    // 추가 필드 (조회 시 필요한 정보)
    private int postCount;                   // 작성 글 수
    private int reviewCount;                 // 작성 후기 수
}