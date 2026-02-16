package edu.kh.project.spot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.spot.dto.SpotDTO;
import edu.kh.project.spot.service.SpotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 명소 REST API Controller
 */
@RestController
@RequestMapping("/api/spot")
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class SpotController {

    private final SpotService spotService;

    @Value("${spot.image.web-path}")
    private String spotWebPath;

    @Value("${spot.image.folder-path}")
    private String spotFolderPath;

    /**
     * 활성화된 명소 목록 조회 (메인페이지용)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getActiveSpots() {

        Map<String, Object> response = new HashMap<>();

        try {
            List<SpotDTO> spots = spotService.getActiveSpots();

            response.put("success", true);
            response.put("data", spots);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("명소 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "명소 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 전체 명소 목록 조회 (관리자용)
     */
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAllSpots() {

        Map<String, Object> response = new HashMap<>();

        try {
            List<SpotDTO> spots = spotService.getAllSpots();

            response.put("success", true);
            response.put("data", spots);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("명소 전체 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "명소 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 명소 상세 조회
     */
    @GetMapping("/{spotNo}")
    public ResponseEntity<Map<String, Object>> getSpot(
            @PathVariable("spotNo") int spotNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            SpotDTO spot = spotService.getSpotByNo(spotNo);

            if (spot != null) {
                response.put("success", true);
                response.put("data", spot);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "명소 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("명소 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "명소 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 명소 등록 (관리자 전용 - multipart 지원)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSpot(
            @RequestParam("spotTitle") String spotTitle,
            @RequestParam(value = "spotDesc", required = false) String spotDesc,
            @RequestParam(value = "spotLocation", required = false) String spotLocation,
            @RequestParam(value = "spotTag", required = false) String spotTag,
            @RequestParam(value = "spotOrder", required = false, defaultValue = "0") int spotOrder,
            @RequestParam(value = "spotSize", required = false, defaultValue = "small") String spotSize,
            @RequestParam(value = "spotImageUrl", required = false) String spotImageUrl,
            @RequestParam(value = "spotImage", required = false) MultipartFile spotImageFile) {

        Map<String, Object> response = new HashMap<>();

        try {
            SpotDTO spot = SpotDTO.builder()
                    .spotTitle(spotTitle)
                    .spotDesc(spotDesc)
                    .spotLocation(spotLocation)
                    .spotTag(spotTag)
                    .spotOrder(spotOrder)
                    .spotSize(spotSize)
                    .build();

            int result = spotService.createSpotWithImage(spot, spotImageFile, spotImageUrl, spotWebPath, spotFolderPath);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "명소가 등록되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "명소 등록에 실패했습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("명소 등록 실패", e);
            response.put("success", false);
            response.put("message", "명소 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 명소 수정 (관리자 전용 - multipart 지원, POST로 처리)
     */
    @PostMapping("/{spotNo}/update")
    public ResponseEntity<Map<String, Object>> updateSpot(
            @PathVariable("spotNo") int spotNo,
            @RequestParam("spotTitle") String spotTitle,
            @RequestParam(value = "spotDesc", required = false) String spotDesc,
            @RequestParam(value = "spotLocation", required = false) String spotLocation,
            @RequestParam(value = "spotTag", required = false) String spotTag,
            @RequestParam(value = "spotOrder", required = false, defaultValue = "0") int spotOrder,
            @RequestParam(value = "spotSize", required = false, defaultValue = "small") String spotSize,
            @RequestParam(value = "spotImageUrl", required = false) String spotImageUrl,
            @RequestParam(value = "spotImage", required = false) MultipartFile spotImageFile) {

        Map<String, Object> response = new HashMap<>();

        try {
            SpotDTO spot = SpotDTO.builder()
                    .spotNo(spotNo)
                    .spotTitle(spotTitle)
                    .spotDesc(spotDesc)
                    .spotLocation(spotLocation)
                    .spotTag(spotTag)
                    .spotOrder(spotOrder)
                    .spotSize(spotSize)
                    .build();

            int result = spotService.updateSpotWithImage(spot, spotImageFile, spotImageUrl, spotWebPath, spotFolderPath);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "명소가 수정되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "명소 수정에 실패했습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("명소 수정 실패", e);
            response.put("success", false);
            response.put("message", "명소 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 명소 삭제 (관리자 전용)
     */
    @DeleteMapping("/{spotNo}")
    public ResponseEntity<Map<String, Object>> deleteSpot(
            @PathVariable("spotNo") int spotNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int result = spotService.deleteSpot(spotNo);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "명소가 삭제되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "명소 삭제에 실패했습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("명소 삭제 실패", e);
            response.put("success", false);
            response.put("message", "명소 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 명소 상태 변경 (관리자 전용)
     */
    @PutMapping("/{spotNo}/status")
    public ResponseEntity<Map<String, Object>> updateSpotStatus(
            @PathVariable("spotNo") int spotNo,
            @RequestParam("status") String status) {

        Map<String, Object> response = new HashMap<>();

        try {
            int result = spotService.updateSpotStatus(spotNo, status);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "명소 상태가 변경되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "명소 상태 변경에 실패했습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("명소 상태 변경 실패", e);
            response.put("success", false);
            response.put("message", "명소 상태 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
