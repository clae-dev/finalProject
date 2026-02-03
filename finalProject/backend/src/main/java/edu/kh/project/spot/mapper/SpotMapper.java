package edu.kh.project.spot.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.spot.dto.SpotDTO;

/**
 * 명소 MyBatis Mapper
 */
@Mapper
public interface SpotMapper {

    // 활성화된 명소 목록 조회 (메인페이지용)
    List<SpotDTO> selectActiveSpots();

    // 전체 명소 목록 조회 (관리자용)
    List<SpotDTO> selectAllSpots();

    // 명소 상세 조회
    SpotDTO selectSpotByNo(@Param("spotNo") int spotNo);

    // 명소 등록
    int insertSpot(SpotDTO spot);

    // 명소 수정
    int updateSpot(SpotDTO spot);

    // 명소 삭제
    int deleteSpot(@Param("spotNo") int spotNo);

    // 명소 상태 변경
    int updateSpotStatus(@Param("spotNo") int spotNo, @Param("status") String status);
}
