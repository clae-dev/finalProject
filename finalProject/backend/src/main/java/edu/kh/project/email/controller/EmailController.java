package edu.kh.project.email.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.email.dto.EmailDTO;
import edu.kh.project.email.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 이메일 인증 REST API Controller
 */
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    /**
     * 인증 코드 발송
     * @param request 이메일 정보
     * @return 발송 결과
     */
    @PostMapping("/send-code")
    public ResponseEntity<Map<String, Object>> sendVerificationCode(
            @RequestBody EmailDTO.SendCodeRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 이메일 유효성 검사
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                response.put("success", false);
                response.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이메일 형식 검사
            if (!isValidEmail(request.getEmail())) {
                response.put("success", false);
                response.put("message", "올바른 이메일 형식이 아닙니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 인증 코드 발송
            emailService.sendVerificationCode(request.getEmail());

            response.put("success", true);
            response.put("message", "인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("인증 코드 발송 실패: {}", request.getEmail(), e);
            response.put("success", false);
            response.put("message", "인증 코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 인증 코드 검증
     * @param request 이메일 및 인증 코드
     * @return 검증 결과
     */
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(
            @RequestBody EmailDTO.VerifyCodeRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 입력값 검사
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                response.put("success", false);
                response.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getCode() == null || request.getCode().isBlank()) {
                response.put("success", false);
                response.put("message", "인증 코드를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 인증 코드 검증
            boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode());

            if (isValid) {
                response.put("success", true);
                response.put("message", "이메일 인증이 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "인증 코드가 일치하지 않거나 만료되었습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("인증 코드 검증 실패: {}", request.getEmail(), e);
            response.put("success", false);
            response.put("message", "인증 코드 검증 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 이메일 형식 검사
     * @param email 이메일
     * @return 유효성 여부
     */
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(emailRegex);
    }
}
