package edu.kh.project.admin.controller;

import edu.kh.project.admin.service.AdminService;
import edu.kh.project.common.util.JwtUtil;
import io.jsonwebtoken.JwtException;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class AdminController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    @Value("${accommodation.image.web-path}")
    private String accommodationWebPath;

    @Value("${accommodation.image.folder-path}")
    private String accommodationFolderPath;

    /**
     * Authorization 헤더에서 memberNo 추출 + 관리자 권한 검증
     */
    private int extractAdminMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtUtil.getRole(token);
        if (!"A".equals(role)) {
            throw new SecurityException("관리자 권한이 없습니다.");
        }
        return jwtUtil.getMemberNo(token);
    }

    // 대시보드 통계
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            Map<String, Object> stats = adminService.getDashboardStats();

            response.put("success", true);
            response.put("data", stats);
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
            log.error("대시보드 조회 실패", e);
            response.put("success", false);
            response.put("message", "대시보드 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회원 목록
    @GetMapping("/members")
    public ResponseEntity<Map<String, Object>> getMembers(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String searchType) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<Map<String, Object>> list = adminService.getMemberList(page, size, search, searchType);
            int totalCount = adminService.getMemberCount(search, searchType);

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
            log.error("회원 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "회원 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회원 상태 변경
    @PutMapping("/members/{memberNo}/status")
    public ResponseEntity<Map<String, Object>> updateMemberStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("memberNo") int memberNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            String status = body.get("status");

            int result = adminService.updateMemberStatus(memberNo, status);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "상태 변경 완료" : "상태 변경 실패");
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
            log.error("회원 상태 변경 실패", e);
            response.put("success", false);
            response.put("message", "회원 상태 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 동행 게시글 목록
    @GetMapping("/companions")
    public ResponseEntity<Map<String, Object>> getCompanions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<Map<String, Object>> list = adminService.getCompanionList(page, size, search);
            int totalCount = adminService.getCompanionCount(search);

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
            log.error("동행 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "동행 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 동행 게시글 삭제 (소프트)
    @DeleteMapping("/companions/{companionNo}")
    public ResponseEntity<Map<String, Object>> deleteCompanion(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("companionNo") int companionNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            int result = adminService.deleteCompanion(companionNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패");
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
            log.error("동행 삭제 실패", e);
            response.put("success", false);
            response.put("message", "동행 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 후기 목록
    @GetMapping("/reviews")
    public ResponseEntity<Map<String, Object>> getReviews(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<Map<String, Object>> list = adminService.getReviewList(page, size, search);
            int totalCount = adminService.getReviewCount(search);

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
            log.error("후기 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "후기 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 후기 삭제 (소프트)
    @DeleteMapping("/reviews/{reviewNo}")
    public ResponseEntity<Map<String, Object>> deleteReview(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("reviewNo") int reviewNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            int result = adminService.deleteReview(reviewNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패");
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
            log.error("후기 삭제 실패", e);
            response.put("success", false);
            response.put("message", "후기 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 숙소 목록
    @GetMapping("/accommodations")
    public ResponseEntity<Map<String, Object>> getAccommodations(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<Map<String, Object>> list = adminService.getAccommodationList(page, size, search);
            int totalCount = adminService.getAccommodationCount(search);

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
            log.error("숙소 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "숙소 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 숙소 수동 추가 (multipart)
    @PostMapping("/accommodations")
    public ResponseEntity<Map<String, Object>> createAccommodation(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "accommodationType", required = false) String accommodationType,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "priceMin", required = false) String priceMin,
            @RequestParam(value = "priceMax", required = false) String priceMax,
            @RequestParam(value = "checkInTime", required = false) String checkInTime,
            @RequestParam(value = "checkOutTime", required = false) String checkOutTime,
            @RequestParam(value = "facilities", required = false) String facilities,
            @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl,
            @RequestParam(value = "latitude", required = false) String latitude,
            @RequestParam(value = "longitude", required = false) String longitude,
            @RequestParam(value = "recommendationReason", required = false) String recommendationReason,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            Map<String, Object> params = new HashMap<>();
            params.put("name", name);
            params.put("address", address);
            params.put("phone", phone);
            params.put("accommodationType", accommodationType);
            params.put("region", region);
            params.put("priceMin", (priceMin != null && !priceMin.isEmpty()) ? priceMin : null);
            params.put("priceMax", (priceMax != null && !priceMax.isEmpty()) ? priceMax : null);
            params.put("checkInTime", checkInTime);
            params.put("checkOutTime", checkOutTime);
            params.put("facilities", facilities);
            params.put("thumbnailUrl", thumbnailUrl);
            params.put("latitude", (latitude != null && !latitude.isEmpty()) ? latitude : null);
            params.put("longitude", (longitude != null && !longitude.isEmpty()) ? longitude : null);
            params.put("recommendationReason", recommendationReason);

            int result = adminService.insertAccommodationWithImages(
                    params, thumbnail, images, accommodationWebPath, accommodationFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "숙소 추가 완료" : "숙소 추가 실패");
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
            log.error("숙소 추가 실패", e);
            response.put("success", false);
            response.put("message", "숙소 추가 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 숙소 정보 수정 (multipart — POST로 처리)
    @PostMapping("/accommodations/{no}/update")
    public ResponseEntity<Map<String, Object>> updateAccommodation(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int accommodationNo,
            @RequestParam("name") String name,
            @RequestParam("address") String address,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "accommodationType", required = false) String accommodationType,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "priceMin", required = false) String priceMin,
            @RequestParam(value = "priceMax", required = false) String priceMax,
            @RequestParam(value = "checkInTime", required = false) String checkInTime,
            @RequestParam(value = "checkOutTime", required = false) String checkOutTime,
            @RequestParam(value = "facilities", required = false) String facilities,
            @RequestParam(value = "thumbnailUrl", required = false) String thumbnailUrl,
            @RequestParam(value = "latitude", required = false) String latitude,
            @RequestParam(value = "longitude", required = false) String longitude,
            @RequestParam(value = "recommendationReason", required = false) String recommendationReason,
            @RequestParam(value = "keepExistingImages", required = false, defaultValue = "true") boolean keepExistingImages,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            Map<String, Object> params = new HashMap<>();
            params.put("accommodationNo", accommodationNo);
            params.put("name", name);
            params.put("address", address);
            params.put("phone", phone);
            params.put("accommodationType", accommodationType);
            params.put("region", region);
            params.put("priceMin", (priceMin != null && !priceMin.isEmpty()) ? priceMin : null);
            params.put("priceMax", (priceMax != null && !priceMax.isEmpty()) ? priceMax : null);
            params.put("checkInTime", checkInTime);
            params.put("checkOutTime", checkOutTime);
            params.put("facilities", facilities);
            params.put("thumbnailUrl", thumbnailUrl);
            params.put("latitude", (latitude != null && !latitude.isEmpty()) ? latitude : null);
            params.put("longitude", (longitude != null && !longitude.isEmpty()) ? longitude : null);
            params.put("recommendationReason", recommendationReason);

            int result = adminService.updateAccommodationWithImages(
                    params, thumbnail, images, keepExistingImages, accommodationWebPath, accommodationFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "숙소 수정 완료" : "숙소 수정 실패");
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
            log.error("숙소 수정 실패", e);
            response.put("success", false);
            response.put("message", "숙소 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 숙소 삭제 (소프트)
    @DeleteMapping("/accommodations/{no}")
    public ResponseEntity<Map<String, Object>> deleteAccommodation(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int accommodationNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            int result = adminService.deleteAccommodation(accommodationNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패");
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
            log.error("숙소 삭제 실패", e);
            response.put("success", false);
            response.put("message", "숙소 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 숙소 상태 변경
    @PutMapping("/accommodations/{no}/status")
    public ResponseEntity<Map<String, Object>> updateAccommodationStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("no") int accommodationNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            String status = body.get("status");

            int result = adminService.updateAccommodationStatus(accommodationNo, status);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "상태 변경 완료" : "상태 변경 실패");
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
            log.error("숙소 상태 변경 실패", e);
            response.put("success", false);
            response.put("message", "숙소 상태 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 신고 목록 (페이징 + 필터)
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String targetType) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            List<Map<String, Object>> list = adminService.getReportList(page, size, status, targetType);
            int totalCount = adminService.getReportCount(status, targetType);

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
            log.error("신고 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "신고 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 신고 상세
    @GetMapping("/reports/{reportNo}")
    public ResponseEntity<Map<String, Object>> getReportDetail(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("reportNo") int reportNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            Map<String, Object> detail = adminService.getReportDetail(reportNo);

            if (detail == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 신고입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("data", detail);
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
            log.error("신고 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "신고 상세 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 신고 상태 변경
    @PutMapping("/reports/{reportNo}/status")
    public ResponseEntity<Map<String, Object>> updateReportStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("reportNo") int reportNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);
            String status = body.get("status");
            String result = body.get("result");

            int res = adminService.updateReportStatus(reportNo, status, result);

            response.put("success", res > 0);
            response.put("message", res > 0 ? "상태 변경 완료" : "상태 변경 실패");
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
            log.error("신고 상태 변경 실패", e);
            response.put("success", false);
            response.put("message", "신고 상태 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 대기중 신고 건수
    @GetMapping("/reports/count")
    public ResponseEntity<Map<String, Object>> getPendingReportCount(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            extractAdminMemberNo(authHeader);

            int count = adminService.getPendingReportCount();

            response.put("success", true);
            response.put("count", count);
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
            log.error("대기중 신고 건수 조회 실패", e);
            response.put("success", false);
            response.put("message", "신고 건수 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
