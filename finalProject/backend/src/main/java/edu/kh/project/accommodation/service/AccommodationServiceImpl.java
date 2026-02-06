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
                        
                        log.info("✅ 숙소 저장 성공: {} ({})", dto.getName(), dto.getRegion());
                        
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
        
        // 숙소 유형
        dto.setAccommodationType(extractAccommodationType(item.getBPLC_NM()));
        
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
     * 사업장명에서 숙소 유형 추출
     */
    private String extractAccommodationType(String name) {
        if (name == null) return "민박";

        String lower = name.toLowerCase();

        if (lower.contains("호텔") || lower.contains("hotel")) return "호텔";
        if (lower.contains("리조트") || lower.contains("resort")) return "리조트";
        if (lower.contains("펜션") || lower.contains("pension")) return "펜션";
        if (lower.contains("풀빌라") || lower.contains("pool villa")) return "풀빌라";
        if (lower.contains("게스트하우스") || lower.contains("guesthouse") || lower.contains("guest house")) return "게스트하우스";
        if (lower.contains("호스텔") || lower.contains("hostel")) return "호스텔";
        if (lower.contains("한옥")) return "한옥";
        if (lower.contains("모텔")) return "모텔";
        if (lower.contains("민박")) return "민박";

        return "민박";
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