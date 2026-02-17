package edu.kh.project.ai.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.ai.dto.AiChatRequest;
import edu.kh.project.ai.service.AiChatService;
import edu.kh.project.common.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AI 창식이 채팅 API 컨트롤러
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiChatController {

    private final AiChatService aiChatService;
    private final JwtUtil jwtUtil;

    /**
     * Authorization 헤더에서 memberNo 추출
     */
    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * AI 채팅 요청
     * POST /api/ai/chat
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AiChatRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // JWT 인증 확인
            extractMemberNo(authHeader);

            String reply = aiChatService.chat(request.getMessage(), request.getHistory());

            Map<String, String> data = new HashMap<>();
            data.put("reply", reply);

            response.put("success", true);
            response.put("data", data);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("AI 채팅 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("AI 채팅 실패", e);
            response.put("success", false);
            response.put("message", "AI 응답 생성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
