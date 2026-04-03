package edu.kh.project.websocket.handler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

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
 *
 * <p>/notificationSock 엔드포인트에 연결되며,
 * 서버에서 클라이언트로 단방향 push 알림을 전송한다.
 * 클라이언트 → 서버 메시지는 무시한다.</p>
 *
 * @author HONDI
 */
@Component
@Slf4j
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /** memberNo → 해당 멤버의 활성 세션 집합 (멀티탭 지원, O(1) 조회) */
    private final Map<Integer, Set<WebSocketSession>> sessionMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        int memberNo = (int) session.getAttributes().get("memberNo");
        sessionMap.computeIfAbsent(memberNo, k -> new CopyOnWriteArraySet<>()).add(session);
        log.info("알림 WebSocket 연결됨 - memberNo: {}, sessionId: {}", memberNo, session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트 → 서버 메시지는 무시 (서버 push 전용)
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Object memberNoObj = session.getAttributes().get("memberNo");
        if (memberNoObj != null) {
            int memberNo = (int) memberNoObj;
            Set<WebSocketSession> memberSessions = sessionMap.get(memberNo);
            if (memberSessions != null) {
                memberSessions.remove(session);
                if (memberSessions.isEmpty()) sessionMap.remove(memberNo);
            }
        }
        log.info("알림 WebSocket 연결 종료 - sessionId: {}", session.getId());
    }

    /**
     * 특정 사용자에게 알림 push (O(1) 세션 조회)
     *
     * @param recipientNo 수신자 회원 번호
     * @param dto         전송할 알림 데이터
     */
    public void sendToUser(int recipientNo, NotificationDTO dto) {
        Set<WebSocketSession> userSessions = sessionMap.get(recipientNo);
        if (userSessions == null || userSessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(dto);
            TextMessage textMessage = new TextMessage(json);

            for (WebSocketSession s : userSessions) {
                if (s.isOpen()) {
                    s.sendMessage(textMessage);
                }
            }
        } catch (Exception e) {
            log.error("알림 WebSocket push 실패 - recipientNo: {}", recipientNo, e);
        }
    }
}
