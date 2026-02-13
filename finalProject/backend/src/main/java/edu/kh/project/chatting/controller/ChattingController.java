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

import edu.kh.project.chatting.dto.ChattingRoomDTO;
import edu.kh.project.chatting.dto.MessageDTO;
import edu.kh.project.chatting.service.ChattingService;
import edu.kh.project.common.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 채팅 REST API Controller
 */
@RestController
@RequestMapping("/api/chatting")
@RequiredArgsConstructor
@Slf4j
public class ChattingController {

    private final ChattingService chattingService;
    private final JwtUtil jwtUtil;

    /**
     * Authorization 헤더에서 memberNo 추출
     */
    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 채팅방 목록 조회
     * GET /api/chatting/rooms
     */
    @GetMapping("/rooms")
    public ResponseEntity<Map<String, Object>> getRoomList(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            List<ChattingRoomDTO> roomList = chattingService.selectRoomList(memberNo);

            response.put("success", true);
            response.put("data", roomList);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("채팅방 목록 조회 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("채팅방 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "채팅방 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 대화 상대 검색
     * GET /api/chatting/search?query=닉네임
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchTarget(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String query) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            List<Map<String, Object>> results = chattingService.searchTarget(query, memberNo);

            response.put("success", true);
            response.put("data", results);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("대화 상대 검색 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("대화 상대 검색 실패", e);
            response.put("success", false);
            response.put("message", "검색 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 채팅방 입장/생성
     * GET /api/chatting/enter?targetNo=5
     */
    @GetMapping("/enter")
    public ResponseEntity<Map<String, Object>> enterRoom(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam int targetNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int chattingRoomNo = chattingService.enterChatRoom(memberNo, targetNo);

            response.put("success", true);
            response.put("chattingRoomNo", chattingRoomNo);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("채팅방 입장 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("채팅방 입장 실패", e);
            response.put("success", false);
            response.put("message", "채팅방 입장 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 메시지 목록 조회
     * GET /api/chatting/messages?chattingRoomNo=1
     */
    @GetMapping("/messages")
    public ResponseEntity<Map<String, Object>> getMessages(
            @RequestParam int chattingRoomNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<MessageDTO> messages = chattingService.selectMessageList(chattingRoomNo);

            response.put("success", true);
            response.put("data", messages);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("메시지 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "메시지 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 읽음 처리
     * PUT /api/chatting/read
     */
    @PutMapping("/read")
    public ResponseEntity<Map<String, Object>> updateReadFlag(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Integer> params) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int chattingRoomNo = params.get("chattingRoomNo");

            int result = chattingService.updateReadFlag(chattingRoomNo, memberNo);

            response.put("success", true);
            response.put("updated", result);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("읽음 처리 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("읽음 처리 실패", e);
            response.put("success", false);
            response.put("message", "읽음 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
