package edu.kh.project.accommodation.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.accommodation.dto.AccommodationDTO;
import edu.kh.project.accommodation.dto.RuralApiResponse;
import edu.kh.project.accommodation.mapper.AccommodationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 숙소 정보 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AccommodationServiceImpl implements AccommodationService {
    
    private final AccommodationMapper accommodationMapper;
    private final RuralApiService ruralApiService;
    
    /**
     * API 데이터 동기화
     * - 제주 데이터만 필터링
     * - 폐업 상태 제외
     */
    @Override
    public int syncAccommodationsFromApi() {
        
        int syncCount = 0;
        int pageNo = 1;
        int numOfRows = 100;
        int maxPages = 600; // 제주 데이터 찾기 위해 충분히 검색
        
        log.info("===== 숙소 정보 동기화 시작 =====");
        log.info("필터 조건: 제주 지역 + 폐업 제외");
        
        try {
            while (pageNo <= maxPages) {
                
                // API 호출
                RuralApiResponse response = ruralApiService.getRuralAccommodations(pageNo, numOfRows);
                
                if (response == null || 
                    response.getResponse() == null || 
                    response.getResponse().getBody() == null ||
                    response.getResponse().getBody().getItems() == null) {
                    break;
                }
                
                List<RuralApiResponse.Item> items = 
                    response.getResponse().getBody().getItems().getItem();
                
                if (items == null || items.isEmpty()) {
                    break;
                }
                
                // ✅ 첫 페이지 첫 데이터로 API 응답 구조 로깅
                if (pageNo == 1 && !items.isEmpty()) {
                    logApiResponseStructure(items.get(0));
                }
                
                // 각 항목 처리
                for (RuralApiResponse.Item item : items) {
                    
                    // 1. 제주 데이터 필터
                    if (!isJejuData(item)) {
                        continue;
                    }
                    
                    // 2. 폐업 상태 제외
                    if (!isActiveStatus(item)) {
                        log.debug("⏭️ 폐업 상태 제외: {} ({})", 
                                 item.getBPLC_NM(), item.getSALS_STTS_NM());
                        continue;
                    }
                    
                    // 3. 중복 체크
                    if (accommodationMapper.existsByTourApiId(item.getMNG_NO()) > 0) {
                        log.debug("이미 존재하는 숙소: {}", item.getBPLC_NM());
                        continue;
                    }
                    
                    // DTO 변환 및 저장
                    try {
                        AccommodationDTO dto = convertToDTO(item);
                        accommodationMapper.insertAccommodation(dto);
                        syncCount++;
                        
                        log.info("✅ 숙소 저장 성공: {} ({}) - 타입: {}", 
                                dto.getName(), dto.getRegion(), dto.getAccommodationType());
                        
                    } catch (Exception e) {
                        log.error("❌ 숙소 저장 실패: {}", item.getBPLC_NM(), e);
                    }
                }
                
                log.info("{}페이지 처리 완료 - 현재 동기화 수: {}", pageNo, syncCount);
                pageNo++;
                
                // 100페이지마다 진행 상황 출력
                if (pageNo % 100 == 0) {
                    log.info("🔍 진행 상황: {}/{}페이지 처리 완료, 총 {}건 저장", 
                             pageNo, maxPages, syncCount);
                }
            }
            
            log.info("===== 동기화 완료: {}건 =====", syncCount);
            
        } catch (Exception e) {
            log.error("동기화 중 오류 발생", e);
            throw new RuntimeException("숙소 정보 동기화 실패", e);
        }
        
        return syncCount;
    }
    
    /**
     * ✅ API 응답 구조 로깅 (디버깅용)
     */
    private void logApiResponseStructure(RuralApiResponse.Item item) {
        log.info("========== API 응답 샘플 데이터 ==========");
        log.info("사업장명(BPLC_NM): {}", item.getBPLC_NM());
        log.info("관리번호(MNG_NO): {}", item.getMNG_NO());
        log.info("도로명주소(ROAD_NM_ADDR): {}", item.getROAD_NM_ADDR());
        log.info("지번주소(LOTNO_ADDR): {}", item.getLOTNO_ADDR());
        log.info("전화번호(TELNO): {}", item.getTELNO());
        log.info("영업상태명(SALS_STTS_NM): {}", item.getSALS_STTS_NM());
        
        // ✅ 업종 관련 필드들 (이게 핵심!)
        log.info("--- 업종 분류 필드 ---");
        log.info("업종구분명(INDUTY_NM): {}", item.getINDUTY_NM());
        log.info("업태구분명(BSN_STATE_NM): {}", item.getBSN_STATE_NM());
        log.info("상세영업상태명(DTL_STTS_NM): {}", item.getDTL_STTS_NM());
        log.info("========================================");
    }
    
    /**
     * 제주 데이터인지 확인
     */
    private boolean isJejuData(RuralApiResponse.Item item) {
        String name = item.getBPLC_NM();
        String roadAddr = item.getROAD_NM_ADDR();
        String lotnoAddr = item.getLOTNO_ADDR();
        
        // 1. 사업장명에 "제주" 포함
        if (name != null && name.contains("제주")) {
            return true;
        }
        
        // 2. 도로명주소에 "제주" 포함
        if (roadAddr != null && roadAddr.contains("제주")) {
            return true;
        }
        
        // 3. 지번주소에 "제주" 포함
        if (lotnoAddr != null && lotnoAddr.contains("제주")) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 영업 중인 상태인지 확인 (폐업 제외)
     */
    private boolean isActiveStatus(RuralApiResponse.Item item) {
        String status = item.getSALS_STTS_NM();
        
        // NULL이면 포함 (상태 정보 없음)
        if (status == null) {
            return true;
        }
        
        // 폐업/휴업/폐쇄가 아니면 OK
        return !status.contains("폐업") && 
               !status.contains("폐쇄") && 
               !status.contains("휴업") &&
               !status.contains("중단");
    }
    
    /**
     * API Item을 DTO로 변환
     */
    private AccommodationDTO convertToDTO(RuralApiResponse.Item item) {
        
        AccommodationDTO dto = new AccommodationDTO();
        
        // 기본 정보
        dto.setTourApiId(item.getMNG_NO());
        dto.setName(item.getBPLC_NM());
        dto.setAddress(item.getROAD_NM_ADDR() != null ? 
                      item.getROAD_NM_ADDR() : item.getLOTNO_ADDR());
        dto.setPhone(item.getTELNO());
        
        // 지역 추출
        dto.setRegion(extractRegion(item));
        
        // ✅ 숙소 유형 (업종 필드 우선 사용)
        dto.setAccommodationType(extractAccommodationType(item));
        
        // 상태 (영업 중)
        dto.setStatus("A"); // 이미 필터링했으므로 무조건 Active
        
        // 좌표 (나중에 추가)
        dto.setLatitude(null);
        dto.setLongitude(null);
        
        return dto;
    }
    
    /**
     * 주소에서 지역 추출
     */
    private String extractRegion(RuralApiResponse.Item item) {
        String roadAddr = item.getROAD_NM_ADDR();
        String lotnoAddr = item.getLOTNO_ADDR();
        String name = item.getBPLC_NM();
        
        String[] sources = {roadAddr, lotnoAddr, name};
        
        for (String source : sources) {
            if (source != null) {
                if (source.contains("제주시")) return "제주시";
                if (source.contains("서귀포시")) return "서귀포시";
            }
        }
        
        return "제주시"; // 기본값
    }
    
    /**
     * ✅ 숙소 유형 추출 (우선순위: API 업종 필드 > 사업장명 키워드)
     */
    private String extractAccommodationType(RuralApiResponse.Item item) {
        
        String industryName = item.getINDUTY_NM();      // 업종구분명
        String businessState = item.getBSN_STATE_NM();  // 업태구분명
        String detailStatus = item.getDTL_STTS_NM();    // 상세영업상태명
        String businessName = item.getBPLC_NM();        // 사업장명
        
        // ✅ 1순위: 업종구분명 (INDUTY_NM)
        if (industryName != null && !industryName.trim().isEmpty()) {
            String normalized = normalizeAccommodationType(industryName);
            if (normalized != null) {
                log.debug("업종구분명으로 분류: {} -> {}", industryName, normalized);
                return normalized;
            }
        }
        
        // ✅ 2순위: 업태구분명 (BSN_STATE_NM)
        if (businessState != null && !businessState.trim().isEmpty()) {
            String normalized = normalizeAccommodationType(businessState);
            if (normalized != null) {
                log.debug("업태구분명으로 분류: {} -> {}", businessState, normalized);
                return normalized;
            }
        }
        
        // ✅ 3순위: 상세영업상태명 (DTL_STTS_NM)
        if (detailStatus != null && !detailStatus.trim().isEmpty()) {
            String normalized = normalizeAccommodationType(detailStatus);
            if (normalized != null) {
                log.debug("상세영업상태명으로 분류: {} -> {}", detailStatus, normalized);
                return normalized;
            }
        }
        
        // ✅ 4순위: 사업장명 키워드 매칭 (기존 로직)
        if (businessName != null) {
            String normalized = normalizeAccommodationType(businessName);
            if (normalized != null) {
                log.debug("사업장명으로 분류: {} -> {}", businessName, normalized);
                return normalized;
            }
        }
        
        // ✅ 기본값
        log.warn("⚠️ 숙소 타입을 결정할 수 없음. 기본값 '민박' 적용: {}", businessName);
        return "민박";
    }
    
    /**
     * ✅ 문자열을 정규화된 숙소 타입으로 변환
     * @param input 업종명, 업태명, 사업장명 등
     * @return 정규화된 숙소 타입 (없으면 null)
     */
    private String normalizeAccommodationType(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        
        String lower = input.toLowerCase().trim();
        
        // 호텔
        if (lower.contains("호텔") || lower.contains("hotel")) {
            return "호텔";
        }
        // 리조트
        if (lower.contains("리조트") || lower.contains("resort")) {
            return "리조트";
        }
        // 펜션
        if (lower.contains("펜션") || lower.contains("pension")) {
            return "펜션";
        }
        // 풀빌라
        if (lower.contains("풀빌라") || lower.contains("pool villa") || lower.contains("풀 빌라")) {
            return "풀빌라";
        }
        // 게스트하우스
        if (lower.contains("게스트하우스") || lower.contains("guesthouse") || 
            lower.contains("guest house") || lower.contains("게하")) {
            return "게스트하우스";
        }
        // 호스텔
        if (lower.contains("호스텔") || lower.contains("hostel")) {
            return "호스텔";
        }
        // 한옥
        if (lower.contains("한옥")) {
            return "한옥";
        }
        // 모텔
        if (lower.contains("모텔") || lower.contains("motel")) {
            return "모텔";
        }
        // 민박
        if (lower.contains("민박") || lower.contains("home stay") || 
            lower.contains("homestay") || lower.contains("농어촌민박")) {
            return "민박";
        }
        
        // 매칭 안되면 null 반환
        return null;
    }
    
    /**
     * 숙소 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<AccommodationDTO> getAccommodationList(int page, int size, String region) {
        int offset = (page - 1) * size;
        return accommodationMapper.selectAccommodationList(offset, size, region);
    }
    
    /**
     * 숙소 상세 조회
     */
    @Override
    @Transactional(readOnly = true)
    public AccommodationDTO getAccommodationDetail(long accommodationNo) {
        return accommodationMapper.selectAccommodationByNo(accommodationNo);
    }
    
    /**
     * 총 개수 조회
     */
    @Override
    @Transactional(readOnly = true)
    public int getTotalCount(String region) {
        return accommodationMapper.selectTotalCount(region);
    }

    /**
     * 기존 데이터 숙소 유형 재분류
     */
    @Override
    public int reclassifyAccommodationTypes() {
        int updated = accommodationMapper.reclassifyAccommodationTypes();
        log.info("숙소 유형 재분류 완료: {}건 업데이트", updated);
        return updated;
    }
}