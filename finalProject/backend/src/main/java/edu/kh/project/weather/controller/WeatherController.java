package edu.kh.project.weather.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.weather.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 날씨 API 컨트롤러
 *
 * <p>기상청 기상 예보 API를 백엔드에서 프록시 호출하여
 * 프론트엔드에 제주 날씨 데이터를 제공한다.</p>
 *
 * <h3>API 목록</h3>
 * <ul>
 *   <li><b>GET /api/weather/jeju</b> – 제주도 현재 날씨 조회 (초단기예보)</li>
 *   <li><b>GET /api/weather/forecast</b> – 제주도 3일 단기예보 조회</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class WeatherController {

    private final WeatherService weatherService;

    /**
     * 제주도 날씨 조회
     * @param city "jeju" 또는 "seogwipo" (기본값: jeju)
     */
    @GetMapping("/api/weather/jeju")
    public ResponseEntity<Map<String, Object>> getJejuWeather(
            @RequestParam(defaultValue = "jeju") String city) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> weather = weatherService.getWeather(city);
            response.put("success", true);
            response.put("data", weather);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("날씨 조회 실패 [{}]: {}", city, e.getMessage());
            response.put("success", false);
            response.put("message", "날씨 정보를 불러올 수 없습니다");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 제주도 3일 단기예보 조회
     * @param city "jeju" 또는 "seogwipo" (기본값: jeju)
     */
    @GetMapping("/api/weather/forecast")
    public ResponseEntity<Map<String, Object>> getJejuForecast(
            @RequestParam(defaultValue = "jeju") String city) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<Map<String, Object>> forecast = weatherService.getForecast(city);
            response.put("success", true);
            response.put("data", forecast);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("단기예보 조회 실패 [{}]: {}", city, e.getMessage());
            response.put("success", false);
            response.put("message", "예보 정보를 불러올 수 없습니다");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
