package edu.kh.project.olletrail.controller;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.olletrail.dto.OlleTrailOverrideDTO;
import edu.kh.project.olletrail.service.OlleTrailService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 올레길 코스 관리 API
 *
 * GET    /api/olle-trails/overrides       — 전체 override 조회 (public)
 * PUT    /api/olle-trails/{id}            — override 저장/수정 (관리자 전용)
 * DELETE /api/olle-trails/{id}            — override 삭제·원본 복원 (관리자 전용)
 */
@RestController
@RequestMapping("/api/olle-trails")
@RequiredArgsConstructor
@Slf4j
public class OlleTrailController {

    private final OlleTrailService olleTrailService;
    private final JwtUtil jwtUtil;

    /** Authorization 헤더에서 관리자 memberNo 추출 + 권한 검증 */
    private int extractAdminMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtUtil.getRole(token);
        if (!"A".equals(role)) {
            throw new SecurityException("관리자 권한이 없습니다.");
        }
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 전체 override 목록 조회 (public — 프론트 올레길 페이지에서 호출)
     */
    @GetMapping("/overrides")
    public ResponseEntity<Map<String, Object>> getAllOverrides() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<OlleTrailOverrideDTO> list = olleTrailService.getAllOverrides();
            response.put("success", true);
            response.put("list", list);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("올레길 override 조회 실패", e);
            response.put("success", false);
            response.put("message", "올레길 정보 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * override 저장·수정 (관리자 전용)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> saveOverride(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("id") int trailId,
            @RequestBody OlleTrailOverrideDTO dto) {

        Map<String, Object> response = new HashMap<>();
        try {
            int adminNo = extractAdminMemberNo(authHeader);
            dto.setTrailId(trailId);
            dto.setUpdatedBy(adminNo);

            int result = olleTrailService.saveOverride(dto);
            response.put("success", result > 0);
            response.put("message", result > 0 ? "저장 완료" : "저장 실패");
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
            log.error("올레길 override 저장 실패: trailId={}", trailId, e);
            response.put("success", false);
            response.put("message", "저장 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * override 삭제 — 원본 복원 (관리자 전용)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteOverride(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("id") int trailId) {

        Map<String, Object> response = new HashMap<>();
        try {
            extractAdminMemberNo(authHeader);
            int result = olleTrailService.deleteOverride(trailId);
            response.put("success", result > 0);
            response.put("message", result > 0 ? "원본으로 복원되었습니다." : "해당 코스의 수정 내역이 없습니다.");
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
            log.error("올레길 override 삭제 실패: trailId={}", trailId, e);
            response.put("success", false);
            response.put("message", "삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
