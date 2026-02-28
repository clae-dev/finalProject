package edu.kh.project.weather.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
 *
 * <p>공공데이터포털 VilageFcstInfoService_2.0 / getUltraSrtFcst를 호출하여
 * 기온(T1H), 하늘상태(SKY), 강수형태(PTY), 습도(REH), 풍속(WSD) 등을 파싱한다.</p>
 *
 * <ul>
 *   <li>제주시 격자좌표: nx=53, ny=38</li>
 *   <li>서귀포시 격자좌표: nx=52, ny=33</li>
 * </ul>
 *
 * @author HONDI
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

    private static final String FCST_API_URL =
            "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

    // 단기예보 발표 시각 (매시각 정각 기준, 10분 후 조회 가능)
    private static final int[] FCST_BASE_HOURS = {2, 5, 8, 11, 14, 17, 20, 23};

    // 도시별 격자좌표
    private static final Map<String, int[]> CITY_GRID = Map.of(
            "jeju",     new int[]{53, 38},
            "seogwipo", new int[]{52, 33}
    );

    /**
     * 제주도 날씨 조회 (초단기예보)
     *
     * @param city "jeju" 또는 "seogwipo"
     * @return 기온, 하늘상태, 강수형태, 습도, 풍속 등을 담은 Map
     * @throws RuntimeException API 호출 실패 시
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

    /**
     * 제주도 3일 단기예보 조회
     *
     * @param city "jeju" 또는 "seogwipo"
     * @return 오늘/내일/모레 각 날짜별 {date, label, sky, ptyCode, tmin, tmax} 리스트
     */
    public List<Map<String, Object>> getForecast(String city) {

        int[] grid = CITY_GRID.getOrDefault(city, CITY_GRID.get("jeju"));

        // base_time 계산: 발표 시각(0200,0500,...,2300) 중 10분 이상 지난 가장 최근 시각
        LocalDateTime now = LocalDateTime.now();
        int curTotalMin = now.getHour() * 60 + now.getMinute();

        LocalDateTime baseDateTime = now.minusDays(1).withHour(23).withMinute(0).withSecond(0).withNano(0);
        for (int i = FCST_BASE_HOURS.length - 1; i >= 0; i--) {
            if (curTotalMin >= FCST_BASE_HOURS[i] * 60 + 10) {
                baseDateTime = now.withHour(FCST_BASE_HOURS[i]).withMinute(0).withSecond(0).withNano(0);
                break;
            }
        }

        String baseDate = baseDateTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseTime = baseDateTime.format(DateTimeFormatter.ofPattern("HH")) + "00";

        log.info("===== 기상청 단기예보 API 호출 [{}] =====", city);
        log.info("baseDate: {}, baseTime: {}, nx: {}, ny: {}", baseDate, baseTime, grid[0], grid[1]);

        String url = UriComponentsBuilder.fromHttpUrl(FCST_API_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 1000)
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
            Map<String, Object> itemsObj = (Map<String, Object>) body.get("items");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemList = (List<Map<String, Object>>) itemsObj.get("item");

            // 날짜별 카테고리 수집
            Map<String, Map<String, String>> dayMap = new LinkedHashMap<>();
            Map<String, Map<String, String>> skyByDate = new LinkedHashMap<>();
            Map<String, Map<String, String>> ptyByDate = new LinkedHashMap<>();
            Map<String, List<Double>> tmpByDate = new LinkedHashMap<>();

            for (Map<String, Object> item : itemList) {
                String fcstDate = (String) item.get("fcstDate");
                String fcstTime = (String) item.get("fcstTime");
                String category = (String) item.get("category");
                String fcstValue = String.valueOf(item.get("fcstValue"));

                dayMap.putIfAbsent(fcstDate, new HashMap<>());

                switch (category) {
                    case "TMN":
                        dayMap.get(fcstDate).putIfAbsent("TMN", fcstValue);
                        break;
                    case "TMX":
                        dayMap.get(fcstDate).putIfAbsent("TMX", fcstValue);
                        break;
                    case "TMP":
                        tmpByDate.computeIfAbsent(fcstDate, k -> new ArrayList<>())
                                 .add(parseDouble(fcstValue));
                        break;
                    case "SKY":
                        skyByDate.computeIfAbsent(fcstDate, k -> new LinkedHashMap<>())
                                 .put(fcstTime, fcstValue);
                        break;
                    case "PTY":
                        ptyByDate.computeIfAbsent(fcstDate, k -> new LinkedHashMap<>())
                                 .put(fcstTime, fcstValue);
                        break;
                    default:
                        break;
                }
            }

            // 오늘부터 3일치 추출
            String todayStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String[] labels = {"오늘", "내일", "모레"};
            List<Map<String, Object>> result = new ArrayList<>();
            int dayIdx = 0;

            for (String date : dayMap.keySet()) {
                if (date.compareTo(todayStr) < 0) continue;
                if (dayIdx >= 3) break;

                Map<String, String> d = dayMap.get(date);

                // 최저/최고 기온: TMN/TMX 직접값 → 없으면 TMP 시계열 min/max
                double tmin = d.get("TMN") != null ? parseDouble(d.get("TMN"))
                        : tmpByDate.getOrDefault(date, List.of(0.0)).stream()
                                   .mapToDouble(Double::doubleValue).min().orElse(0);
                double tmax = d.get("TMX") != null ? parseDouble(d.get("TMX"))
                        : tmpByDate.getOrDefault(date, List.of(0.0)).stream()
                                   .mapToDouble(Double::doubleValue).max().orElse(0);

                // 하늘/강수: 낮 시간대(1200 → 1500 → 1300 → 첫값) 대표값
                int sky = pickRepresentativeValue(skyByDate.get(date));
                int pty = pickRepresentativeValue(ptyByDate.get(date));

                Map<String, Object> dayResult = new LinkedHashMap<>();
                dayResult.put("date", date);
                dayResult.put("label", labels[dayIdx]);
                dayResult.put("sky", sky);
                dayResult.put("ptyCode", pty);
                dayResult.put("tmin", Math.round(tmin * 10.0) / 10.0);
                dayResult.put("tmax", Math.round(tmax * 10.0) / 10.0);
                result.add(dayResult);
                dayIdx++;
            }

            log.info("[{}] 단기예보 조회 성공 - {}일치", city, result.size());
            return result;

        } catch (Exception e) {
            log.error("단기예보 API 호출 실패 [{}]: {}", city, e.getMessage(), e);
            throw new RuntimeException("예보 정보를 불러올 수 없습니다", e);
        }
    }

    /** 하늘상태/강수형태: 낮 시간대(1200→1500→1300→첫값) 대표값 반환 */
    private int pickRepresentativeValue(Map<String, String> timeMap) {
        if (timeMap == null || timeMap.isEmpty()) return 1;
        for (String t : new String[]{"1200", "1500", "1300", "1100", "0900"}) {
            if (timeMap.containsKey(t)) return parseInt(timeMap.get(t));
        }
        return parseInt(timeMap.values().iterator().next());
    }

    /** 문자열을 double로 변환 (실패 시 0.0 반환) */
    private double parseDouble(String val) {
        try { return Double.parseDouble(val); }
        catch (Exception e) { return 0.0; }
    }

    /** 문자열을 int로 변환 (실패 시 0 반환) */
    private int parseInt(String val) {
        try { return (int) Double.parseDouble(val); }
        catch (Exception e) { return 0; }
    }
}
