package edu.kh.project.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * FAQ 카테고리 DTO
 *
 * <p>FAQ_CATEGORY 테이블과 매핑되는 카테고리 데이터 객체.
 * 카테고리 코드(GENERAL, RESERVATION 등)와 카테고리명을 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FaqCategoryDTO {

    /** 카테고리 번호 (PK) */
    private int categoryNo;
    /** 카테고리 코드 (GENERAL, RESERVATION 등) */
    private String categoryCode;
    /** 카테고리명 (일반, 예약 등) */
    private String categoryName;
}
