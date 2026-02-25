package edu.kh.project.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 관리자 MyBatis Mapper
 *
 * <p>관리자 기능에 필요한 SQL 매핑 인터페이스.
 * 대시보드 통계, 회원/동행/후기/숙소/신고/인증 관리 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface AdminMapper {

    // ── 대시보드 ──

    /** 오늘 가입자 수 */
    int selectTodaySignupCount();
    /** 최근 가입 회원 목록 */
    List<Map<String, Object>> selectRecentMembers();

    // ── 회원 관리 ──

    /** 회원 목록 조회 (페이징 + 검색) */
    List<Map<String, Object>> selectMemberList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search,
            @Param("searchType") String searchType);

    /** 회원 총 수 */
    int selectMemberCount(
            @Param("search") String search,
            @Param("searchType") String searchType);

    /** 회원 상태 변경 (활성/정지/탈퇴) */
    int updateMemberStatus(
            @Param("memberNo") int memberNo,
            @Param("status") String status);

    // ── 동행 관리 ──

    /** 동행 게시글 목록 (관리자용) */
    List<Map<String, Object>> selectAdminCompanionList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    /** 동행 게시글 총 수 */
    int selectCompanionCount(@Param("search") String search);

    /** 동행 게시글 삭제 */
    int deleteCompanion(@Param("companionNo") int companionNo);

    // ── 동행 후기 관리 ──

    /** 동행 후기 목록 (관리자용) */
    List<Map<String, Object>> selectAdminReviewList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    /** 동행 후기 총 수 */
    int selectReviewCount(@Param("search") String search);

    /** 동행 후기 삭제 */
    int deleteReview(@Param("reviewNo") int reviewNo);

    // ── 숙소 관리 ──

    /** 숙소 목록 (관리자용) */
    List<Map<String, Object>> selectAdminAccommodationList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    /** 숙소 총 수 */
    int selectAccommodationCount(@Param("search") String search);

    /** 숙소 상태 변경 (활성/폐업) */
    int updateAccommodationStatus(
            @Param("accommodationNo") int accommodationNo,
            @Param("status") String status);

    /** 숙소 등록 */
    int insertAccommodation(Map<String, Object> params);

    /** 숙소 정보 수정 */
    int updateAccommodation(Map<String, Object> params);

    /** 숙소 삭제 */
    int deleteAccommodation(@Param("accommodationNo") int accommodationNo);

    // ── 신고 관리 ──

    /** 신고 목록 (상태/유형 필터) */
    List<Map<String, Object>> selectAdminReportList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("status") String status,
            @Param("targetType") String targetType);

    /** 신고 총 수 */
    int selectAdminReportCount(
            @Param("status") String status,
            @Param("targetType") String targetType);

    /** 신고 상세 조회 */
    Map<String, Object> selectAdminReportDetail(@Param("reportNo") int reportNo);

    /** 신고 상태 변경 (처리/반려) */
    int updateReportStatus(
            @Param("reportNo") int reportNo,
            @Param("status") String status,
            @Param("result") String result);

    /** 처리 대기 신고 수 */
    int selectPendingReportCount();

    // ── 인증 관리 ──

    /** 인증 신청 번호로 회원 번호 조회 */
    int selectMemberNoByVerificationNo(@Param("verificationNo") int verificationNo);

    // ── 숙소 후기 관리 ──

    /** 숙소 후기 목록 (관리자용) */
    List<Map<String, Object>> selectAdminAccommodationReviewList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("search") String search);

    /** 숙소 후기 총 수 */
    int selectAccommodationReviewCount(@Param("search") String search);

    /** 숙소 후기 삭제 */
    int deleteAccommodationReview(@Param("reviewNo") int reviewNo);

    /** 숙소 후기 승인 (W → A) */
    int approveAccommodationReview(@Param("reviewNo") int reviewNo);

    /** 숙소 후기 거부 (W → R) */
    int rejectAccommodationReview(@Param("reviewNo") int reviewNo);

    /** 후기 번호로 작성자 회원번호 조회 */
    int selectMemberNoByReviewNo(@Param("reviewNo") int reviewNo);

    /** 후기 번호로 숙소번호 조회 */
    int selectAccommodationNoByReviewNo(@Param("reviewNo") int reviewNo);
}
