package edu.kh.project.accommodation.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.accommodation.dto.AccommodationDTO;
import edu.kh.project.accommodation.mapper.AccommodationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 숙소 정보 서비스 구현체
 *
 * <p>TourAPI(areaBasedList2, detailIntro2, detailInfo2, detailCommon2)를 호출하여
 * 숙소 데이터를 동기화하고, 목록/상세 조회, 숙소 유형 재분류를 구현한다.
 * 동기화 시 기존 데이터를 삭제 후 전체 재적재(Full Refresh) 방식을 사용한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AccommodationServiceImpl implements AccommodationService {

    private final AccommodationMapper accommodationMapper;
    private final RuralApiService ruralApiService;

    @Override
    public int syncAccommodationsFromApi() {

        int syncCount = 0;
        int pageNo = 1;
        int numOfRows = 100;

        log.info("===== TourAPI 숙박 데이터 동기화 시작 =====");

        // 1) CHK_ACCOM_TYPE 제약조건 DROP
        accommodationMapper.dropAccommodationTypeConstraint();
        log.info("CHK_ACCOM_TYPE 제약조건 제거 완료");

        // 2) 기존 데이터 삭제
        int deleted = accommodationMapper.deleteAllAccommodations();
        log.info("기존 숙소 데이터 {}건 삭제 완료", deleted);

        // 3) 전체 데이터 수 확인 → 페이지 수 계산
        int totalCount = ruralApiService.getTotalCount();
        int maxPages = (totalCount > 0) ? (totalCount / numOfRows) + 1 : 10;
        log.info("TourAPI 숙박 totalCount: {}, maxPages: {}", totalCount, maxPages);

        try {
            while (pageNo <= maxPages) {

                List<Map<String, Object>> items = ruralApiService.getAccommodations(pageNo, numOfRows);

                if (items == null || items.isEmpty()) {
                    log.info("{}페이지 데이터 없음 - 동기화 종료", pageNo);
                    break;
                }

                if (pageNo == 1) {
                    logApiResponseSample(items.get(0));
                }

                for (Map<String, Object> item : items) {

                    String contentId = getString(item, "contentid");
                    if (contentId != null && accommodationMapper.existsByTourApiId(contentId) > 0) {
                        continue;
                    }

                    try {
                        AccommodationDTO dto = convertToDTO(item);
                        accommodationMapper.insertAccommodation(dto);
                        syncCount++;
                        log.info("숙소 저장: {} ({})", dto.getName(), dto.getRegion());
                    } catch (Exception e) {
                        log.error("숙소 저장 실패: {}", getString(item, "title"), e);
                    }
                }

                log.info("{}페이지 처리 완료 - 현재 동기화: {}건", pageNo, syncCount);
                pageNo++;
            }

            // 4) INSERT 완료 후 Oracle SQL로 숙소 유형 재분류
            int reclassified = accommodationMapper.reclassifyAccommodationTypes();
            log.info("숙소 유형 재분류 완료: {}건", reclassified);

            // 5) 상세정보 수집 (detailIntro2 + detailInfo2 + detailCommon2)
            log.info("===== 상세정보 수집 시작 =====");
            List<AccommodationDTO> allAccom = accommodationMapper.selectAllActiveAccommodations();
            int detailCount = 0;

            for (AccommodationDTO acc : allAccom) {
                try {
                    fillDetailInfo(acc);
                    accommodationMapper.updateAccommodationDetail(acc);
                    detailCount++;
                    if (detailCount % 20 == 0) {
                        log.info("상세정보 수집 진행: {}/{}", detailCount, allAccom.size());
                    }
                } catch (Exception e) {
                    log.warn("상세정보 수집 실패: {} - {}", acc.getName(), e.getMessage());
                }
            }
            log.info("상세정보 수집 완료: {}/{}건", detailCount, allAccom.size());

            log.info("===== 동기화 완료: {}건 =====", syncCount);

        } catch (Exception e) {
            log.error("동기화 중 오류 발생", e);
            throw new RuntimeException("숙소 정보 동기화 실패", e);
        }

        return syncCount;
    }

    private void logApiResponseSample(Map<String, Object> item) {
        log.info("========== TourAPI 숙박 샘플 ==========");
        log.info("contentid: {}", item.get("contentid"));
        log.info("title: {}", item.get("title"));
        log.info("addr1: {}", item.get("addr1"));
        log.info("tel: {}", item.get("tel"));
        log.info("firstimage: {}", item.get("firstimage"));
        log.info("========================================");
    }

    private AccommodationDTO convertToDTO(Map<String, Object> item) {
        AccommodationDTO dto = new AccommodationDTO();
        dto.setTourApiId(getString(item, "contentid"));
        dto.setName(getString(item, "title"));
        dto.setAddress(getString(item, "addr1"));
        dto.setPhone(getString(item, "tel"));
        dto.setThumbnailUrl(getString(item, "firstimage"));
        dto.setRegion(extractRegion(getString(item, "addr1")));
        dto.setAccommodationType(null); // INSERT 후 SQL 재분류
        dto.setStatus("A");
        dto.setLatitude(null);
        dto.setLongitude(null);
        return dto;
    }

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? String.valueOf(val) : null;
    }

    /**
     * TourAPI 상세 API 3종 호출하여 DTO에 채워넣기
     */
    private void fillDetailInfo(AccommodationDTO acc) {
        String contentId = acc.getTourApiId();

        // 1) detailIntro2 → 체크인/아웃, 편의시설
        Map<String, Object> intro = ruralApiService.getDetailIntro(contentId);
        if (intro != null) {
            acc.setCheckInTime(getString(intro, "checkintime"));
            acc.setCheckOutTime(getString(intro, "checkouttime"));

            // 편의시설 조합 (라벨 붙여서)
            StringBuilder facilities = new StringBuilder();
            String sub = getString(intro, "subfacility");
            if (sub != null && !sub.isEmpty()) {
                appendIfPresent(facilities, sub);
            }
            appendLabeled(facilities, getString(intro, "parkinglodging"), "주차");
            appendLabeled(facilities, getString(intro, "pickup"), "픽업");
            appendLabeled(facilities, getString(intro, "foodplace"), "식음료");
            appendLabeled(facilities, getString(intro, "sauna"), "사우나");
            appendLabeled(facilities, getString(intro, "barbecue"), "바비큐");
            appendLabeled(facilities, getString(intro, "sports"), "스포츠시설");
            if (facilities.length() > 0) {
                acc.setFacilities(facilities.toString());
            }
        }

        // 2) detailInfo2 → 객실 가격 (최소/최대)
        List<Map<String, Object>> rooms = ruralApiService.getDetailInfo(contentId);
        if (!rooms.isEmpty()) {
            int minPrice = Integer.MAX_VALUE;
            int maxPrice = 0;
            for (Map<String, Object> room : rooms) {
                int fee = parsePrice(getString(room, "roomoffseasonminfee1"));
                if (fee == 0) fee = parsePrice(getString(room, "roompeakseasonminfee1"));
                if (fee > 0) {
                    minPrice = Math.min(minPrice, fee);
                    maxPrice = Math.max(maxPrice, fee);
                }
            }
            if (minPrice != Integer.MAX_VALUE) {
                acc.setPriceMin(minPrice);
                acc.setPriceMax(maxPrice > minPrice ? maxPrice : null);
            }
        }

        // 3) detailCommon2 → 좌표 + 소개글 자동 생성
        Map<String, Object> common = ruralApiService.getDetailCommon(contentId);
        if (common != null) {
            // 좌표
            String mapx = getString(common, "mapx");
            String mapy = getString(common, "mapy");
            if (mapx != null && !mapx.isEmpty()) {
                try { acc.setLongitude(Double.parseDouble(mapx)); } catch (NumberFormatException ignored) {}
            }
            if (mapy != null && !mapy.isEmpty()) {
                try { acc.setLatitude(Double.parseDouble(mapy)); } catch (NumberFormatException ignored) {}
            }
        }

        // 소개글 자동 생성
        acc.setRecommendationReason(generateDescription(acc));
    }

    private void appendIfPresent(StringBuilder sb, String value) {
        if (value != null && !value.isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(value);
        }
    }

    private void appendLabeled(StringBuilder sb, String value, String label) {
        if (value == null || value.isEmpty()) return;
        String v = value.trim();
        // 긍정적 값만 표시
        if (v.equals("가능") || v.equals("있음") || v.equals("1")) {
            appendIfPresent(sb, label + " 있음");
        } else if (v.equals("불가") || v.equals("없음") || v.equals("0")) {
            // 부정적 값은 무시
        } else {
            // 설명이 있는 경우 그대로 사용
            appendIfPresent(sb, label + ": " + v);
        }
    }

    private int parsePrice(String value) {
        if (value == null || value.isEmpty()) return 0;
        try {
            return Integer.parseInt(value.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private String generateDescription(AccommodationDTO acc) {
        StringBuilder desc = new StringBuilder();
        String region = acc.getRegion() != null ? acc.getRegion() : "제주";
        String type = acc.getAccommodationType() != null ? acc.getAccommodationType() : "숙소";

        desc.append(region).append("에 위치한 ").append(acc.getName());

        if (acc.getPriceMin() != null) {
            desc.append(", ");
            int min = acc.getPriceMin() / 10000;
            if (acc.getPriceMax() != null && !acc.getPriceMax().equals(acc.getPriceMin())) {
                int max = acc.getPriceMax() / 10000;
                desc.append(min).append("~").append(max).append("만원대");
            } else {
                desc.append(min).append("만원대~");
            }
        }

        if (acc.getCheckInTime() != null) {
            desc.append(". 체크인 ").append(acc.getCheckInTime());
            if (acc.getCheckOutTime() != null) {
                desc.append(", 체크아웃 ").append(acc.getCheckOutTime());
            }
        }

        if (acc.getFacilities() != null && !acc.getFacilities().isEmpty()) {
            desc.append(". ").append(acc.getFacilities());
        }

        return desc.toString();
    }

    private String extractRegion(String address) {
        if (address != null) {
            if (address.contains("서귀포시")) return "서귀포시";
            if (address.contains("제주시")) return "제주시";
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccommodationDTO> getAccommodationList(int page, int size, String region) {
        int offset = (page - 1) * size;
        return accommodationMapper.selectAccommodationList(offset, size, region);
    }

    @Override
    @Transactional
    public AccommodationDTO getAccommodationDetail(long accommodationNo) {
        // 조회수 증가
        accommodationMapper.incrementViewCount(accommodationNo);

        AccommodationDTO dto = accommodationMapper.selectAccommodationByNo(accommodationNo);
        if (dto != null && dto.getImageUrlsRaw() != null && !dto.getImageUrlsRaw().isEmpty()) {
            List<String> urls = Arrays.stream(dto.getImageUrlsRaw().split("\\|\\|"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            dto.setImageUrls(urls);
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public int getTotalCount(String region) {
        return accommodationMapper.selectTotalCount(region);
    }

    @Override
    public int reclassifyAccommodationTypes() {
        int updated = accommodationMapper.reclassifyAccommodationTypes();
        log.info("숙소 유형 재분류 완료: {}건", updated);
        return updated;
    }
}
