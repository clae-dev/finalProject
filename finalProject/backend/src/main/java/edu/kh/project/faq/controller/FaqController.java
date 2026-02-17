package edu.kh.project.faq.controller;

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
import edu.kh.project.faq.dto.FaqCategoryDTO;
import edu.kh.project.faq.dto.FaqDTO;
import edu.kh.project.faq.service.FaqService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * FAQ(자주 묻는 질문) API 컨트롤러
 *
 * <p>사용자용 FAQ 조회와 관리자용 FAQ CRUD를 처리하는 REST 컨트롤러.</p>
 *
 * <h3>API 엔드포인트</h3>
 * <ul>
 *   <li>GET    /api/faq/categories      - 카테고리 목록 조회</li>
 *   <li>GET    /api/faq                  - FAQ 전체 조회 (카테고리/검색 필터)</li>
 *   <li>PUT    /api/faq/{faqNo}/view     - 조회수 증가</li>
 *   <li>GET    /api/admin/faq            - 관리자용 FAQ 목록 (페이징)</li>
 *   <li>POST   /api/admin/faq            - FAQ 등록</li>
 *   <li>PUT    /api/admin/faq/{faqNo}    - FAQ 수정</li>
 *   <li>DELETE /api/admin/faq/{faqNo}    - FAQ 삭제</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class FaqController {

    private final FaqService faqService;
    private final JwtUtil jwtUtil;

    /**
     * Authorization 헤더에서 관리자 권한 검증
     */
    private void verifyAdmin(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtUtil.getRole(token);
        if (!"A".equals(role)) {
            throw new SecurityException("관리자 권한이 없습니다.");
        }
    }

    // ── 사용자 API ──

    /**
     * 카테고리 목록 조회
     * GET /api/faq/categories
     */
    @GetMapping("/api/faq/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {

        Map<String, Object> response = new HashMap<>();

        try {
            List<FaqCategoryDTO> list = faqService.getCategoryList();

            response.put("success", true);
            response.put("data", list);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("FAQ 카테고리 조회 실패", e);
            response.put("success", false);
            response.put("message", "카테고리 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * FAQ 전체 조회 (사용자용)
     * GET /api/faq?category=MEMBER&search=키워드
     */
    @GetMapping("/api/faq")
    public ResponseEntity<Map<String, Object>> getFaqList(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<FaqDTO> list = faqService.getFaqList(category, search);

            response.put("success", true);
            response.put("data", list);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("FAQ 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "FAQ 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 조회수 증가
     * PUT /api/faq/{faqNo}/view
     */
    @PutMapping("/api/faq/{faqNo}/view")
    public ResponseEntity<Map<String, Object>> increaseViewCount(
            @PathVariable("faqNo") int faqNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            faqService.increaseViewCount(faqNo);

            response.put("success", true);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("FAQ 조회수 증가 실패", e);
            response.put("success", false);
            response.put("message", "조회수 증가 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ── 관리자 API ──

    /**
     * FAQ 목록 (관리자용)
     * GET /api/admin/faq?page=1&size=10&search=키워드
     */
    @GetMapping("/api/admin/faq")
    public ResponseEntity<Map<String, Object>> getAdminFaqList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            verifyAdmin(authHeader);

            List<FaqDTO> list = faqService.getAdminFaqList(page, size, search);
            int totalCount = faqService.getAdminFaqCount(search);

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
            log.error("관리자 FAQ 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "FAQ 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * FAQ 등록
     * POST /api/admin/faq
     */
    @PostMapping("/api/admin/faq")
    public ResponseEntity<Map<String, Object>> createFaq(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody FaqDTO faq) {

        Map<String, Object> response = new HashMap<>();

        try {
            verifyAdmin(authHeader);

            int result = faqService.createFaq(faq);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "FAQ 등록 완료" : "FAQ 등록 실패");
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
            log.error("FAQ 등록 실패", e);
            response.put("success", false);
            response.put("message", "FAQ 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * FAQ 수정
     * PUT /api/admin/faq/{faqNo}
     */
    @PutMapping("/api/admin/faq/{faqNo}")
    public ResponseEntity<Map<String, Object>> updateFaq(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("faqNo") int faqNo,
            @RequestBody FaqDTO faq) {

        Map<String, Object> response = new HashMap<>();

        try {
            verifyAdmin(authHeader);

            faq.setFaqNo(faqNo);
            int result = faqService.updateFaq(faq);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "FAQ 수정 완료" : "FAQ 수정 실패");
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
            log.error("FAQ 수정 실패", e);
            response.put("success", false);
            response.put("message", "FAQ 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * FAQ 소프트 삭제
     * DELETE /api/admin/faq/{faqNo}
     */
    @DeleteMapping("/api/admin/faq/{faqNo}")
    public ResponseEntity<Map<String, Object>> deleteFaq(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("faqNo") int faqNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            verifyAdmin(authHeader);

            int result = faqService.deleteFaq(faqNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "FAQ 삭제 완료" : "FAQ 삭제 실패");
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
            log.error("FAQ 삭제 실패", e);
            response.put("success", false);
            response.put("message", "FAQ 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
