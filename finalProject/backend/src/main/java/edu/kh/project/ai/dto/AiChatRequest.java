package edu.kh.project.ai.dto;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AiChatRequest {

    private String message;
    private List<Map<String, String>> history;
}
