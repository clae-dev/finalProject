package edu.kh.project.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminMapper {

    // 대시보드
    int selectTodaySignupCount();
    List<Map<String, Object>> selectRecentMembers();

    // 회원
    List<Map<String, Object>> selectMemberList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search,
            @Param("searchType") String searchType);

    int selectMemberCount(
            @Param("search") String search,
            @Param("searchType") String searchType);

    int updateMemberStatus(
            @Param("memberNo") int memberNo,
            @Param("status") String status);

    // 동행
    List<Map<String, Object>> selectAdminCompanionList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    int selectCompanionCount(@Param("search") String search);

    int deleteCompanion(@Param("companionNo") int companionNo);

    // 후기
    List<Map<String, Object>> selectAdminReviewList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    int selectReviewCount(@Param("search") String search);

    int deleteReview(@Param("reviewNo") int reviewNo);

    // 숙소
    List<Map<String, Object>> selectAdminAccommodationList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    int selectAccommodationCount(@Param("search") String search);

    int updateAccommodationStatus(
            @Param("accommodationNo") int accommodationNo,
            @Param("status") String status);

    // 신고 관리
    List<Map<String, Object>> selectAdminReportList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("status") String status,
            @Param("targetType") String targetType);

    int selectAdminReportCount(
            @Param("status") String status,
            @Param("targetType") String targetType);

    Map<String, Object> selectAdminReportDetail(@Param("reportNo") int reportNo);

    int updateReportStatus(
            @Param("reportNo") int reportNo,
            @Param("status") String status,
            @Param("result") String result);

    int selectPendingReportCount();
}
