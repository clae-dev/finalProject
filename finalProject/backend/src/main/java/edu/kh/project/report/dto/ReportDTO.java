package edu.kh.project.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 신고 DTO
 *
 * <p>REPORT 테이블과 매핑되는 신고 데이터 객체.
 * 신고 대상(유형/번호), 신고 사유, 처리 상태(P:대기/A:완료/R:반려),
 * 관리자 목록용 JOIN 파생 필드를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ReportDTO {

    private int reportNo;
    /** 신고 대상 유형 (BOARD, COMPANION, REVIEW 등) */
    private String targetType;
    private int targetNo;
    private int memberNo;
    /** 신고 유형 (SPAM, ABUSE, INAPPROPRIATE 등) */
    private String reportType;
    private String detailReason;
    /** 상태 (P:대기, A:처리완료, R:반려) */
    private String status;
    private String result;
    private String createdAt;
    private String updatedAt;

    private String reporterNickname;
    private String targetTitle;
    private String targetAuthorNickname;
}
