package edu.kh.project.spot.service;

import java.util.List;

import edu.kh.project.spot.dto.SpotDTO;

/**
 * 명소 Service 인터페이스
 */
public interface SpotService {

    // 활성화된 명소 목록 조회 (메인페이지용)
    List<SpotDTO> getActiveSpots();

    // 전체 명소 목록 조회 (관리자용)
    List<SpotDTO> getAllSpots();

    // 명소 상세 조회
    SpotDTO getSpotByNo(int spotNo);

    // 명소 등록
    int createSpot(SpotDTO spot);

    // 명소 수정
    int updateSpot(SpotDTO spot);

    // 명소 삭제
    int deleteSpot(int spotNo);

    // 명소 상태 변경
    int updateSpotStatus(int spotNo, String status);
}
