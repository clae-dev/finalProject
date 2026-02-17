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
 *
 * <p>애플리케이션 전체에서 발생하는 예외를 공통으로 처리한다.
 * 각 컨트롤러에서 개별적으로 처리하지 않은 예외가 이 핸들러에 의해 잡히며,
 * 적절한 HTTP 상태 코드와 JSON 응답을 반환한다.</p>
 *
 * <h3>처리 대상 예외</h3>
 * <ul>
 *   <li>{@link JwtException} - JWT 인증 실패 → 401 UNAUTHORIZED 반환</li>
 * </ul>
 *
 * <p>401 응답은 프론트엔드 Axios 인터셉터의 자동 토큰 갱신 로직을 트리거한다.</p>
 *
 * @author HONDI
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * JWT 관련 예외를 처리한다.
     *
     * <p>토큰 만료, 서명 불일치, 형식 오류 등 모든 JWT 예외를
     * HTTP 401(UNAUTHORIZED)로 변환하여 반환한다.</p>
     *
     * @param e JWT 예외 객체
     * @return 401 상태 코드와 에러 메시지를 포함한 응답
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(JwtException e) {
        log.warn("JWT 인증 실패: {}", e.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증이 만료되었습니다. 다시 로그인해주세요.");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
