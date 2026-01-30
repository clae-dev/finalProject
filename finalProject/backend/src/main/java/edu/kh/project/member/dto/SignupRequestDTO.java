package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 회원가입 요청 DTO
 * - 클라이언트에서 전달받는 회원가입 정보
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignupRequestDTO {
    
    private String memberEmail;              // 이메일 (아이디)
    private String memberPw;                 // 비밀번호
    private String memberNickname;           // 닉네임
    private String memberName;               // 이름
    private String memberPhone;              // 휴대폰 번호
    private String memberGender;             // 성별 (M/F)
    private String memberAgeGroup;           // 연령대
}