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
 * 공공 행사/액티비티 API 프록시 컨트롤러
 *
 * <p>프론트엔드에서 한국관광공사 TourAPI를 직접 호출하지 않고
 * 백엔드를 경유하여 CORS 문제를 우회한다.</p>
 *
 * <h3>API 목록</h3>
 * <ul>
 *   <li><b>GET /api/events</b> – 제주 축제/행사 목록 조회</li>
 *   <li><b>GET /api/leisure</b> – 제주 레포츠/액티비티 목록 조회</li>
 * </ul>
 *
 * @author HONDI
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

    /**
     * 제주 레포츠/액티비티 목록 조회
     *
     * @param page 페이지 번호 (기본값 1)
     * @param size 페이지 당 항목 수 (기본값 9)
     * @return 레포츠 목록 및 총 건수
     */
    @GetMapping("/api/leisure")
    public ResponseEntity<Map<String, Object>> getLeisure(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size) {

        Map<String, Object> result = eventService.searchLeisure(page, size);

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
