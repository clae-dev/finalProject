package edu.kh.project.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.notice.dto.NoticeDTO;
import edu.kh.project.notice.service.NoticeService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 공지사항 API 컨트롤러
 *
 * <p>사용자용 공지사항 조회와 관리자용 공지사항 CRUD를 처리하는 REST 컨트롤러.</p>
 *
 * <h3>API 엔드포인트</h3>
 * <ul>
 *   <li>GET    /api/notices                  - 사용자용 공지 목록 (페이징)</li>
 *   <li>GET    /api/notices/{boardNo}        - 공지 상세 + 조회수 증가</li>
 *   <li>GET    /api/admin/notices            - 관리자용 공지 목록</li>
 *   <li>POST   /api/admin/notices            - 공지 작성</li>
 *   <li>PUT    /api/admin/notices/{boardNo}  - 공지 수정</li>
 *   <li>DELETE /api/admin/notices/{boardNo}  - 공지 삭제</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class NoticeController {

    private final NoticeService noticeService;
    private final JwtUtil jwtUtil;

    /**
     * Authorization 헤더에서 관리자 권한 검증 + memberNo 반환
     */
    private int extractAdminMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtUtil.getRole(token);
        if (!"A".equals(role)) {
            throw new SecurityException("관리자 권한이 없습니다.");
        }
        return jwtUtil.getMemberNo(token);
    }

    // ── 사용자 API ──

    /**
     * 공지 목록 (사용자용)
     * GET /api/notices?page=1&size=10&search=키워드
     */
    @GetMapping("/api/notices")
    public ResponseEntity<Map<String, Object>> getNoticeList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<NoticeDTO> list = noticeService.getNoticeList(page, size, search);
            int totalCount = noticeService.getNoticeCount(search);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("공지 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "공지사항 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 공지 상세 조회 + 조회수 증가
     * GET /api/notices/{boardNo}
     */
    @GetMapping("/api/notices/{boardNo}")
    public ResponseEntity<Map<String, Object>> getNoticeDetail(
            @PathVariable("boardNo") int boardNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            NoticeDTO notice = noticeService.getNoticeDetail(boardNo);

            if (notice == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 공지사항입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("data", notice);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("공지 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "공지사항 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ── 관리자 API ──

    /**
     * 관리자용 공지 목록
     * GET /api/admin/notices?page=1&size=10&search=키워드
     */
    @GetMapping("/api/admin/notices")
    public ResponseEntity<Map<String, Object>> getAdminNoticeList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<NoticeDTO> list = noticeService.getAdminNoticeList(page, size, search);
            int totalCount = noticeService.getAdminNoticeCount(search);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);
            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "관리자 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("관리자 공지 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "공지 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 공지 작성
     * POST /api/admin/notices
     */
    @PostMapping("/api/admin/notices")
    public ResponseEntity<Map<String, Object>> createNotice(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody NoticeDTO notice) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractAdminMemberNo(authHeader);
            notice.setMemberNo(memberNo);

            int result = noticeService.createNotice(notice);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "공지 작성 완료" : "공지 작성 실패");
            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "관리자 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("공지 작성 실패", e);
            response.put("success", false);
            response.put("message", "공지 작성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 공지 수정
     * PUT /api/admin/notices/{boardNo}
     */
    @PutMapping("/api/admin/notices/{boardNo}")
    public ResponseEntity<Map<String, Object>> updateNotice(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo,
            @RequestBody NoticeDTO notice) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            notice.setBoardNo(boardNo);
            int result = noticeService.updateNotice(notice);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "공지 수정 완료" : "공지 수정 실패");
            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "관리자 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("공지 수정 실패", e);
            response.put("success", false);
            response.put("message", "공지 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 공지 소프트 삭제
     * DELETE /api/admin/notices/{boardNo}
     */
    @DeleteMapping("/api/admin/notices/{boardNo}")
    public ResponseEntity<Map<String, Object>> deleteNotice(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            int result = noticeService.deleteNotice(boardNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "공지 삭제 완료" : "공지 삭제 실패");
            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "관리자 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("공지 삭제 실패", e);
            response.put("success", false);
            response.put("message", "공지 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
