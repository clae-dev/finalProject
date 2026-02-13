package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CompanionReviewService {

    List<CompanionReviewDTO> getReviewList(int page, int size);

    int getReviewCount();

    CompanionReviewDTO getReviewDetail(int reviewNo);

    int createReview(CompanionReviewDTO review, MultipartFile thumbnail,
                     List<MultipartFile> contentImages,
                     String webPath, String folderPath);

    int deleteReview(int reviewNo, int memberNo);

    List<CompanionReviewDTO> getRecentReviews(int limit);
}
