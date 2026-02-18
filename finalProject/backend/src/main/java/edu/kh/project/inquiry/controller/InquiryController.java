package edu.kh.project.inquiry.controller;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.inquiry.dto.InquiryDTO;
import edu.kh.project.inquiry.service.InquiryService;
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
@RequiredArgsConstructor
@Slf4j
public class InquiryController {

    private final InquiryService inquiryService;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    private String extractRole(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getRole(token);
    }

    // ======================== 사용자 API ========================

    /** 문의 등록 */
    @PostMapping("/api/inquiry")
    public ResponseEntity<Map<String, Object>> createInquiry(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody InquiryDTO inquiry) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            inquiry.setMemberNo(memberNo);

            int result = inquiryService.createInquiry(inquiry);
            response.put("success", result > 0);
            response.put("message", result > 0 ? "문의가 등록되었습니다." : "문의 등록에 실패했습니다.");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("문의 등록 실패", e);
            response.put("success", false);
            response.put("message", "문의 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 내 문의 목록 */
    @GetMapping("/api/inquiry/my")
    public ResponseEntity<Map<String, Object>> getMyInquiries(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            List<InquiryDTO> list = inquiryService.getMyInquiryList(memberNo, page, size);
            int totalCount = inquiryService.getMyInquiryCount(memberNo);

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
            log.error("내 문의 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "문의 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 문의 상세 (사용자 - 본인 확인) */
    @GetMapping("/api/inquiry/{no}")
    public ResponseEntity<Map<String, Object>> getInquiryDetail(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int inquiryNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            InquiryDTO inquiry = inquiryService.getInquiryDetail(inquiryNo);

            if (inquiry == null) {
                response.put("success", false);
                response.put("message", "문의를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (inquiry.getMemberNo() != memberNo) {
                response.put("success", false);
                response.put("message", "접근 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            response.put("success", true);
            response.put("data", inquiry);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("문의 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "문의 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 문의 삭제 (사용자 - 본인 확인) */
    @DeleteMapping("/api/inquiry/{no}")
    public ResponseEntity<Map<String, Object>> deleteMyInquiry(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int inquiryNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            InquiryDTO inquiry = inquiryService.getInquiryDetail(inquiryNo);

            if (inquiry == null || inquiry.getMemberNo() != memberNo) {
                response.put("success", false);
                response.put("message", "접근 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            int result = inquiryService.deleteInquiry(inquiryNo);
            response.put("success", result > 0);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("문의 삭제 실패", e);
            response.put("success", false);
            response.put("message", "문의 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ======================== 관리자 API ========================

    /** 관리자 문의 목록 */
    @GetMapping("/api/admin/inquiry")
    public ResponseEntity<Map<String, Object>> getAdminInquiries(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        Map<String, Object> response = new HashMap<>();

        try {
            String role = extractRole(authHeader);
            if (!"A".equals(role)) {
                response.put("success", false);
                response.put("message", "관리자 권한이 필요합니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            List<InquiryDTO> list = inquiryService.getAdminInquiryList(page, size, status);
            int totalCount = inquiryService.getAdminInquiryCount(status);

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
            log.error("관리자 문의 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "문의 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 관리자 문의 상세 */
    @GetMapping("/api/admin/inquiry/{no}")
    public ResponseEntity<Map<String, Object>> getAdminInquiryDetail(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int inquiryNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            String role = extractRole(authHeader);
            if (!"A".equals(role)) {
                response.put("success", false);
                response.put("message", "관리자 권한이 필요합니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            InquiryDTO inquiry = inquiryService.getInquiryDetail(inquiryNo);
            if (inquiry == null) {
                response.put("success", false);
                response.put("message", "문의를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("data", inquiry);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("관리자 문의 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "문의 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 관리자 답변 등록 */
    @PutMapping("/api/admin/inquiry/{no}/answer")
    public ResponseEntity<Map<String, Object>> answerInquiry(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int inquiryNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            String role = extractRole(authHeader);
            if (!"A".equals(role)) {
                response.put("success", false);
                response.put("message", "관리자 권한이 필요합니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            String answer = body.get("answer");
            if (answer == null || answer.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "답변 내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            int result = inquiryService.answerInquiry(inquiryNo, answer.trim());
            response.put("success", result > 0);
            response.put("message", result > 0 ? "답변이 등록되었습니다." : "이미 답변된 문의이거나 존재하지 않는 문의입니다.");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("문의 답변 등록 실패", e);
            response.put("success", false);
            response.put("message", "답변 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 관리자 문의 삭제 */
    @DeleteMapping("/api/admin/inquiry/{no}")
    public ResponseEntity<Map<String, Object>> deleteAdminInquiry(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int inquiryNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            String role = extractRole(authHeader);
            if (!"A".equals(role)) {
                response.put("success", false);
                response.put("message", "관리자 권한이 필요합니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            int result = inquiryService.deleteInquiry(inquiryNo);
            response.put("success", result > 0);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("관리자 문의 삭제 실패", e);
            response.put("success", false);
            response.put("message", "문의 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
