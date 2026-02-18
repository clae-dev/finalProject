package edu.kh.project.inquiry.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class InquiryDTO {
    private int inquiryNo;
    private int memberNo;
    private String category;       // MEMBER, ACCOM, COMMUNITY, ETC
    private String title;
    private String content;
    private String answer;
    private String status;         // W:대기, A:답변완료, D:삭제
    private String createdAt;
    private String answeredAt;

    // JOIN 파생 필드
    private String memberNickname;
    private String memberEmail;
}
