package edu.kh.project.accommodation.service;

import edu.kh.project.accommodation.dto.AccommodationReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface AccommodationReviewService {

    Map<String, Object> getReviewList(int accommodationNo, int page, int size);

    Map<String, Object> getReviewSummary(int accommodationNo);

    int createReview(AccommodationReviewDTO dto, List<MultipartFile> images,
                     String webPath, String folderPath);

    int deleteReview(int reviewNo, int memberNo);
}
