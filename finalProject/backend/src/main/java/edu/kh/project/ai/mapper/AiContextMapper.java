package edu.kh.project.ai.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

/**
 * AI 채팅용 DB 컨텍스트 조회 Mapper
 *
 * <p>AI 창식이가 응답을 생성할 때 참고할 HONDI 플랫폼의 실시간 데이터를 조회한다.
 * 숙소, 명소, 동행 모집, 인기 게시글, 후기 통계 등의 요약 정보를
 * 시스템 프롬프트에 주입하여 맥락 기반 응답을 가능하게 한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface AiContextMapper {

    /**
     * 인기 숙소 요약 목록을 조회한다 (조회수 순 상위 15개).
     *
     * <p>숙소명, 유형, 지역, 가격 범위, 평균 별점, 리뷰 수, 편의시설 정보를 포함한다.</p>
     *
     * @return 인기 숙소 요약 정보 리스트 (name, type, region, priceMin, priceMax, avgRating, reviewCount, facilities)
     */
    List<Map<String, Object>> selectAccommodationSummary();

    /**
     * 활성 상태인 관광 명소 전체 목록을 조회한다.
     *
     * <p>명소명, 설명, 위치, 태그 정보를 포함한다.</p>
     *
     * @return 활성 명소 요약 정보 리스트 (title, description, location, tag)
     */
    List<Map<String, Object>> selectActiveSpotSummary();

    /**
     * 최근 동행 모집 글 목록을 조회한다 (최신순 10건).
     *
     * <p>모집 제목, 여행 날짜, 현재 참여 인원/최대 인원, 태그 정보를 포함한다.</p>
     *
     * @return 최근 동행 모집 요약 리스트 (title, travelDate, joinCount, maxMembers, tags)
     */
    List<Map<String, Object>> selectRecentCompanionSummary();

    /**
     * 커뮤니티 인기 게시글 목록을 조회한다 (조회수 순 상위 10건).
     *
     * <p>게시글 제목과 조회수 정보를 포함한다.</p>
     *
     * @return 인기 게시글 요약 리스트 (title, viewCount)
     */
    List<Map<String, Object>> selectPopularBoardSummary();

    /**
     * 숙소 후기 전체 통계를 조회한다.
     *
     * <p>전체 후기 수와 평균 별점 정보를 반환한다.</p>
     *
     * @return 후기 통계 Map (totalCount, avgRating)
     */
    Map<String, Object> selectReviewStats();
}
