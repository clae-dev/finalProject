package edu.kh.project.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    private String status;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드
    private String categoryName;
    private String categoryCode;
}
