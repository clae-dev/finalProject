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

/**
 * 동행 모집 API 컨트롤러
 *
 * <p>제주 여행 동행 모집 게시글의 CRUD 및 참여 관리를 처리하는 REST 컨트롤러.</p>
 *
 * <h3>API 엔드포인트</h3>
 * <ul>
 *   <li>GET    /api/companions          - 동행 목록 조회 (페이징 + 태그 필터)</li>
 *   <li>GET    /api/companions/{no}     - 동행 상세 조회 (참여자 목록 포함)</li>
 *   <li>POST   /api/companions          - 동행 게시글 작성 (이미지 업로드)</li>
 *   <li>DELETE /api/companions/{no}     - 동행 게시글 삭제 (작성자만)</li>
 *   <li>POST   /api/companions/{no}/join - 동행 참여 신청</li>
 *   <li>DELETE /api/companions/{no}/join - 동행 참여 취소</li>
 *   <li>PUT    /api/companions/join/{joinNo} - 참여 승인/거절 (작성자만)</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequestMapping("/api/companions")
@RequiredArgsConstructor
@Slf4j
public class CompanionController {

    /** 동행 비즈니스 로직 서비스 */
    private final CompanionService companionService;

    /** JWT 토큰 유틸리티 */
    private final JwtUtil jwtUtil;

    /** 동행 이미지 웹 접근 경로 */
    @Value("${companion.image.web-path}")
    private String companionWebPath;

    /** 동행 이미지 서버 물리 경로 */
    @Value("${companion.image.folder-path}")
    private String companionFolderPath;

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

    // ==================== 게시글 CRUD ====================

    /**
     * 동행 모집 목록을 페이징 조회한다.
     *
     * @param page 현재 페이지 번호 (기본값: 1)
     * @param size 페이지당 게시글 수 (기본값: 9)
     * @param tag  필터링할 태그 (선택)
     * @return 동행 목록, 총 건수, 페이징 정보
     */
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

    /**
     * 동행 상세 정보를 조회한다 (참여자 목록 포함).
     *
     * @param companionNo 동행 게시글 번호
     * @return 동행 상세 정보 및 참여 신청 목록
     */
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

    /**
     * 동행 모집 게시글을 작성한다 (multipart/form-data).
     *
     * <p>썸네일 이미지와 본문 이미지를 함께 업로드할 수 있다.</p>
     *
     * @param authHeader    Authorization 헤더 (Bearer 토큰)
     * @param title         게시글 제목
     * @param content       게시글 내용
     * @param travelDate    여행 날짜 (선택)
     * @param maxMembers    최대 모집 인원 (기본값: 4)
     * @param tags          태그 문자열 (선택)
     * @param thumbnail     썸네일 이미지 파일 (선택)
     * @param contentImages 본문 이미지 파일 목록 (선택)
     * @return 작성 성공 여부
     */
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

    /**
     * 동행 게시글을 삭제한다 (작성자만 가능).
     *
     * @param authHeader  Authorization 헤더 (Bearer 토큰)
     * @param companionNo 삭제할 동행 게시글 번호
     * @return 삭제 성공 여부
     */
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

    // ==================== 참여 관리 ====================

    /**
     * 동행에 참여를 신청한다.
     *
     * <p>이미 신청한 동행인 경우 result=-1을 반환한다.</p>
     *
     * @param authHeader  Authorization 헤더 (Bearer 토큰)
     * @param companionNo 참여할 동행 게시글 번호
     * @return 참여 신청 결과 (중복 신청 시 실패 메시지)
     */
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

    /**
     * 동행 참여 신청을 취소한다.
     *
     * @param authHeader  Authorization 헤더 (Bearer 토큰)
     * @param companionNo 취소할 동행 게시글 번호
     * @return 참여 취소 결과
     */
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

    /**
     * 참여 신청의 상태를 변경한다 (승인/거절, 작성자만 가능).
     *
     * @param authHeader Authorization 헤더 (Bearer 토큰)
     * @param joinNo     참가 신청 번호
     * @param body       상태 값을 담은 Map (status: "A"=수락, "C"=거절)
     * @return 상태 변경 결과
     */
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
