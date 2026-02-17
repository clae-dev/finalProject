package edu.kh.project.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 로그인 요청 DTO
 *
 * <p>클라이언트에서 전달받는 로그인 폼 데이터를 담는 객체.
 * 이메일(아이디), 비밀번호, 이메일 저장 여부를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginRequestDTO {
    
    private String memberEmail;              // 이메일 (아이디)
    private String memberPw;                 // 비밀번호
    private boolean saveEmail;               // 이메일 저장 여부
}