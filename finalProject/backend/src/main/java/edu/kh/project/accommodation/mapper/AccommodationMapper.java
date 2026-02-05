package edu.kh.project.accommodation.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import edu.kh.project.accommodation.dto.AccommodationDTO;

/**
 * 숙소 정보 MyBatis Mapper
 */
@Mapper
public interface AccommodationMapper {

    /**
     * Tour API ID로 숙소 존재 여부 확인
     * @param tourApiId API 관리번호
     * @return 존재하면 1, 없으면 0
     */
    int existsByTourApiId(@Param("tourApiId") String tourApiId);

    /**
     * 숙소 등록
     * @param accommodation 숙소 정보
     * @return 등록된 행 수
     */
    int insertAccommodation(AccommodationDTO accommodation);

    /**
     * 숙소 목록 조회 (페이징)
     * @param offset 시작 행 번호
     * @param limit 조회할 개수
     * @param region 지역 필터 (null이면 전체)
     * @return 숙소 목록
     */
    List<AccommodationDTO> selectAccommodationList(
        @Param("offset") int offset, 
        @Param("limit") int limit,
        @Param("region") String region
    );

    /**
     * 숙소 상세 조회
     * @param accommodationNo 숙소 번호
     * @return 숙소 정보
     */
    AccommodationDTO selectAccommodationByNo(@Param("accommodationNo") long accommodationNo);

    /**
     * 총 숙소 개수 조회
     * @param region 지역 필터 (null이면 전체)
     * @return 총 개수
     */
    int selectTotalCount(@Param("region") String region);
}