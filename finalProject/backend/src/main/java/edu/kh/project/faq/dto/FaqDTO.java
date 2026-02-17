package edu.kh.project.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * FAQ(자주 묻는 질문) DTO
 *
 * <p>FAQ 테이블과 매핑되는 데이터 객체.
 * 질문/답변, 조회수, 표시 순서, 카테고리 정보를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FaqDTO {

    /** FAQ 번호 (PK) */
    private int faqNo;
    /** 질문 */
    private String question;
    /** 답변 */
    private String answer;
    /** 조회수 */
    private int viewCount;
    /** 표시 순서 */
    private int displayOrder;
    /** 카테고리 번호 (FK → FAQ_CATEGORY) */
    private int categoryNo;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    /** 작성일 */
    private String createdAt;
    /** 수정일 */
    private String updatedAt;

    // ==================== JOIN 파생 필드 ====================

    /** 카테고리명 */
    private String categoryName;
    /** 카테고리 코드 */
    private String categoryCode;
}
