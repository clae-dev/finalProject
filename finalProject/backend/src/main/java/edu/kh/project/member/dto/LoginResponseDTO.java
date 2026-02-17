package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 로그인 응답 DTO
 *
 * <p>로그인 성공 시 프론트엔드로 반환하는 응답 데이터.
 * JWT 토큰(Access/Refresh)과 회원 기본 정보를 포함한다.</p>
 *
 * @author HONDI
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
    private String memberName;               // 이름
    private String memberNickname;           // 닉네임
    private String memberProfileImg;         // 프로필 이미지
    private String memberRole;               // 권한 (USER, ADMIN)
    private String loginType;                // 로그인 타입 (kakao, google, naver, normal)
    private String memberPhone;              // 전화번호
    private String memberIntro;              // 자기소개
    private String verifiedReviewer;         // 인증 리뷰어 여부 (Y/N)
}