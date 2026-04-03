package edu.kh.project.accommodation.service;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import edu.kh.project.accommodation.dto.ReviewImageDTO;
import edu.kh.project.accommodation.mapper.AccommodationReviewMapper;
import edu.kh.project.member.dto.MemberVerificationDTO;
import edu.kh.project.member.mapper.MemberVerificationMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 숙소 후기 서비스 구현체
 *
 * <p>인증 리뷰어 검증, 후기 작성(이미지 업로드 포함),
 * 목록 조회, 요약 통계, 삭제 등의 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AccommodationReviewServiceImpl implements AccommodationReviewService {

    private final AccommodationReviewMapper reviewMapper;
    private final MemberVerificationMapper verificationMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReviewList(int accommodationNo, int page, int size) {
        int offset = (page - 1) * size;
        List<AccommodationReviewDTO> list = reviewMapper.selectReviewListWithImages(accommodationNo, offset, size);

        int totalCount = reviewMapper.selectReviewCount(accommodationNo);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("totalCount", totalCount);
        result.put("currentPage", page);
        result.put("pageSize", size);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReviewSummary(int accommodationNo) {
        return reviewMapper.selectReviewSummary(accommodationNo);
    }

    @Override
    public int createReview(AccommodationReviewDTO dto, List<MultipartFile> images,
                            MultipartFile verificationFile,
                            String webPath, String folderPath,
                            String verificationWebPath, String verificationFolderPath) {

        // 후기 등록 (STATUS = 'A' 즉시 공개)
        int result = reviewMapper.insertReview(dto);

        if (result > 0 && images != null && !images.isEmpty()) {
            // 이미지 저장
            File dir = new File(folderPath);
            if (!dir.exists()) dir.mkdirs();

            int order = 1;
            for (MultipartFile img : images) {
                if (img == null || img.isEmpty()) continue;
                if (order > 5) break;

                try {
                    String originalName = img.getOriginalFilename();
                    String ext = (originalName != null && originalName.contains("."))
                            ? originalName.substring(originalName.lastIndexOf("."))
                            : ".png";
                    String renamedName = UUID.randomUUID().toString() + ext;

                    img.transferTo(new File(folderPath + renamedName));

                    ReviewImageDTO imageDTO = ReviewImageDTO.builder()
                            .reviewNo(dto.getReviewNo())
                            .imageUrl(webPath + renamedName)
                            .originalName(originalName)
                            .renamedName(renamedName)
                            .imageOrder(order++)
                            .build();

                    reviewMapper.insertReviewImage(imageDTO);
                } catch (Exception e) {
                    log.error("후기 이미지 저장 실패", e);
                }
            }
        }

        // 인증서류 파일 저장
        if (result > 0 && verificationFile != null && !verificationFile.isEmpty()) {
            try {
                File vDir = new File(verificationFolderPath);
                if (!vDir.exists()) vDir.mkdirs();

                String originalName = verificationFile.getOriginalFilename();
                String ext = (originalName != null && originalName.contains("."))
                        ? originalName.substring(originalName.lastIndexOf("."))
                        : ".png";
                String renamedName = UUID.randomUUID().toString() + ext;

                verificationFile.transferTo(new File(verificationFolderPath + renamedName));

                MemberVerificationDTO vDto = MemberVerificationDTO.builder()
                        .memberNo(dto.getMemberNo())
                        .verificationFile(verificationWebPath + renamedName)
                        .originalName(originalName)
                        .renamedName(renamedName)
                        .build();

                verificationMapper.insertVerification(vDto);

                // 인증서류가 있을 때만 관리자에게 알림 발송
                notificationService.notifyAllAdmins(NotificationDTO.builder()
                        .senderNo(dto.getMemberNo())
                        .notificationType("ACCOM_REVIEW_SUBMITTED")
                        .targetType("ADMIN_ACCOM_REVIEW")
                        .targetNo(dto.getReviewNo())
                        .title("숙소 후기 인증 요청")
                        .content("인증서류가 접수되었습니다.")
                        .build());
            } catch (Exception e) {
                log.error("인증서류 저장 실패", e);
            }
        }

        return result;
    }

    @Override
    public int deleteReview(int reviewNo, int memberNo) {
        return reviewMapper.deleteReview(reviewNo, memberNo);
    }
}
