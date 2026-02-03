package edu.kh.project.spot.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.spot.dto.SpotDTO;
import edu.kh.project.spot.mapper.SpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 명소 Service 구현체
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SpotServiceImpl implements SpotService {

    private final SpotMapper spotMapper;

    /**
     * 활성화된 명소 목록 조회 (메인페이지용)
     */
    @Override
    public List<SpotDTO> getActiveSpots() {
        return spotMapper.selectActiveSpots();
    }

    /**
     * 전체 명소 목록 조회 (관리자용)
     */
    @Override
    public List<SpotDTO> getAllSpots() {
        return spotMapper.selectAllSpots();
    }

    /**
     * 명소 상세 조회
     */
    @Override
    public SpotDTO getSpotByNo(int spotNo) {
        return spotMapper.selectSpotByNo(spotNo);
    }

    /**
     * 명소 등록
     */
    @Override
    public int createSpot(SpotDTO spot) {
        int result = spotMapper.insertSpot(spot);

        if (result > 0) {
            log.info("명소 등록 성공: {}", spot.getSpotTitle());
        }

        return result;
    }

    /**
     * 명소 수정
     */
    @Override
    public int updateSpot(SpotDTO spot) {
        int result = spotMapper.updateSpot(spot);

        if (result > 0) {
            log.info("명소 수정 성공: {}", spot.getSpotTitle());
        }

        return result;
    }

    /**
     * 명소 삭제
     */
    @Override
    public int deleteSpot(int spotNo) {
        int result = spotMapper.deleteSpot(spotNo);

        if (result > 0) {
            log.info("명소 삭제 성공: spotNo={}", spotNo);
        }

        return result;
    }

    /**
     * 명소 상태 변경
     */
    @Override
    public int updateSpotStatus(int spotNo, String status) {
        int result = spotMapper.updateSpotStatus(spotNo, status);

        if (result > 0) {
            log.info("명소 상태 변경: spotNo={}, status={}", spotNo, status);
        }

        return result;
    }
}
