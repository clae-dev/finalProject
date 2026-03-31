package edu.kh.project.websocket.handler;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.kh.project.chatting.dto.GroupMessageDTO;
import edu.kh.project.chatting.dto.MessageDTO;
import edu.kh.project.chatting.service.ChattingService;
import edu.kh.project.chatting.service.GroupChatService;
import edu.kh.project.member.service.MemberService;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 채팅 WebSocket 핸들러
 *
 * <p>1:1 채팅과 그룹 채팅을 단일 엔드포인트(/chattingSock)에서 처리한다.
 * 수신 메시지의 {@code isGroupMessage} 플래그로 두 경로를 분기한다.</p>
 *
 * <ul>
 *   <li>isGroupMessage == true → 그룹 경로: DB 저장 후 방 멤버 전체 브로드캐스트</li>
 *   <li>else → 기존 1:1 경로: 발신자·수신자에게만 전송 + 알림</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ChattingWebSocketHandler extends TextWebSocketHandler {

    private final ChattingService chattingService;
    private final GroupChatService groupChatService;
    private final NotificationService notificationService;
    private final MemberService memberService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** memberNo → 해당 멤버의 활성 세션 집합 (멀티탭 지원) */
    private final Map<Integer, Set<WebSocketSession>> sessionMap = new ConcurrentHashMap<>();

    /** 그룹 멤버 캐시: groupRoomNo → {memberNos, expireTimeMillis} */
    private final Map<Integer, CachedMembers> groupMemberCache = new ConcurrentHashMap<>();
    private static final long GROUP_MEMBER_CACHE_TTL = 5 * 60 * 1000L; // 5분

    private record CachedMembers(List<Integer> memberNos, long expireAt) {
        boolean isExpired() { return System.currentTimeMillis() > expireAt; }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Object memberNoObj = session.getAttributes().get("memberNo");
        if (memberNoObj == null) {
            log.warn("WebSocket 연결 거부 - memberNo 없음: {}", session.getId());
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        int memberNo = (int) memberNoObj;
        sessionMap.computeIfAbsent(memberNo, k -> new CopyOnWriteArraySet<>()).add(session);
        log.info("WebSocket 연결됨 - memberNo: {}, sessionId: {}", memberNo, session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        // 발신자 번호를 세션에서 가져옴 (조작 방지)
        Object senderNoObj = session.getAttributes().get("memberNo");
        if (senderNoObj == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        int senderNo = (int) senderNoObj;

        // JSON 파싱 — isGroupMessage 플래그 확인
        JsonNode root = objectMapper.readTree(message.getPayload());
        boolean isGroup = root.has("isGroupMessage") && root.get("isGroupMessage").asBoolean();

        if (isGroup) {
            handleGroupMessage(senderNo, root);
        } else {
            handleDirectMessage(senderNo, root);
        }
    }

    /**
     * 그룹 채팅 메시지 처리
     */
    private void handleGroupMessage(int senderNo, JsonNode root) throws Exception {

        GroupMessageDTO msg = objectMapper.treeToValue(root, GroupMessageDTO.class);
        msg.setSenderNo(senderNo);

        // DB 저장 (selectKey로 groupMsgNo 채워짐)
        groupChatService.insertGroupMessage(msg);

        // 방 멤버 목록 조회 (캐시 활용 — TTL 5분)
        List<Integer> memberNos = getGroupMembersWithCache(msg.getGroupRoomNo());

        String jsonMsg = objectMapper.writeValueAsString(msg);
        TextMessage textMsg = new TextMessage(jsonMsg);

        // 접속 중인 방 멤버에게 브로드캐스트 (O(멤버 수) 직접 조회)
        for (int memberNo : memberNos) {
            Set<WebSocketSession> memberSessions = sessionMap.get(memberNo);
            if (memberSessions == null) continue;
            for (WebSocketSession s : memberSessions) {
                if (s.isOpen()) s.sendMessage(textMsg);
            }
        }
    }

    /**
     * 1:1 채팅 메시지 처리 (기존 로직 완전 유지)
     */
    private void handleDirectMessage(int senderNo, JsonNode root) throws Exception {

        MessageDTO msg = objectMapper.treeToValue(root, MessageDTO.class);
        msg.setSenderNo(senderNo);

        int result = chattingService.insertMessage(msg);

        if (result > 0) {
            int targetNo = msg.getTargetNo();

            String jsonMsg = objectMapper.writeValueAsString(msg);
            TextMessage textMsg = new TextMessage(jsonMsg);

            // 발신자·수신자 세션에 직접 전송 (O(1) 조회)
            for (int memberNo : new int[]{senderNo, targetNo}) {
                Set<WebSocketSession> memberSessions = sessionMap.get(memberNo);
                if (memberSessions == null) continue;
                for (WebSocketSession s : memberSessions) {
                    if (s.isOpen()) s.sendMessage(textMsg);
                }
            }

            // 수신자에게 알림 전송
            try {
                String senderNickname = memberService.getNicknameByNo(senderNo);
                String preview = msg.getMessageContent();
                if (preview.length() > 30) {
                    preview = preview.substring(0, 30) + "...";
                }
                notificationService.createNotification(
                    NotificationDTO.builder()
                        .recipientNo(targetNo)
                        .senderNo(senderNo)
                        .notificationType("CHAT_MESSAGE")
                        .targetType("CHAT")
                        .targetNo(senderNo)
                        .title("새 메시지")
                        .content(senderNickname + ": " + preview)
                        .build()
                );
            } catch (Exception e) {
                log.warn("채팅 알림 전송 실패 - senderNo: {}, targetNo: {}", senderNo, targetNo, e);
            }
        }
    }

    /**
     * 그룹 멤버 목록 캐시 조회 (TTL 5분, 만료 시 DB 재조회)
     */
    private List<Integer> getGroupMembersWithCache(int groupRoomNo) {
        CachedMembers cached = groupMemberCache.get(groupRoomNo);
        if (cached != null && !cached.isExpired()) {
            return cached.memberNos();
        }
        List<Integer> memberNos = Collections.unmodifiableList(
                groupChatService.selectGroupMemberNos(groupRoomNo));
        groupMemberCache.put(groupRoomNo,
                new CachedMembers(memberNos, System.currentTimeMillis() + GROUP_MEMBER_CACHE_TTL));
        return memberNos;
    }

    /**
     * 그룹 멤버 변경 시 캐시 무효화 (외부에서 호출)
     */
    public void invalidateGroupMemberCache(int groupRoomNo) {
        groupMemberCache.remove(groupRoomNo);
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
        log.info("WebSocket 연결 종료 - sessionId: {}", session.getId());
    }
}
