package edu.kh.project.companion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CompanionJoinDTO {

    private int joinNo;
    private int companionNo;
    private int memberNo;
    private String status;
    private String createdAt;

    // JOIN 파생 필드
    private String memberNickname;
    private String memberProfile;
}
