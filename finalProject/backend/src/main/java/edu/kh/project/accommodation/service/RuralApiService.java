package edu.kh.project.accommodation.service;

import java.util.ArrayList;
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
 * TourAPI 숙박정보 호출 서비스
 * - 한국관광공사 areaBasedList2 (contentTypeId=32, 숙박) 제주 지역 조회
 */
@Service
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class RuralApiService {

    private final RestTemplate restTemplate;

    @Value("${public.api.serviceKey}")
    private String serviceKey;

    private static final String AREA_BASED_API_URL =
            "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
    private static final String DETAIL_INTRO_URL =
            "https://apis.data.go.kr/B551011/KorService2/detailIntro2";
    private static final String DETAIL_INFO_URL =
            "https://apis.data.go.kr/B551011/KorService2/detailInfo2";
    private static final String DETAIL_COMMON_URL =
            "https://apis.data.go.kr/B551011/KorService2/detailCommon2";

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAccommodations(int pageNo, int numOfRows) {

        log.info("===== TourAPI 숙박정보 호출 (page={}, rows={}) =====", pageNo, numOfRows);

        String url = UriComponentsBuilder.fromHttpUrl(AREA_BASED_API_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .queryParam("areaCode", 39)
                .queryParam("contentTypeId", 32)
                .queryParam("arrange", "Q")
                .build(false)
                .toUriString();

        try {
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            Map<String, Object> header = (Map<String, Object>) response.get("header");

            String resultCode = String.valueOf(header.get("resultCode"));
            if (!"0000".equals(resultCode)) {
                log.warn("TourAPI 숙박 응답 에러: {} - {}", resultCode, header.get("resultMsg"));
                return new ArrayList<>();
            }

            Map<String, Object> body = (Map<String, Object>) response.get("body");
            int totalCount = 0;
            Object totalCountObj = body.get("totalCount");
            if (totalCountObj instanceof Number) {
                totalCount = ((Number) totalCountObj).intValue();
            }
            log.info("TourAPI 숙박 조회 성공 - totalCount: {}", totalCount);

            if (totalCount == 0 || body.get("items") == null) {
                return new ArrayList<>();
            }

            Map<String, Object> items = (Map<String, Object>) body.get("items");
            Object itemObj = items.get("item");

            if (itemObj instanceof List) {
                return (List<Map<String, Object>>) itemObj;
            } else if (itemObj instanceof Map) {
                List<Map<String, Object>> list = new ArrayList<>();
                list.add((Map<String, Object>) itemObj);
                return list;
            }
            return new ArrayList<>();

        } catch (Exception e) {
            log.error("TourAPI 숙박정보 호출 실패: {}", e.getMessage(), e);
            throw new RuntimeException("TourAPI 숙박정보 호출 중 오류 발생", e);
        }
    }

    /**
     * detailIntro2 - 체크인/아웃, 편의시설 등
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDetailIntro(String contentId) {
        String url = UriComponentsBuilder.fromHttpUrl(DETAIL_INTRO_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("contentId", contentId)
                .queryParam("contentTypeId", 32)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .build(false).toUriString();
        try {
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            if (body.get("items") == null) return null;
            Map<String, Object> items = (Map<String, Object>) body.get("items");
            Object itemObj = items.get("item");
            if (itemObj instanceof List) {
                return ((List<Map<String, Object>>) itemObj).get(0);
            } else if (itemObj instanceof Map) {
                return (Map<String, Object>) itemObj;
            }
        } catch (Exception e) {
            log.warn("detailIntro2 호출 실패 (contentId={}): {}", contentId, e.getMessage());
        }
        return null;
    }

    /**
     * detailInfo2 - 객실 정보 (가격 포함)
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getDetailInfo(String contentId) {
        String url = UriComponentsBuilder.fromHttpUrl(DETAIL_INFO_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("contentId", contentId)
                .queryParam("contentTypeId", 32)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .build(false).toUriString();
        try {
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            if (body.get("items") == null) return new ArrayList<>();
            Map<String, Object> items = (Map<String, Object>) body.get("items");
            Object itemObj = items.get("item");
            if (itemObj instanceof List) {
                return (List<Map<String, Object>>) itemObj;
            } else if (itemObj instanceof Map) {
                List<Map<String, Object>> list = new ArrayList<>();
                list.add((Map<String, Object>) itemObj);
                return list;
            }
        } catch (Exception e) {
            log.warn("detailInfo2 호출 실패 (contentId={}): {}", contentId, e.getMessage());
        }
        return new ArrayList<>();
    }

    /**
     * detailCommon2 - 좌표(mapx/mapy) 등 기본 상세정보
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDetailCommon(String contentId) {
        String url = UriComponentsBuilder.fromHttpUrl(DETAIL_COMMON_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("contentId", contentId)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .build(false).toUriString();
        try {
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            if (raw == null || raw.get("response") == null) return null;
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            if (response.get("body") == null) return null;
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            if (body.get("items") == null) return null;
            Map<String, Object> items = (Map<String, Object>) body.get("items");
            Object itemObj = items.get("item");
            if (itemObj instanceof List) {
                return ((List<Map<String, Object>>) itemObj).get(0);
            } else if (itemObj instanceof Map) {
                return (Map<String, Object>) itemObj;
            }
        } catch (Exception e) {
            log.warn("detailCommon2 호출 실패 (contentId={}): {}", contentId, e.getMessage());
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public int getTotalCount() {
        String url = UriComponentsBuilder.fromHttpUrl(AREA_BASED_API_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 1)
                .queryParam("pageNo", 1)
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "HONDI")
                .queryParam("_type", "json")
                .queryParam("areaCode", 39)
                .queryParam("contentTypeId", 32)
                .queryParam("arrange", "Q")
                .build(false)
                .toUriString();

        try {
            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            Map<String, Object> response = (Map<String, Object>) raw.get("response");
            Map<String, Object> body = (Map<String, Object>) response.get("body");
            Object totalCountObj = body.get("totalCount");
            if (totalCountObj instanceof Number) {
                return ((Number) totalCountObj).intValue();
            }
            return 0;
        } catch (Exception e) {
            log.error("TourAPI totalCount 조회 실패: {}", e.getMessage());
            return 0;
        }
    }
}
