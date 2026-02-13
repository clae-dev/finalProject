package edu.kh.project.companion.controller;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.companion.dto.CompanionReviewDTO;
import edu.kh.project.companion.service.CompanionReviewService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Slf4j
public class CompanionReviewController {

    private final CompanionReviewService reviewService;
    private final JwtUtil jwtUtil;

    @Value("${review.image.web-path}")
    private String reviewWebPath;

    @Value("${review.image.folder-path}")
    private String reviewFolderPath;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    // 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReviewList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<CompanionReviewDTO> list = reviewService.getReviewList(page, size);
            int totalCount = reviewService.getReviewCount();

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("후기 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "후기 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 상세 조회
    @GetMapping("/{reviewNo}")
    public ResponseEntity<Map<String, Object>> getReviewDetail(
            @PathVariable("reviewNo") int reviewNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            CompanionReviewDTO detail = reviewService.getReviewDetail(reviewNo);

            if (detail == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 후기입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("data", detail);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("후기 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "후기 상세 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 작성 (multipart/form-data)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createReview(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "companionNo", defaultValue = "0") int companionNo,
            @RequestParam(value = "rating", defaultValue = "5") int rating,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "contentImages", required = false) List<MultipartFile> contentImages) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            CompanionReviewDTO review = new CompanionReviewDTO();
            review.setTitle(title);
            review.setContent(content);
            review.setCompanionNo(companionNo == 0 ? null : companionNo);
            review.setRating(rating);
            review.setMemberNo(memberNo);

            int result = reviewService.createReview(
                    review, thumbnail, contentImages,
                    reviewWebPath, reviewFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "작성 완료" : "작성 실패");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("후기 작성 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("후기 작성 실패", e);
            response.put("success", false);
            response.put("message", "후기 작성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 삭제 (작성자만)
    @DeleteMapping("/{reviewNo}")
    public ResponseEntity<Map<String, Object>> deleteReview(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("reviewNo") int reviewNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = reviewService.deleteReview(reviewNo, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패 (권한 없음)");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("후기 삭제 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("후기 삭제 실패", e);
            response.put("success", false);
            response.put("message", "후기 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 메인페이지용 최신 후기
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentReviews(
            @RequestParam(defaultValue = "9") int limit) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<CompanionReviewDTO> list = reviewService.getRecentReviews(limit);

            response.put("success", true);
            response.put("list", list);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("최신 후기 조회 실패", e);
            response.put("success", false);
            response.put("message", "최신 후기 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
