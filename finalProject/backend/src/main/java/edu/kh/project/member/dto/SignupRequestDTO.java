package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 회원가입 요청 DTO
 *
 * <p>회원가입 폼에서 전달받는 신규 회원 정보를 담는 객체.
 * 이메일, 비밀번호, 닉네임, 이름 등 필수 가입 정보와
 * 생년월일(만 14세 이상 확인용)을 포함한다.</p>
 *
 * @author HONDI
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
    private String memberProfileImg;         // 프로필 이미지 (DiceBear URL)
    private String memberBirthDate;          // 생년월일 (YYYY-MM-DD)
}