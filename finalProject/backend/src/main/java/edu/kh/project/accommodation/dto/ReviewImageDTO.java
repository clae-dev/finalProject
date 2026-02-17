package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 숙소 후기 이미지 DTO
 *
 * <p>REVIEW_IMAGE 테이블과 매핑되는 이미지 데이터 객체.
 * UUID 기반 파일명 변환, 이미지 순서 관리를 지원한다.</p>
 *
 * @author HONDI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImageDTO {

    /** 이미지 번호 (PK) */
    private int imageNo;
    /** 후기 번호 (FK → ACCOMMODATION_REVIEW) */
    private int reviewNo;
    /** 이미지 접근 URL */
    private String imageUrl;
    /** 원본 파일명 */
    private String originalName;
    /** 저장된 파일명 (UUID) */
    private String renamedName;
    /** 이미지 순서 */
    private int imageOrder;
}
