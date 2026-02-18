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

/**
 * 동행 후기 API 컨트롤러
 *
 * <p>동행 후기(여행 후기)의 CRUD를 처리하는 REST 컨트롤러.
 * 별점(1~5), 이미지 업로드, 동행 게시글 연결(선택) 기능을 지원한다.</p>
 *
 * <h3>API 엔드포인트</h3>
 * <ul>
 *   <li>GET    /api/reviews            - 후기 목록 조회 (페이징)</li>
 *   <li>GET    /api/reviews/{reviewNo} - 후기 상세 조회</li>
 *   <li>POST   /api/reviews            - 후기 작성 (이미지 업로드)</li>
 *   <li>DELETE /api/reviews/{reviewNo} - 후기 삭제 (작성자만)</li>
 *   <li>GET    /api/reviews/recent     - 메인페이지용 최신 후기</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Slf4j
public class CompanionReviewController {

    /** 후기 비즈니스 로직 서비스 */
    private final CompanionReviewService reviewService;

    /** JWT 토큰 유틸리티 */
    private final JwtUtil jwtUtil;

    /** 후기 이미지 웹 접근 경로 */
    @Value("${review.image.web-path}")
    private String reviewWebPath;

    /** 후기 이미지 서버 물리 경로 */
    @Value("${review.image.folder-path}")
    private String reviewFolderPath;

    /**
     * Authorization 헤더에서 회원 번호를 추출한다.
     *
     * @param authHeader "Bearer {token}" 형태의 인증 헤더
     * @return 토큰에 포함된 회원 번호
     * @throws JwtException 토큰이 유효하지 않을 경우
     */
    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 후기 목록을 페이징 조회한다.
     *
     * @param page 현재 페이지 번호 (기본값: 1)
     * @param size 페이지당 후기 수 (기본값: 9)
     * @return 후기 목록, 총 건수, 페이징 정보
     */
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

    /**
     * 후기 상세 정보를 조회한다.
     *
     * @param reviewNo 후기 번호
     * @return 후기 상세 데이터 (없으면 404)
     */
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

    /**
     * 메인페이지용 최신 후기 목록을 조회한다.
     *
     * @param limit 조회할 최대 건수 (기본값: 9)
     * @return 최신 후기 목록
     */
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

    /**
     * 동행 후기를 작성한다 (multipart/form-data).
     *
     * <p>동행 게시글 번호(companionNo)가 0이면 null로 처리하여
     * 동행 연결 없이 독립 후기로 작성된다.</p>
     *
     * @param authHeader    Authorization 헤더 (Bearer 토큰)
     * @param title         후기 제목
     * @param content       후기 내용
     * @param companionNo   연결할 동행 게시글 번호 (0이면 미연결)
     * @param rating        별점 (1~5, 기본값: 5)
     * @param thumbnail     썸네일 이미지 (선택)
     * @param contentImages 본문 이미지 목록 (선택)
     * @return 작성 성공 여부
     */
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

    /**
     * 동행 후기를 삭제한다 (작성자만 가능).
     *
     * @param authHeader Authorization 헤더 (Bearer 토큰)
     * @param reviewNo   삭제할 후기 번호
     * @return 삭제 성공 여부
     */
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
}
