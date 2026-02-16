package edu.kh.project.event.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
 * 한국관광공사 TourAPI - searchFestival2 호출 서비스
 * - 제주 지역(areaCode=39) 축제/행사 데이터 조회
 */
@Service
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class EventService {

    private final RestTemplate restTemplate;

    @Value("${public.api.serviceKey}")
    private String serviceKey;

    private static final String API_URL =
            "https://apis.data.go.kr/B551011/KorService2/searchFestival2";

    private static final String PLACEHOLDER_KEY = "YOUR_SERVICE_KEY_HERE";

    /**
     * 제주 축제/행사 목록 조회
     * @param page 페이지 번호
     * @param size 페이지 당 항목 수
     * @param eventStartDate 행사 시작일 (YYYYMMDD), null이면 오늘 날짜
     * @return { list, totalCount }
     */
    public Map<String, Object> searchFestivals(int page, int size, String eventStartDate) {

        Map<String, Object> result = new HashMap<>();

        // API 키가 placeholder면 빈 리스트 반환
        if (serviceKey == null || serviceKey.isBlank() || PLACEHOLDER_KEY.equals(serviceKey)) {
            log.warn("공공 API 서비스 키가 설정되지 않았습니다 (placeholder)");
            result.put("list", new ArrayList<>());
            result.put("totalCount", 0);
            result.put("needApiKey", true);
            return result;
        }

        // eventStartDate 기본값: 작년 1월 1일 (TourAPI 데이터가 올해 것이 아직 없을 수 있으므로)
        if (eventStartDate == null || eventStartDate.isBlank()) {
            eventStartDate = (LocalDate.now().getYear() - 1) + "0101";
        }

        log.info("===== TourAPI searchFestival2 호출 =====");
        log.info("page: {}, size: {}, eventStartDate: {}", page, size, eventStartDate);

        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", size)
                .queryParam("pageNo", page)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .queryParam("eventStartDate", eventStartDate)
                .queryParam("areaCode", 39)
                .queryParam("arrange", "A")
                .build(false)
                .toUriString();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            @SuppressWarnings("unchecked")
            Map<String, Object> header = (Map<String, Object>) response.get("header");

            String resultCode = String.valueOf(header.get("resultCode"));
            if (!"0000".equals(resultCode)) {
                log.warn("TourAPI 응답 에러: {} - {}", resultCode, header.get("resultMsg"));
                result.put("list", new ArrayList<>());
                result.put("totalCount", 0);
                return result;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.get("body");

            int totalCount = 0;
            Object totalCountObj = body.get("totalCount");
            if (totalCountObj instanceof Number) {
                totalCount = ((Number) totalCountObj).intValue();
            }

            List<Map<String, Object>> list = new ArrayList<>();

            if (totalCount > 0 && body.get("items") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> items = (Map<String, Object>) body.get("items");
                Object itemObj = items.get("item");

                List<Map<String, Object>> itemList;
                if (itemObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> temp = (List<Map<String, Object>>) itemObj;
                    itemList = temp;
                } else if (itemObj instanceof Map) {
                    itemList = new ArrayList<>();
                    @SuppressWarnings("unchecked")
                    Map<String, Object> singleItem = (Map<String, Object>) itemObj;
                    itemList.add(singleItem);
                } else {
                    itemList = new ArrayList<>();
                }

                for (Map<String, Object> item : itemList) {
                    Map<String, Object> event = new HashMap<>();
                    event.put("title", item.get("title"));
                    event.put("addr", item.get("addr1"));
                    event.put("image", item.get("firstimage"));
                    event.put("startDate", item.get("eventstartdate"));
                    event.put("endDate", item.get("eventenddate"));
                    event.put("tel", item.get("tel"));
                    event.put("contentId", item.get("contentid"));
                    event.put("contentTypeId", item.get("contenttypeid"));
                    list.add(event);
                }
            }

            result.put("list", list);
            result.put("totalCount", totalCount);

            log.info("TourAPI 조회 성공 - totalCount: {}, 현재 페이지 항목: {}", totalCount, list.size());
            return result;

        } catch (Exception e) {
            log.error("TourAPI 호출 실패: {}", e.getMessage(), e);
            result.put("list", new ArrayList<>());
            result.put("totalCount", 0);
            return result;
        }
    }
}
