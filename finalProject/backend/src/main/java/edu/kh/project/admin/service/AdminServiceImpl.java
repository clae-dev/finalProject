package edu.kh.project.admin.service;

import edu.kh.project.admin.mapper.AdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminMapper adminMapper;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("memberCount", adminMapper.selectMemberCount(null, null));
        stats.put("companionCount", adminMapper.selectCompanionCount(null));
        stats.put("reviewCount", adminMapper.selectReviewCount(null));
        stats.put("accommodationCount", adminMapper.selectAccommodationCount(null));
        stats.put("todaySignupCount", adminMapper.selectTodaySignupCount());
        stats.put("recentMembers", adminMapper.selectRecentMembers());
        return stats;
    }

    @Override
    public List<Map<String, Object>> getMemberList(int page, int size, String search, String searchType) {
        int offset = (page - 1) * size;
        return adminMapper.selectMemberList(offset, size, search, searchType);
    }

    @Override
    public int getMemberCount(String search, String searchType) {
        return adminMapper.selectMemberCount(search, searchType);
    }

    @Override
    public int updateMemberStatus(int memberNo, String status) {
        return adminMapper.updateMemberStatus(memberNo, status);
    }

    @Override
    public List<Map<String, Object>> getCompanionList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return adminMapper.selectAdminCompanionList(offset, size, search);
    }

    @Override
    public int getCompanionCount(String search) {
        return adminMapper.selectCompanionCount(search);
    }

    @Override
    public int deleteCompanion(int companionNo) {
        return adminMapper.deleteCompanion(companionNo);
    }

    @Override
    public List<Map<String, Object>> getReviewList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return adminMapper.selectAdminReviewList(offset, size, search);
    }

    @Override
    public int getReviewCount(String search) {
        return adminMapper.selectReviewCount(search);
    }

    @Override
    public int deleteReview(int reviewNo) {
        return adminMapper.deleteReview(reviewNo);
    }

    @Override
    public List<Map<String, Object>> getAccommodationList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return adminMapper.selectAdminAccommodationList(offset, size, search);
    }

    @Override
    public int getAccommodationCount(String search) {
        return adminMapper.selectAccommodationCount(search);
    }

    @Override
    public int updateAccommodationStatus(int accommodationNo, String status) {
        return adminMapper.updateAccommodationStatus(accommodationNo, status);
    }
}
