package edu.kh.project.companion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionReviewDTO {

    private int reviewNo;
    private Integer companionNo;
    private int memberNo;
    private String title;
    private String content;
    private int rating;
    private String imageUrl;
    private String contentImages;
    private String status;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드
    private String authorNickname;
    private String authorProfile;
    private String companionTitle;
}
