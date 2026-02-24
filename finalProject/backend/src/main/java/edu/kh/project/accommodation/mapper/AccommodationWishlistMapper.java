package edu.kh.project.accommodation.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AccommodationWishlistMapper {
    int checkWishlist(@Param("accommodationNo") int accommodationNo, @Param("memberNo") int memberNo);
    int insertWishlist(@Param("accommodationNo") int accommodationNo, @Param("memberNo") int memberNo);
    int deleteWishlist(@Param("accommodationNo") int accommodationNo, @Param("memberNo") int memberNo);
    List<Map<String, Object>> selectWishlistByMember(@Param("memberNo") int memberNo);
}
