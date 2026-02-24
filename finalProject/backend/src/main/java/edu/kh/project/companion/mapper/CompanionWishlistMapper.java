package edu.kh.project.companion.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CompanionWishlistMapper {
    int checkWishlist(@Param("companionNo") int companionNo, @Param("memberNo") int memberNo);
    int insertWishlist(@Param("companionNo") int companionNo, @Param("memberNo") int memberNo);
    int deleteWishlist(@Param("companionNo") int companionNo, @Param("memberNo") int memberNo);
    List<Map<String, Object>> selectWishlistByMember(@Param("memberNo") int memberNo);
}
