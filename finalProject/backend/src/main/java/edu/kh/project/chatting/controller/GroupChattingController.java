package edu.kh.project.chatting.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.chatting.dto.GroupChatRoomDTO;
import edu.kh.project.chatting.dto.GroupMessageDTO;
import edu.kh.project.chatting.service.GroupChatService;
import edu.kh.project.common.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 그룹 채팅 REST API 컨트롤러
 *
 * <h3>API 엔드포인트</h3>
 * <ul>
 *   <li>GET /api/group-chatting/rooms    - 그룹 채팅방 목록 조회</li>
 *   <li>GET /api/group-chatting/messages - 그룹 메시지 목록 조회</li>
 *   <li>PUT /api/group-chatting/read     - 읽음 워터마크 갱신</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/group-chatting")
@RequiredArgsConstructor
@Slf4j
public class GroupChattingController {

    private final GroupChatService groupChatService;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 그룹 채팅방 목록 조회
     * GET /api/group-chatting/rooms
     */
    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getGroupRoomList(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();
        try {
            int memberNo = extractMemberNo(authHeader);
            List<GroupChatRoomDTO> rooms = groupChatService.selectGroupRoomList(memberNo);
            response.put("success", true);
            response.put("data", rooms);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("그룹 채팅방 목록 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("그룹 채팅방 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "채팅방 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 그룹 메시지 목록 조회
     * GET /api/group-chatting/messages?groupRoomNo=X
     */
    @GetMapping("/messages")
    public ResponseEntity<Map<String, Object>> getGroupMessages(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam int groupRoomNo,
            @RequestParam(required = false) Integer beforeMsgNo,
            @RequestParam(defaultValue = "50") int limit) {

        Map<String, Object> response = new HashMap<>();
        try {
            extractMemberNo(authHeader); // JWT 검증만
            List<GroupMessageDTO> messages = groupChatService.selectGroupMessageList(groupRoomNo, beforeMsgNo, limit);
            response.put("success", true);
            response.put("data", messages);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("그룹 메시지 목록 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("그룹 메시지 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "메시지 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 읽음 워터마크 갱신
     * PUT /api/group-chatting/read
     * Body: { groupRoomNo, lastReadMsgNo }
     */
    @PutMapping("/read")
    public ResponseEntity<Map<String, Object>> markGroupRead(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Integer> params) {

        Map<String, Object> response = new HashMap<>();
        try {
            int memberNo = extractMemberNo(authHeader);
            int groupRoomNo  = params.getOrDefault("groupRoomNo", 0);
            int lastReadMsg  = params.getOrDefault("lastReadMsgNo", 0);

            groupChatService.markGroupMessagesRead(groupRoomNo, memberNo, lastReadMsg);
            response.put("success", true);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("그룹 읽음 처리 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("그룹 읽음 처리 실패", e);
            response.put("success", false);
            response.put("message", "읽음 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
