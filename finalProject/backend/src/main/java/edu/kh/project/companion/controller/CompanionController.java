package edu.kh.project.companion.controller;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import edu.kh.project.companion.service.CompanionService;
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
@RequestMapping("/api/companions")
@RequiredArgsConstructor
@Slf4j
public class CompanionController {

    private final CompanionService companionService;
    private final JwtUtil jwtUtil;

    @Value("${companion.image.web-path}")
    private String companionWebPath;

    @Value("${companion.image.folder-path}")
    private String companionFolderPath;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    // 목록 조회 (페이징 + 태그 필터)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCompanionList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) String tag) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<CompanionDTO> list = companionService.getCompanionList(page, size, tag);
            int totalCount = companionService.getCompanionCount(tag);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("동행 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "동행 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 상세 조회 (참여자 목록 포함)
    @GetMapping("/{no}")
    public ResponseEntity<Map<String, Object>> getCompanionDetail(
            @PathVariable("no") int companionNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            CompanionDTO detail = companionService.getCompanionDetail(companionNo);

            if (detail == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            List<CompanionJoinDTO> joinList = companionService.getJoinList(companionNo);

            response.put("success", true);
            response.put("data", detail);
            response.put("joinList", joinList);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("동행 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "동행 상세 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 작성 (multipart/form-data)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCompanion(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "travelDate", required = false) String travelDate,
            @RequestParam(value = "maxMembers", defaultValue = "4") int maxMembers,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "contentImages", required = false) List<MultipartFile> contentImages) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            CompanionDTO companion = new CompanionDTO();
            companion.setTitle(title);
            companion.setContent(content);
            companion.setTravelDate(travelDate);
            companion.setMaxMembers(maxMembers);
            companion.setTags(tags);
            companion.setMemberNo(memberNo);

            int result = companionService.createCompanion(
                    companion, thumbnail, contentImages,
                    companionWebPath, companionFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "작성 완료" : "작성 실패");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("동행 작성 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("동행 작성 실패", e);
            response.put("success", false);
            response.put("message", "동행 작성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 삭제 (작성자만)
    @DeleteMapping("/{no}")
    public ResponseEntity<Map<String, Object>> deleteCompanion(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int companionNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = companionService.deleteCompanion(companionNo, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패 (권한 없음)");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("동행 삭제 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("동행 삭제 실패", e);
            response.put("success", false);
            response.put("message", "동행 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 참여 신청
    @PostMapping("/{no}/join")
    public ResponseEntity<Map<String, Object>> joinCompanion(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int companionNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = companionService.joinCompanion(companionNo, memberNo);

            if (result == -1) {
                response.put("success", false);
                response.put("message", "이미 신청한 동행입니다.");
                return ResponseEntity.ok(response);
            }

            response.put("success", result > 0);
            response.put("message", result > 0 ? "참여 신청 완료" : "참여 신청 실패");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("참여 신청 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("참여 신청 실패", e);
            response.put("success", false);
            response.put("message", "참여 신청 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 참여 취소
    @DeleteMapping("/{no}/join")
    public ResponseEntity<Map<String, Object>> cancelJoin(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int companionNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = companionService.cancelJoin(companionNo, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "참여 취소 완료" : "참여 취소 실패");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("참여 취소 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("참여 취소 실패", e);
            response.put("success", false);
            response.put("message", "참여 취소 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 승인/거절 (작성자만)
    @PutMapping("/join/{joinNo}")
    public ResponseEntity<Map<String, Object>> updateJoinStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("joinNo") int joinNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            String status = body.get("status");

            int result = companionService.updateJoinStatus(joinNo, status, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "처리 완료" : "처리 실패 (권한 없음)");

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            log.warn("참여 상태 변경 - JWT 인증 실패: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("참여 상태 변경 실패", e);
            response.put("success", false);
            response.put("message", "참여 상태 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
