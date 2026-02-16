package edu.kh.project.accommodation.controller;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import edu.kh.project.accommodation.service.AccommodationReviewService;
import edu.kh.project.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accommodations/{accommodationNo}/reviews")
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class AccommodationReviewController {

    private final AccommodationReviewService reviewService;
    private final JwtUtil jwtUtil;

    @Value("${review.image.web-path}")
    private String reviewWebPath;

    @Value("${review.image.folder-path}")
    private String reviewFolderPath;

    // 후기 목록 (공개)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReviews(
            @PathVariable("accommodationNo") int accommodationNo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> data = reviewService.getReviewList(accommodationNo, page, size);

            response.put("success", true);
            response.putAll(data);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("후기 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "후기 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 평균 별점 + 총 개수
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReviewSummary(
            @PathVariable("accommodationNo") int accommodationNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> summary = reviewService.getReviewSummary(accommodationNo);

            response.put("success", true);
            response.put("data", summary);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("후기 요약 조회 실패", e);
            response.put("success", false);
            response.put("message", "후기 요약 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 후기 작성 (인증뱃지 필수)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createReview(
            @PathVariable("accommodationNo") int accommodationNo,
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("rating") double rating,
            @RequestParam("content") String content,
            @RequestParam(value = "checkInDate", required = false) String checkInDate,
            @RequestParam(value = "checkOutDate", required = false) String checkOutDate,
            @RequestParam(value = "recommendedFor", required = false) String recommendedFor,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);

            AccommodationReviewDTO dto = AccommodationReviewDTO.builder()
                    .accommodationNo(accommodationNo)
                    .memberNo(memberNo)
                    .rating(rating)
                    .content(content)
                    .checkInDate(checkInDate)
                    .checkOutDate(checkOutDate)
                    .recommendedFor(recommendedFor)
                    .build();

            int result = reviewService.createReview(dto, images, reviewWebPath, reviewFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "후기가 등록되었습니다." : "후기 등록에 실패했습니다.");
            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "인증된 리뷰어만 후기를 작성할 수 있습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (Exception e) {
            log.error("후기 등록 실패", e);
            response.put("success", false);
            response.put("message", "후기 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 후기 삭제 (본인)
    @DeleteMapping("/{reviewNo}")
    public ResponseEntity<Map<String, Object>> deleteReview(
            @PathVariable("accommodationNo") int accommodationNo,
            @PathVariable("reviewNo") int reviewNo,
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);

            int result = reviewService.deleteReview(reviewNo, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "후기가 삭제되었습니다." : "후기 삭제에 실패했습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("후기 삭제 실패", e);
            response.put("success", false);
            response.put("message", "후기 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
