package edu.kh.project.notification.controller;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /** 알림 목록 조회 (페이징) */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            List<NotificationDTO> list = notificationService.getNotifications(memberNo, page, size);
            int totalCount = notificationService.getNotificationCount(memberNo);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("알림 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "알림 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 읽지 않은 알림 수 */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int count = notificationService.getUnreadCount(memberNo);

            response.put("success", true);
            response.put("count", count);

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("읽지않은 알림 수 조회 실패", e);
            response.put("success", false);
            response.put("message", "알림 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 단건 읽음 처리 */
    @PutMapping("/{notificationNo}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("notificationNo") int notificationNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = notificationService.markAsRead(notificationNo, memberNo);

            response.put("success", result > 0);

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("알림 읽음 처리 실패", e);
            response.put("success", false);
            response.put("message", "알림 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 전체 읽음 처리 */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            notificationService.markAllAsRead(memberNo);

            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("전체 읽음 처리 실패", e);
            response.put("success", false);
            response.put("message", "알림 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 알림 삭제 */
    @DeleteMapping("/{notificationNo}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("notificationNo") int notificationNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = notificationService.deleteNotification(notificationNo, memberNo);

            response.put("success", result > 0);

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("알림 삭제 실패", e);
            response.put("success", false);
            response.put("message", "알림 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
