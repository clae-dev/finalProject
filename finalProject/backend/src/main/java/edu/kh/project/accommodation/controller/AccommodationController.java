package edu.kh.project.accommodation.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.accommodation.dto.AccommodationDTO;
import edu.kh.project.accommodation.service.AccommodationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 숙소 정보 REST API Controller
 */
@RestController
@RequestMapping("/api/accommodations")
@RequiredArgsConstructor
@Slf4j
public class AccommodationController {
    
    private final AccommodationService accommodationService;
    
    /**
     * 관리자용: API 데이터 동기화
     * POST /api/accommodations/sync
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncAccommodations() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int syncCount = accommodationService.syncAccommodationsFromApi();
            
            response.put("success", true);
            response.put("syncCount", syncCount);
            response.put("message", syncCount + "건의 숙소 정보가 동기화되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("숙소 동기화 실패", e);
            response.put("success", false);
            response.put("message", "숙소 동기화 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 숙소 목록 조회
     * GET /api/accommodations?page=1&size=20&region=제주시
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAccommodationList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String region) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<AccommodationDTO> list = accommodationService.getAccommodationList(page, size, region);
            int totalCount = accommodationService.getTotalCount(region);
            
            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("숙소 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "숙소 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 숙소 상세 조회
     * GET /api/accommodations/{accommodationNo}
     */
    @GetMapping("/{accommodationNo}")
    public ResponseEntity<Map<String, Object>> getAccommodationDetail(
            @PathVariable long accommodationNo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            AccommodationDTO accommodation = accommodationService.getAccommodationDetail(accommodationNo);
            
            if (accommodation != null) {
                response.put("success", true);
                response.put("data", accommodation);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "숙소를 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("숙소 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "숙소 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}