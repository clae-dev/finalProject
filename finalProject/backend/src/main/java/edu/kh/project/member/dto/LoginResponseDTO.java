package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 로그인 응답 DTO
 * - JWT 토큰 + 회원 기본 정보
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LoginResponseDTO {
    
    private String accessToken;              // Access Token (30분)
    private String refreshToken;             // Refresh Token (7일)
    private int memberNo;                    // 회원 번호
    private String memberEmail;              // 이메일
    private String memberNickname;           // 닉네임
    private String memberProfileImg;         // 프로필 이미지
    private String memberRole;               // 권한 (USER, ADMIN)
}