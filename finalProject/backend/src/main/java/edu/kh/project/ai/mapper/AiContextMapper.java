package edu.kh.project.ai.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AiContextMapper {

    /** 인기 숙소 15개 (조회수 순, 평균 별점 포함) */
    List<Map<String, Object>> selectAccommodationSummary();

    /** 활성 명소 전체 */
    List<Map<String, Object>> selectActiveSpotSummary();

    /** 모집중 동행 최근 10건 */
    List<Map<String, Object>> selectRecentCompanionSummary();

    /** 인기 게시글 조회수 TOP 10 */
    List<Map<String, Object>> selectPopularBoardSummary();

    /** 숙소 후기 전체 통계 */
    Map<String, Object> selectReviewStats();
}
