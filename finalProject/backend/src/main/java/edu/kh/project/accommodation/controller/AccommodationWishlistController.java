package edu.kh.project.accommodation.controller;

import edu.kh.project.accommodation.service.AccommodationWishlistService;
import edu.kh.project.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/accommodations")
@RequiredArgsConstructor
@Slf4j
public class AccommodationWishlistController {

    private final AccommodationWishlistService wishlistService;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /** 찜 토글 (추가/제거) */
    @PostMapping("/{accommodationNo}/wishlist")
    public ResponseEntity<Map<String, Object>> toggleWishlist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("accommodationNo") int accommodationNo) {

        Map<String, Object> response = new HashMap<>();
        try {
            int memberNo = extractMemberNo(authHeader);
            Map<String, Object> result = wishlistService.toggleWishlist(accommodationNo, memberNo);
            response.put("success", true);
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("찜 토글 실패", e);
            response.put("success", false);
            response.put("message", "처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 찜 여부 확인 */
    @GetMapping("/{accommodationNo}/wishlist/check")
    public ResponseEntity<Map<String, Object>> checkWishlist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("accommodationNo") int accommodationNo) {

        Map<String, Object> response = new HashMap<>();
        try {
            int memberNo = extractMemberNo(authHeader);
            boolean wishlisted = wishlistService.checkWishlist(accommodationNo, memberNo);
            response.put("success", true);
            response.put("data", Map.of("wishlisted", wishlisted));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("찜 확인 실패", e);
            response.put("success", false);
            response.put("data", Map.of("wishlisted", false));
            return ResponseEntity.ok(response);
        }
    }
}
