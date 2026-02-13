package edu.kh.project.common.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;

/**
 * 전역 예외 처리 핸들러
 * - JWT 관련 예외를 401로 반환하여 프론트엔드 인터셉터의 자동 갱신 로직이 동작하도록 함
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(JwtException e) {
        log.warn("JWT 인증 실패: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증이 만료되었습니다. 다시 로그인해주세요.");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
