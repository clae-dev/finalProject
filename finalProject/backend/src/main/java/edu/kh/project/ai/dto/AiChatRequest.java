package edu.kh.project.ai.dto;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AI 채팅 요청 DTO
 * - 프론트엔드에서 전달하는 AI 대화 메시지와 히스토리
 */
@Getter
@Setter
@NoArgsConstructor
public class AiChatRequest {

    private String message;                      // 사용자 입력 메시지
    private List<Map<String, String>> history;   // 이전 대화 히스토리 [{role, content}]
}
