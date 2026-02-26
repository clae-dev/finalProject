package edu.kh.project.admin.service;

import edu.kh.project.accommodation.mapper.AccommodationMapper;
import edu.kh.project.admin.mapper.AdminMapper;
import edu.kh.project.member.mapper.MemberVerificationMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 관리자 서비스 구현체
 *
 * <p>대시보드 통계 조회, 회원 상태 관리, 게시글 삭제,
 * 숙소 CRUD(이미지 포함), 인증서류 승인/거부, 신고 처리 등
 * 관리자 기능 전체를 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final AdminMapper adminMapper;
    private final AccommodationMapper accommodationMapper;
    private final MemberVerificationMapper verificationMapper;
    private final NotificationService notificationService;

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

    @Override
    public int insertAccommodation(Map<String, Object> params) {
        return adminMapper.insertAccommodation(params);
    }

    @Override
    public int updateAccommodation(Map<String, Object> params) {
        return adminMapper.updateAccommodation(params);
    }

    @Override
    public int deleteAccommodation(int accommodationNo) {
        return adminMapper.deleteAccommodation(accommodationNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getReportList(int page, int size, String status, String targetType) {
        int offset = (page - 1) * size;
        return adminMapper.selectAdminReportList(offset, size, status, targetType);
    }

    @Override
    @Transactional(readOnly = true)
    public int getReportCount(String status, String targetType) {
        return adminMapper.selectAdminReportCount(status, targetType);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReportDetail(int reportNo) {
        return adminMapper.selectAdminReportDetail(reportNo);
    }

    @Override
    public int updateReportStatus(int reportNo, String status, String result) {
        return adminMapper.updateReportStatus(reportNo, status, result);
    }

    @Override
    @Transactional(readOnly = true)
    public int getPendingReportCount() {
        return adminMapper.selectPendingReportCount();
    }

    // 회원 인증 관리
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getVerificationList(int page, int size, String status) {
        int offset = (page - 1) * size;
        List<edu.kh.project.member.dto.MemberVerificationDTO> list =
                verificationMapper.selectVerificationList(offset, size, status);

        return list.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("verificationNo", v.getVerificationNo());
            map.put("memberNo", v.getMemberNo());
            map.put("memberNickname", v.getMemberNickname());
            map.put("memberEmail", v.getMemberEmail());
            map.put("memberProfileImg", v.getMemberProfileImg());
            map.put("verificationFile", v.getVerificationFile());
            map.put("originalName", v.getOriginalName());
            map.put("status", v.getStatus());
            map.put("adminComment", v.getAdminComment());
            map.put("submittedAt", v.getSubmittedAt());
            map.put("processedAt", v.getProcessedAt());
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public int getVerificationCount(String status) {
        return verificationMapper.selectVerificationCount(status);
    }

    @Override
    @Transactional
    public int approveVerification(int verificationNo, int adminMemberNo) {
        // 인증 요청에서 memberNo 가져오기 위해 상태 업데이트 후 회원 상태도 업데이트
        int result = verificationMapper.updateVerificationStatus(verificationNo, "Y", null, adminMemberNo);

        if (result > 0) {
            // verificationNo로 memberNo를 찾기: 목록에서 찾아서 처리
            // 간단하게 admin-mapper에서 직접 조회
            int memberNo = adminMapper.selectMemberNoByVerificationNo(verificationNo);
            verificationMapper.updateMemberVerifiedReviewer(memberNo, "Y");
        }

        return result;
    }

    @Override
    public int rejectVerification(int verificationNo, String adminComment, int adminMemberNo) {
        return verificationMapper.updateVerificationStatus(verificationNo, "R", adminComment, adminMemberNo);
    }

    // 숙소 후기 관리
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAccommodationReviewList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return adminMapper.selectAdminAccommodationReviewList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getAccommodationReviewCount(String search) {
        return adminMapper.selectAccommodationReviewCount(search);
    }

    @Override
    public int deleteAccommodationReview(int reviewNo) {
        return adminMapper.deleteAccommodationReview(reviewNo);
    }

    @Override
    public int approveAccommodationReview(int reviewNo) {
        int memberNo = adminMapper.selectMemberNoByReviewNo(reviewNo);
        int accommodationNo = adminMapper.selectAccommodationNoByReviewNo(reviewNo);
        verificationMapper.updateMemberVerifiedReviewer(memberNo, "Y");

        notificationService.createNotification(NotificationDTO.builder()
                .recipientNo(memberNo)
                .notificationType("ACCOM_REVIEW_APPROVED")
                .targetType("ACCOMMODATION")
                .targetNo(accommodationNo)
                .title("인증 뱃지 부여")
                .content("인증서류가 승인되어 인증 리뷰어 뱃지가 부여되었습니다.")
                .build());
        return 1;
    }

    @Override
    public int rejectAccommodationReview(int reviewNo) {
        int memberNo = adminMapper.selectMemberNoByReviewNo(reviewNo);
        int accommodationNo = adminMapper.selectAccommodationNoByReviewNo(reviewNo);

        notificationService.createNotification(NotificationDTO.builder()
                .recipientNo(memberNo)
                .notificationType("ACCOM_REVIEW_REJECTED")
                .targetType("ACCOMMODATION")
                .targetNo(accommodationNo)
                .title("인증서류 반려")
                .content("인증서류가 반려되었습니다. 다시 제출해주세요.")
                .build());
        return 1;
    }

    @Override
    public int insertAccommodationWithImages(Map<String, Object> params, MultipartFile thumbnail,
                                              List<MultipartFile> images, String webPath, String folderPath) {
        // 썸네일 파일 업로드
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String savedUrl = saveFile(thumbnail, webPath, folderPath);
            if (savedUrl != null) {
                params.put("thumbnailUrl", savedUrl);
            }
        }

        // 숙소 INSERT (selectKey로 accommodationNo 반환)
        int result = adminMapper.insertAccommodation(params);

        if (result > 0) {
            Long accommodationNo = (Long) params.get("accommodationNo");
            // 갤러리 이미지 저장
            saveAccommodationImages(accommodationNo, images, webPath, folderPath);
        }

        return result;
    }

    @Override
    public int updateAccommodationWithImages(Map<String, Object> params, MultipartFile thumbnail,
                                              List<MultipartFile> images, boolean keepExistingImages,
                                              String webPath, String folderPath) {
        // 썸네일 파일 업로드
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String savedUrl = saveFile(thumbnail, webPath, folderPath);
            if (savedUrl != null) {
                params.put("thumbnailUrl", savedUrl);
            }
        }

        // 숙소 UPDATE
        int result = adminMapper.updateAccommodation(params);

        int accommodationNo = (int) params.get("accommodationNo");

        // 기존 이미지 교체 시 삭제
        if (!keepExistingImages) {
            accommodationMapper.deleteAccommodationImages(accommodationNo);
        }

        // 새 갤러리 이미지 저장
        saveAccommodationImages(accommodationNo, images, webPath, folderPath);

        return result;
    }

    private String saveFile(MultipartFile file, String webPath, String folderPath) {
        try {
            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String savedName = UUID.randomUUID().toString() + ext;

            File dir = new File(folderPath);
            if (!dir.exists()) dir.mkdirs();

            file.transferTo(new File(folderPath + savedName));
            return webPath + savedName;
        } catch (IOException e) {
            log.error("파일 저장 실패", e);
            return null;
        }
    }

    private void saveAccommodationImages(long accommodationNo, List<MultipartFile> images,
                                          String webPath, String folderPath) {
        if (images == null || images.isEmpty()) return;

        int order = 1;
        for (MultipartFile img : images) {
            if (img == null || img.isEmpty()) continue;
            String savedUrl = saveFile(img, webPath, folderPath);
            if (savedUrl != null) {
                accommodationMapper.insertAccommodationImage(accommodationNo, savedUrl, order++);
            }
        }
    }
}
