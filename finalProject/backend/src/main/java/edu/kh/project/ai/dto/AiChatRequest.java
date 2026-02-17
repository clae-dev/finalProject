package edu.kh.project.ai.dto;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AI 채팅 요청 DTO
 *
 * <p>프론트엔드에서 AI 채팅 API로 전달하는 요청 데이터를 담는 객체.
 * 사용자의 현재 입력 메시지와 이전 대화 히스토리를 포함한다.</p>
 *
 * <pre>
 * 요청 JSON 예시:
 * {
 *   "message": "제주 맛집 추천해줘",
 *   "history": [
 *     { "role": "user", "content": "안녕" },
 *     { "role": "assistant", "content": "혼저옵서예~ 🍊" }
 *   ]
 * }
 * </pre>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
public class AiChatRequest {

    /** 사용자가 현재 입력한 메시지 */
    private String message;

    /**
     * 이전 대화 히스토리 목록.
     * 각 항목은 "role"(user/assistant)과 "content"(메시지 내용) 키를 가진 Map이다.
     */
    private List<Map<String, String>> history;
}
