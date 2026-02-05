package edu.kh.project.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이메일 인증 관련 DTO
 */
public class EmailDTO {

    /**
     * 인증 코드 발송 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendCodeRequest {
        private String email;
    }

    /**
     * 인증 코드 검증 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyCodeRequest {
        private String email;
        private String code;
    }

    /**
     * 이메일 인증 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmailResponse {
        private boolean success;
        private String message;
    }
}
