package edu.kh.project.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 신고 DTO
 * - REPORT 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ReportDTO {

    private int reportNo;                // 신고 번호 (PK)
    private String targetType;           // 신고 대상 유형 (BOARD, COMPANION, REVIEW 등)
    private int targetNo;                // 신고 대상 번호
    private int memberNo;                // 신고자 번호 (FK)
    private String reportType;           // 신고 유형 (SPAM, ABUSE, INAPPROPRIATE 등)
    private String detailReason;         // 상세 사유
    private String status;               // 상태 (P:대기, A:처리완료, R:반려)
    private String result;               // 처리 결과
    private String createdAt;            // 신고일
    private String updatedAt;            // 처리일

    // JOIN 파생 필드 (관리자 목록용)
    private String reporterNickname;     // 신고자 닉네임
    private String targetTitle;          // 신고 대상 제목
    private String targetAuthorNickname; // 신고 대상 작성자 닉네임
}
