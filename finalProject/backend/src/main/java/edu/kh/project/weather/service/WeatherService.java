package edu.kh.project.weather.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 기상청 초단기예보 API 호출 서비스
 * - 공공데이터포털: VilageFcstInfoService_2.0 / getUltraSrtFcst
 * - 제주시 격자좌표: nx=53, ny=38
 * - 서귀포시 격자좌표: nx=52, ny=33
 */
@Service
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class WeatherService {

    private final RestTemplate restTemplate;

    @Value("${weather.api.serviceKey}")
    private String serviceKey;

    private static final String API_URL =
            "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";

    // 도시별 격자좌표
    private static final Map<String, int[]> CITY_GRID = Map.of(
            "jeju",     new int[]{53, 38},
            "seogwipo", new int[]{52, 33}
    );

    /**
     * 제주도 날씨 조회 (초단기예보)
     * @param city "jeju" 또는 "seogwipo"
     */
    public Map<String, Object> getWeather(String city) {

        int[] grid = CITY_GRID.getOrDefault(city, CITY_GRID.get("jeju"));

        // base_time 계산: 매시 30분 발표, 45분 이후 제공
        LocalDateTime now = LocalDateTime.now();
        if (now.getMinute() < 45) {
            now = now.minusHours(1);
        }
        String baseDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseTime = now.format(DateTimeFormatter.ofPattern("HH")) + "30";

        log.info("===== 기상청 초단기예보 API 호출 [{}] =====", city);
        log.info("baseDate: {}, baseTime: {}, nx: {}, ny: {}", baseDate, baseTime, grid[0], grid[1]);

        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 60)
                .queryParam("pageNo", 1)
                .queryParam("dataType", "JSON")
                .queryParam("base_date", baseDate)
                .queryParam("base_time", baseTime)
                .queryParam("nx", grid[0])
                .queryParam("ny", grid[1])
                .build(false)
                .toUriString();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) body.get("items");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemList = (List<Map<String, Object>>) items.get("item");

            // 가장 가까운 예보 시간의 데이터만 추출
            String firstFcstTime = (String) itemList.get(0).get("fcstTime");
            String firstFcstDate = (String) itemList.get(0).get("fcstDate");

            Map<String, String> weatherMap = new HashMap<>();
            for (Map<String, Object> item : itemList) {
                if (firstFcstDate.equals(item.get("fcstDate"))
                        && firstFcstTime.equals(item.get("fcstTime"))) {
                    weatherMap.put(
                            (String) item.get("category"),
                            String.valueOf(item.get("fcstValue"))
                    );
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("temp", parseDouble(weatherMap.get("T1H")));
            result.put("sky", parseInt(weatherMap.get("SKY")));
            result.put("ptyCode", parseInt(weatherMap.get("PTY")));
            result.put("humidity", parseInt(weatherMap.get("REH")));
            result.put("windSpeed", parseDouble(weatherMap.get("WSD")));
            result.put("windDir", parseInt(weatherMap.get("VEC")));
            result.put("rain", parseDouble(weatherMap.get("RN1")));
            result.put("lightning", parseInt(weatherMap.get("LGT")));
            result.put("baseDate", baseDate);
            result.put("baseTime", baseTime);
            result.put("fcstTime", firstFcstTime);
            result.put("city", city);

            log.info("[{}] 날씨 조회 성공 - 기온: {}°C, 하늘: {}, 강수: {}",
                    city, result.get("temp"), result.get("sky"), result.get("ptyCode"));
            return result;

        } catch (Exception e) {
            log.error("기상청 API 호출 실패 [{}]: {}", city, e.getMessage(), e);
            throw new RuntimeException("날씨 정보를 불러올 수 없습니다", e);
        }
    }

    private double parseDouble(String val) {
        try { return Double.parseDouble(val); }
        catch (Exception e) { return 0.0; }
    }

    private int parseInt(String val) {
        try { return (int) Double.parseDouble(val); }
        catch (Exception e) { return 0; }
    }
}
