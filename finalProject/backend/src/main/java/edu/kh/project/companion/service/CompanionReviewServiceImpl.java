package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionReviewDTO;
import edu.kh.project.companion.mapper.CompanionReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompanionReviewServiceImpl implements CompanionReviewService {

    private final CompanionReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CompanionReviewDTO> getReviewList(int page, int size) {
        int offset = (page - 1) * size;
        return reviewMapper.selectReviewList(offset, size);
    }

    @Override
    @Transactional(readOnly = true)
    public int getReviewCount() {
        return reviewMapper.selectReviewCount();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanionReviewDTO getReviewDetail(int reviewNo) {
        return reviewMapper.selectReviewDetail(reviewNo);
    }

    @Override
    public int createReview(CompanionReviewDTO review, MultipartFile thumbnail,
                            List<MultipartFile> contentImages,
                            String webPath, String folderPath) {

        // companionNo가 0이면 null 처리 (FK 위반 방지)
        if (review.getCompanionNo() != null && review.getCompanionNo() == 0) {
            review.setCompanionNo(null);
        }

        // 폴더 생성
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        try {
            // 썸네일 저장
            if (thumbnail != null && !thumbnail.isEmpty()) {
                String rename = UUID.randomUUID().toString()
                        + getFileExtension(thumbnail.getOriginalFilename());
                thumbnail.transferTo(new File(folderPath + rename));
                review.setImageUrl(webPath + rename);
            }

            // 본문 이미지 저장 (최대 5장)
            if (contentImages != null && !contentImages.isEmpty()) {
                List<String> savedPaths = new ArrayList<>();
                for (MultipartFile file : contentImages) {
                    if (file != null && !file.isEmpty()) {
                        String rename = UUID.randomUUID().toString()
                                + getFileExtension(file.getOriginalFilename());
                        file.transferTo(new File(folderPath + rename));
                        savedPaths.add(webPath + rename);
                    }
                }
                if (!savedPaths.isEmpty()) {
                    review.setContentImages(String.join(",", savedPaths));
                }
            }

        } catch (Exception e) {
            log.error("후기 이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.", e);
        }

        return reviewMapper.insertReview(review);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    @Override
    public int deleteReview(int reviewNo, int memberNo) {
        return reviewMapper.deleteReview(reviewNo, memberNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanionReviewDTO> getRecentReviews(int limit) {
        return reviewMapper.selectRecentReviews(limit);
    }
}
