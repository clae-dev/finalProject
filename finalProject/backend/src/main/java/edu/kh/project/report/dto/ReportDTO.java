package edu.kh.project.report.dto;

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
public class ReportDTO {

    private int reportNo;
    private String targetType;
    private int targetNo;
    private int memberNo;
    private String reportType;
    private String detailReason;
    private String status;
    private String result;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드 (관리자 목록용)
    private String reporterNickname;
    private String targetTitle;
    private String targetAuthorNickname;
}
