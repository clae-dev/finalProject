package edu.kh.project.event.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.event.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 공공 행사 API 프록시 컨트롤러
 * - 프론트엔드에서 TourAPI를 직접 호출하지 않고 백엔드를 경유
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    /**
     * 제주 축제/행사 목록 조회
     * @param page 페이지 번호 (기본값 1)
     * @param size 페이지 당 항목 수 (기본값 9)
     * @param startDate 행사 시작일 YYYYMMDD (기본값: 오늘)
     */
    @GetMapping("/api/events")
    public ResponseEntity<Map<String, Object>> getEvents(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) String startDate) {

        Map<String, Object> result = eventService.searchFestivals(page, size, startDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("list", result.get("list"));
        response.put("totalCount", result.get("totalCount"));

        if (Boolean.TRUE.equals(result.get("needApiKey"))) {
            response.put("needApiKey", true);
        }

        return ResponseEntity.ok(response);
    }
}
