package edu.kh.project.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이메일 인증 관련 DTO 모음 클래스
 *
 * <p>인증 코드 발송 요청, 검증 요청, 응답을 위한 내부 정적 DTO를 포함한다.</p>
 *
 * @author HONDI
 */
public class EmailDTO {

    /**
     * 인증 코드 발송 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendCodeRequest {
        /** 인증 코드를 받을 이메일 주소 */
        private String email;
    }

    /**
     * 인증 코드 검증 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyCodeRequest {
        /** 인증 대상 이메일 주소 */
        private String email;
        /** 사용자가 입력한 6자리 인증 코드 */
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
        /** 처리 성공 여부 */
        private boolean success;
        /** 결과 메시지 */
        private String message;
    }
}
