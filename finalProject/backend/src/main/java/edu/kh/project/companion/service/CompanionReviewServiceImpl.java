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

/**
 * 동행 후기 서비스 구현체
 *
 * <p>동행 후기의 CRUD 및 이미지 파일 관리 비즈니스 로직을 구현한다.
 * companionNo가 null인 경우 독립 후기로 작성된다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompanionReviewServiceImpl implements CompanionReviewService {

    /** 후기 MyBatis Mapper */
    private final CompanionReviewMapper reviewMapper;

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public List<CompanionReviewDTO> getReviewList(int page, int size, String search, String sort) {
        int offset = (page - 1) * size;
        return reviewMapper.selectReviewList(offset, size, search, sort);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public int getReviewCount(String search) {
        return reviewMapper.selectReviewCount(search);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public CompanionReviewDTO getReviewDetail(int reviewNo) {
        return reviewMapper.selectReviewDetail(reviewNo);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public List<CompanionReviewDTO> getRecentReviews(int limit) {
        return reviewMapper.selectRecentReviews(limit);
    }

    /**
     * {@inheritDoc}
     *
     * <p>companionNo가 0이면 null로 변환하여 FK 위반을 방지한다.
     * 이미지 파일은 UUID 기반으로 리네임하여 서버에 저장한다.</p>
     */
    @Override
    public int createReview(CompanionReviewDTO review, MultipartFile thumbnail,
                            List<MultipartFile> contentImages,
                            String webPath, String folderPath) {

        // companionNo가 0이면 null 처리 (FK 위반 방지)
        if (review.getCompanionNo() != null && review.getCompanionNo() == 0) {
            review.setCompanionNo(null);
        }

        // 업로드 폴더 생성
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        try {
            // 썸네일 이미지 저장
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

    /**
     * 파일명에서 확장자를 추출한다.
     *
     * @param fileName 원본 파일명
     * @return 확장자 문자열 (예: ".jpg"), 없으면 빈 문자열
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    /** {@inheritDoc} */
    @Override
    public int deleteReview(int reviewNo, int memberNo) {
        return reviewMapper.deleteReview(reviewNo, memberNo);
    }
}
