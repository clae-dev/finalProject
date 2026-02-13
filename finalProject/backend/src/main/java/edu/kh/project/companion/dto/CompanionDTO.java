package edu.kh.project.companion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionDTO {

    private int companionNo;
    private String title;
    private String content;
    private String imageUrl;
    private String travelDate;
    private int maxMembers;
    private String tags;
    private String status;
    private int memberNo;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드
    private String authorNickname;
    private String authorProfile;
    private String authorAgeRange;
    private int currentMembers;
}
