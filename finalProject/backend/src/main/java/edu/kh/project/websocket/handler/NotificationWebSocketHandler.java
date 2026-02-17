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

import edu.kh.project.notification.dto.NotificationDTO;
import lombok.extern.slf4j.Slf4j;

/**
 * 알림 전용 WebSocket 핸들러
 * - /notificationSock 엔드포인트
 * - 서버 → 클라이언트 단방향 push
 */
@Component
@Slf4j
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        int memberNo = (int) session.getAttributes().get("memberNo");
        log.info("알림 WebSocket 연결됨 - memberNo: {}, sessionId: {}", memberNo, session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트 → 서버 메시지는 무시 (서버 push 전용)
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("알림 WebSocket 연결 종료 - sessionId: {}", session.getId());
    }

    /**
     * 특정 사용자에게 알림 push
     */
    public void sendToUser(int recipientNo, NotificationDTO dto) {
        try {
            String json = objectMapper.writeValueAsString(dto);
            TextMessage textMessage = new TextMessage(json);

            synchronized (sessions) {
                for (WebSocketSession s : sessions) {
                    if (!s.isOpen()) continue;

                    int sessionMemberNo = (int) s.getAttributes().get("memberNo");
                    if (sessionMemberNo == recipientNo) {
                        s.sendMessage(textMessage);
                    }
                }
            }
        } catch (Exception e) {
            log.error("알림 WebSocket push 실패 - recipientNo: {}", recipientNo, e);
        }
    }
}
