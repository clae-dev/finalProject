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
 *
 * <p>제주 여행 AI 도우미 '창식이'와의 대화를 처리하는 REST 컨트롤러.
 * JWT 인증을 통해 로그인된 사용자만 AI 채팅을 이용할 수 있다.</p>
 *
 * <ul>
 *   <li>POST /api/ai/chat - AI 채팅 메시지 전송 및 응답 수신</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiChatController {

    /** AI 채팅 비즈니스 로직 서비스 */
    private final AiChatService aiChatService;

    /** JWT 토큰 유틸리티 */
    private final JwtUtil jwtUtil;

    /**
     * Authorization 헤더에서 회원 번호(memberNo)를 추출한다.
     *
     * @param authHeader "Bearer {token}" 형태의 인증 헤더
     * @return 토큰에 포함된 회원 번호
     * @throws JwtException 토큰이 유효하지 않을 경우
     */
    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * AI 채팅 요청을 처리하고 응답을 반환한다.
     *
     * <p>클라이언트로부터 사용자 메시지와 대화 히스토리를 받아
     * OpenAI API를 통해 AI 응답을 생성한다.</p>
     *
     * <pre>
     * 요청 예시:
     * POST /api/ai/chat
     * Headers: Authorization: Bearer {accessToken}
     * Body: { "message": "제주 맛집 추천해줘", "history": [...] }
     *
     * 성공 응답: { "success": true, "data": { "reply": "혼저옵서예~ ..." } }
     * 인증 실패: 401 { "success": false, "message": "인증이 만료되었습니다." }
     * 서버 오류: 500 { "success": false, "message": "AI 응답 생성 중 오류가 발생했습니다." }
     * </pre>
     *
     * @param authHeader Authorization 헤더 (Bearer 토큰)
     * @param request    사용자 메시지와 대화 히스토리를 담은 요청 DTO
     * @return AI 응답 결과를 포함한 ResponseEntity
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AiChatRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // JWT 인증 확인 (유효하지 않으면 JwtException 발생)
            extractMemberNo(authHeader);

            // OpenAI API를 통해 AI 응답 생성
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
