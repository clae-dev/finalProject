package edu.kh.project.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * FAQ(자주 묻는 질문) DTO
 * - FAQ 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FaqDTO {

    private int faqNo;            // FAQ 번호 (PK)
    private String question;      // 질문
    private String answer;        // 답변
    private int viewCount;        // 조회수
    private int displayOrder;     // 표시 순서
    private int categoryNo;       // 카테고리 번호 (FK)
    private String status;        // 상태 (A:활성, D:삭제)
    private String createdAt;     // 작성일
    private String updatedAt;     // 수정일

    // JOIN 파생 필드 (카테고리 정보)
    private String categoryName;  // 카테고리명
    private String categoryCode;  // 카테고리 코드
}
