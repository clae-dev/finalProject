package edu.kh.project.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 토큰 갱신 요청 DTO
 *
 * <p>Access Token이 만료되었을 때 Refresh Token을 사용하여
 * 새로운 Access Token을 발급받기 위한 요청 데이터.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
public class RefreshRequestDTO {
    private String refreshToken;
}
