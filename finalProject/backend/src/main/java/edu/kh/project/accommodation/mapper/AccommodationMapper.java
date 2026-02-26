package edu.kh.project.accommodation.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import edu.kh.project.accommodation.dto.AccommodationDTO;

/**
 * 숙소 MyBatis Mapper
 *
 * <p>ACCOMMODATION 테이블에 대한 SQL 매핑 인터페이스.
 * 숙소 CRUD, TourAPI 동기화, 유형 재분류, 이미지 관리 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface AccommodationMapper {

    /** 숙소 타입 제약조건 삭제 (데이터 초기화용) */
    void dropAccommodationTypeConstraint();

    /** 전체 숙소 삭제 (데이터 초기화용) */
    int deleteAllAccommodations();

    /** Tour API ID로 중복 확인 */
    int existsByTourApiId(@Param("tourApiId") String tourApiId);

    /** 숙소 등록 */
    int insertAccommodation(AccommodationDTO accommodation);

    /** 숙소 목록 조회 (페이징 + 지역 필터) */
    List<AccommodationDTO> selectAccommodationList(
        @Param("offset") int offset,
        @Param("limit") int limit,
        @Param("region") String region
    );

    /** 숙소 상세 조회 */
    AccommodationDTO selectAccommodationByNo(@Param("accommodationNo") long accommodationNo);

    /** 숙소 총 개수 (지역 필터) */
    int selectTotalCount(@Param("region") String region);

    /** 숙소 타입 자동 재분류 */
    int reclassifyAccommodationTypes();

    /** 숙소 상세 정보 수정 */
    int updateAccommodationDetail(AccommodationDTO accommodation);

    /** 활성 숙소 전체 조회 */
    List<AccommodationDTO> selectAllActiveAccommodations();

    /** 조회수 증가 */
    int incrementViewCount(@Param("accommodationNo") long accommodationNo);

    /** 숙소 이미지 등록 */
    int insertAccommodationImage(@Param("accommodationNo") long accommodationNo,
                                 @Param("imageUrl") String imageUrl,
                                 @Param("imageOrder") int imageOrder);

    /** 숙소 이미지 전체 삭제 */
    int deleteAccommodationImages(@Param("accommodationNo") long accommodationNo);
}
