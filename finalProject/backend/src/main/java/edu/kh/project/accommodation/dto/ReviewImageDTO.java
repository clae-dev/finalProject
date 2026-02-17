package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 숙소 후기 이미지 DTO
 * - REVIEW_IMAGE 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImageDTO {

    private int imageNo;        // 이미지 번호 (PK)
    private int reviewNo;       // 후기 번호 (FK)
    private String imageUrl;    // 이미지 접근 URL
    private String originalName;// 원본 파일명
    private String renamedName; // 저장된 파일명 (UUID)
    private int imageOrder;     // 이미지 순서
}
