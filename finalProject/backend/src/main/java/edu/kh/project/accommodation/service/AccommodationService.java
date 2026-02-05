package edu.kh.project.accommodation.service;

import java.util.List;
import edu.kh.project.accommodation.dto.AccommodationDTO;

/**
 * 숙소 정보 서비스 인터페이스
 */
public interface AccommodationService {
    
    /**
     * API 데이터 동기화 (관리자용)
     * @return 동기화된 숙소 개수
     */
    int syncAccommodationsFromApi();
    
    /**
     * 숙소 목록 조회
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @param region 지역 필터
     * @return 숙소 목록
     */
    List<AccommodationDTO> getAccommodationList(int page, int size, String region);
    
    /**
     * 숙소 상세 조회
     * @param accommodationNo 숙소 번호
     * @return 숙소 정보
     */
    AccommodationDTO getAccommodationDetail(long accommodationNo);
    
    /**
     * 총 숙소 개수 조회
     * @param region 지역 필터
     * @return 총 개수
     */
    int getTotalCount(String region);
}