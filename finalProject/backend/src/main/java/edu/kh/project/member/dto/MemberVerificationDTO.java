package edu.kh.project.member.dto;

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
public class MemberVerificationDTO {

    private int verificationNo;
    private int memberNo;
    private String verificationFile;
    private String originalName;
    private String renamedName;
    private String status;           // W:대기, Y:승인, R:거부
    private String adminComment;
    private String submittedAt;
    private String processedAt;
    private int processedBy;

    // JOIN 결과
    private String memberNickname;
    private String memberEmail;
    private String memberProfileImg;
}
