package edu.kh.project.accommodation.service;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import edu.kh.project.accommodation.dto.ReviewImageDTO;
import edu.kh.project.accommodation.mapper.AccommodationReviewMapper;
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
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AccommodationReviewServiceImpl implements AccommodationReviewService {

    private final AccommodationReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReviewList(int accommodationNo, int page, int size) {
        int offset = (page - 1) * size;
        List<AccommodationReviewDTO> list = reviewMapper.selectReviewList(accommodationNo, offset, size);

        // 각 후기에 이미지 목록 추가
        for (AccommodationReviewDTO review : list) {
            review.setImages(reviewMapper.selectReviewImages(review.getReviewNo()));
        }

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
                            String webPath, String folderPath) {
        // 인증 리뷰어 확인
        String verified = reviewMapper.selectMemberVerifiedReviewer(dto.getMemberNo());
        if (!"Y".equals(verified)) {
            throw new SecurityException("인증된 리뷰어만 후기를 작성할 수 있습니다.");
        }

        // 후기 등록
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

        return result;
    }

    @Override
    public int deleteReview(int reviewNo, int memberNo) {
        return reviewMapper.deleteReview(reviewNo, memberNo);
    }
}
