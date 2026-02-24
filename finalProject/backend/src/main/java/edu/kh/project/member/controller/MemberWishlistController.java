package edu.kh.project.member.controller;

import edu.kh.project.accommodation.mapper.AccommodationWishlistMapper;
import edu.kh.project.companion.mapper.CompanionWishlistMapper;
import edu.kh.project.companion.mapper.ReviewWishlistMapper;
import edu.kh.project.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class MemberWishlistController {

    private final AccommodationWishlistMapper accommodationWishlistMapper;
    private final CompanionWishlistMapper companionWishlistMapper;
    private final ReviewWishlistMapper reviewWishlistMapper;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 내 찜 목록 전체 조회 (숙소 + 동행 + 후기)
     * GET /api/member/wishlists
     */
    @GetMapping("/wishlists")
    public ResponseEntity<Map<String, Object>> getMyWishlists(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();
        try {
            int memberNo = extractMemberNo(authHeader);

            List<Map<String, Object>> accommodations = accommodationWishlistMapper.selectWishlistByMember(memberNo);
            List<Map<String, Object>> companions = companionWishlistMapper.selectWishlistByMember(memberNo);
            List<Map<String, Object>> reviews = reviewWishlistMapper.selectWishlistByMember(memberNo);

            Map<String, Object> data = new HashMap<>();
            data.put("accommodations", accommodations);
            data.put("companions", companions);
            data.put("reviews", reviews);

            response.put("success", true);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("찜 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "찜 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
