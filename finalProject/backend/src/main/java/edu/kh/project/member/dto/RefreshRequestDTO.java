package edu.kh.project.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 토큰 갱신 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
public class RefreshRequestDTO {
    private String refreshToken;
}
