package edu.kh.project.admin.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 관리자 서비스 인터페이스
 *
 * <p>관리자 대시보드 통계, 회원/동행/후기/숙소/신고/인증 관리 등
 * 관리자 전용 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 * @see AdminServiceImpl
 */
public interface AdminService {

    // 대시보드 통계
    Map<String, Object> getDashboardStats();

    // 회원 관리
    List<Map<String, Object>> getMemberList(int page, int size, String search, String searchType);
    int getMemberCount(String search, String searchType);
    int updateMemberStatus(int memberNo, String status);

    // 동행 관리
    List<Map<String, Object>> getCompanionList(int page, int size, String search);
    int getCompanionCount(String search);
    int deleteCompanion(int companionNo);

    // 후기 관리
    List<Map<String, Object>> getReviewList(int page, int size, String search);
    int getReviewCount(String search);
    int deleteReview(int reviewNo);

    // 숙소 관리
    List<Map<String, Object>> getAccommodationList(int page, int size, String search);
    int getAccommodationCount(String search);
    int updateAccommodationStatus(int accommodationNo, String status);
    int insertAccommodation(Map<String, Object> params);
    int updateAccommodation(Map<String, Object> params);
    int deleteAccommodation(int accommodationNo);
    int insertAccommodationWithImages(Map<String, Object> params, MultipartFile thumbnail,
                                       List<MultipartFile> images, String webPath, String folderPath);
    int updateAccommodationWithImages(Map<String, Object> params, MultipartFile thumbnail,
                                       List<MultipartFile> images, boolean keepExistingImages,
                                       String webPath, String folderPath);

    // 회원 인증 관리
    List<Map<String, Object>> getVerificationList(int page, int size, String status);
    int getVerificationCount(String status);
    int approveVerification(int verificationNo, int adminMemberNo);
    int rejectVerification(int verificationNo, String adminComment, int adminMemberNo);

    // 숙소 후기 관리
    List<Map<String, Object>> getAccommodationReviewList(int page, int size, String search);
    int getAccommodationReviewCount(String search);
    int deleteAccommodationReview(int reviewNo);
    int approveAccommodationReview(int reviewNo);
    int rejectAccommodationReview(int reviewNo);

    // 신고 관리
    List<Map<String, Object>> getReportList(int page, int size, String status, String targetType);
    int getReportCount(String status, String targetType);
    Map<String, Object> getReportDetail(int reportNo);
    int updateReportStatus(int reportNo, String status, String result);
    int getPendingReportCount();
}
