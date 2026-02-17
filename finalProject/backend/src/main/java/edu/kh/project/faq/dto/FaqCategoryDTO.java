package edu.kh.project.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * FAQ 카테고리 DTO
 * - FAQ_CATEGORY 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FaqCategoryDTO {

    private int categoryNo;       // 카테고리 번호 (PK)
    private String categoryCode;  // 카테고리 코드 (GENERAL, RESERVATION 등)
    private String categoryName;  // 카테고리명 (일반, 예약 등)
}
