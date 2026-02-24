package edu.kh.project.companion.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReviewWishlistMapper {
    int checkWishlist(@Param("reviewNo") int reviewNo, @Param("memberNo") int memberNo);
    int insertWishlist(@Param("reviewNo") int reviewNo, @Param("memberNo") int memberNo);
    int deleteWishlist(@Param("reviewNo") int reviewNo, @Param("memberNo") int memberNo);
    List<Map<String, Object>> selectWishlistByMember(@Param("memberNo") int memberNo);
}
