package edu.kh.project.websocket.handler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.kh.project.chatting.dto.MessageDTO;
import edu.kh.project.chatting.service.ChattingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 채팅 WebSocket 핸들러
 *
 * <p>TextWebSocketHandler를 확장하여 1:1 실시간 채팅을 처리한다.
 * sessions Set으로 연결을 관리하며, 메시지 수신 시 DB에 저장한 후
 * 발신자(sender)와 수신자(target)에게 브로드캐스트한다.</p>
 *
 * @author HONDI
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ChattingWebSocketHandler extends TextWebSocketHandler {

    private final ChattingService chattingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        int memberNo = (int) session.getAttributes().get("memberNo");
        log.info("WebSocket 연결됨 - memberNo: {}, sessionId: {}", memberNo, session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        // JSON 파싱
        MessageDTO msg = objectMapper.readValue(message.getPayload(), MessageDTO.class);

        // 발신자 번호를 WebSocket 세션에서 가져옴 (조작 방지)
        int senderNo = (int) session.getAttributes().get("memberNo");
        msg.setSenderNo(senderNo);

        // DB 저장
        int result = chattingService.insertMessage(msg);

        if (result > 0) {
            // 발신자 + 수신자에게 메시지 전달
            int targetNo = msg.getTargetNo();

            String jsonMsg = objectMapper.writeValueAsString(msg);
            TextMessage textMsg = new TextMessage(jsonMsg);

            synchronized (sessions) {
                for (WebSocketSession s : sessions) {
                    if (!s.isOpen()) continue;

                    int sessionMemberNo = (int) s.getAttributes().get("memberNo");

                    // 같은 채팅방의 발신자 또는 수신자에게만 전송
                    if (sessionMemberNo == senderNo || sessionMemberNo == targetNo) {
                        s.sendMessage(textMsg);
                    }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("WebSocket 연결 종료 - sessionId: {}", session.getId());
    }
}
