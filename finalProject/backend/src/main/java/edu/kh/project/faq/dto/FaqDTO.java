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

    private int faqNo;
    private String question;
    private String answer;
    private int viewCount;
    private int displayOrder;
    private int categoryNo;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    private String createdAt;
    private String updatedAt;

    private String categoryName;
    private String categoryCode;
}
