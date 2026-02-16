package edu.kh.project.report.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.report.dto.ReportDTO;
import edu.kh.project.report.service.ReportService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;

    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /**
     * 신고 접수
     * POST /api/reports
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitReport(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            String targetType = (String) body.get("targetType");
            String reportType = (String) body.get("reportType");
            String detailReason = (String) body.get("detailReason");

            if (targetType == null || body.get("targetNo") == null || reportType == null) {
                response.put("success", false);
                response.put("message", "필수 항목을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            int targetNo = ((Number) body.get("targetNo")).intValue();

            // 중복 신고 체크
            if (reportService.checkReport(targetType, targetNo, memberNo)) {
                response.put("success", false);
                response.put("message", "이미 신고한 게시글입니다.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            ReportDTO report = ReportDTO.builder()
                    .targetType(targetType)
                    .targetNo(targetNo)
                    .memberNo(memberNo)
                    .reportType(reportType)
                    .detailReason(detailReason)
                    .build();

            int result = reportService.submitReport(report);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "신고가 접수되었습니다." : "신고 접수에 실패했습니다.");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("신고 접수 실패", e);
            response.put("success", false);
            response.put("message", "신고 접수 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 내가 이미 신고했는지 확인
     * GET /api/reports/check?targetType=FREEBOARD&targetNo=1
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkReport(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String targetType,
            @RequestParam int targetNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            boolean reported = reportService.checkReport(targetType, targetNo, memberNo);

            response.put("success", true);
            response.put("reported", reported);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("신고 확인 실패", e);
            response.put("success", false);
            response.put("message", "신고 확인 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
