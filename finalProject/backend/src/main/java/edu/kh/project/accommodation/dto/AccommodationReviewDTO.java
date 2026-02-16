package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationReviewDTO {

    private int reviewNo;
    private int accommodationNo;
    private int memberNo;
    private double rating;
    private String content;
    private String checkInDate;
    private String checkOutDate;
    private String recommendedFor;
    private String status;
    private String createdAt;
    private String updatedAt;

    // JOIN 결과
    private String authorNickname;
    private String authorProfileImg;
    private String verifiedReviewer;

    // 이미지 목록
    private List<ReviewImageDTO> images;
}
