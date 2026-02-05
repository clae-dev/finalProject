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
     * - 제주 데이터만 필터링하여 저장
     */
    @Override
    public int syncAccommodationsFromApi() {
        
        int syncCount = 0;
        int pageNo = 1;
        int numOfRows = 100;
        int maxPages = 1000; // 테스트용: 10페이지(1000건)만 처리
        
        log.info("===== 숙소 정보 동기화 시작 =====");
        
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
                    
                    // 제주 데이터만 처리
                    if (!isJejuData(item)) {
                        continue;
                    }
                    
                    // 중복 체크
                    if (accommodationMapper.existsByTourApiId(item.getMNG_NO()) > 0) {
                        log.debug("이미 존재하는 숙소: {}", item.getBPLC_NM());
                        continue;
                    }
                    
                    // DTO 변환 및 저장
                    try {
                        AccommodationDTO dto = convertToDTO(item);
                        accommodationMapper.insertAccommodation(dto);
                        syncCount++;
                        
                        log.info("숙소 저장 성공: {} ({})", dto.getName(), dto.getRegion());
                        
                    } catch (Exception e) {
                        log.error("숙소 저장 실패: {}", item.getBPLC_NM(), e);
                    }
                }
                
                log.info("{}페이지 처리 완료 - 현재 동기화 수: {}", pageNo, syncCount);
                pageNo++;
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
        String roadAddr = item.getROAD_NM_ADDR();
        String lotnoAddr = item.getLOTNO_ADDR();
        
        if (roadAddr != null && roadAddr.contains("제주")) {
            return true;
        }
        
        if (lotnoAddr != null && lotnoAddr.contains("제주")) {
            return true;
        }
        
        return false;
    }
    
    /**
     * API Item을 DTO로 변환
     */
    private AccommodationDTO convertToDTO(RuralApiResponse.Item item) {
        
        AccommodationDTO dto = new AccommodationDTO();
        
        // 기본 정보
        dto.setTourApiId(item.getMNG_NO());
        dto.setName(item.getBPLC_NM());
        dto.setAddress(item.getROAD_NM_ADDR());
        dto.setPhone(item.getTELNO());
        
        // 지역 추출
        dto.setRegion(extractRegion(item.getROAD_NM_ADDR()));
        
        // 숙소 유형 (일단 기본값)
        dto.setAccommodationType("게스트하우스");
        
        // 상태 변환
        dto.setStatus(convertStatus(item.getSALS_STTS_NM()));
        
        // 좌표는 일단 NULL (TM좌표 변환 필요)
        dto.setLatitude(null);
        dto.setLongitude(null);
        
        return dto;
    }
    
    /**
     * 주소에서 지역 추출
     */
    private String extractRegion(String roadAddr) {
        if (roadAddr == null) return null;
        
        if (roadAddr.contains("제주시")) return "제주시";
        if (roadAddr.contains("서귀포시")) return "서귀포시";
        
        return null;
    }
    
    /**
     * API 상태 → DB 상태 변환
     */
    private String convertStatus(String apiStatus) {
        if (apiStatus == null) return "A";
        
        if (apiStatus.contains("영업") || apiStatus.contains("정상")) {
            return "A"; // 활성
        }
        
        return "C"; // 폐업
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
}