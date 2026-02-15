package edu.kh.project.admin.service;

import java.util.List;
import java.util.Map;

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
}
