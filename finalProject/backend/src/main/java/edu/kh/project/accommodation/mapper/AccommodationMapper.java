package edu.kh.project.accommodation.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import edu.kh.project.accommodation.dto.AccommodationDTO;

@Mapper
public interface AccommodationMapper {

    void dropAccommodationTypeConstraint();

    int deleteAllAccommodations();

    int existsByTourApiId(@Param("tourApiId") String tourApiId);

    int insertAccommodation(AccommodationDTO accommodation);

    List<AccommodationDTO> selectAccommodationList(
        @Param("offset") int offset,
        @Param("limit") int limit,
        @Param("region") String region
    );

    AccommodationDTO selectAccommodationByNo(@Param("accommodationNo") long accommodationNo);

    int selectTotalCount(@Param("region") String region);

    int reclassifyAccommodationTypes();

    int updateAccommodationDetail(AccommodationDTO accommodation);

    List<AccommodationDTO> selectAllActiveAccommodations();

    int insertAccommodationImage(@Param("accommodationNo") long accommodationNo,
                                 @Param("imageUrl") String imageUrl,
                                 @Param("imageOrder") int imageOrder);

    int deleteAccommodationImages(@Param("accommodationNo") long accommodationNo);
}
