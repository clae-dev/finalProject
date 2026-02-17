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

    /** 신고 번호 (PK) */
    private int reportNo;
    /** 신고 대상 유형 (BOARD, COMPANION, REVIEW 등) */
    private String targetType;
    /** 신고 대상 번호 */
    private int targetNo;
    /** 신고자 번호 (FK → MEMBER) */
    private int memberNo;
    /** 신고 유형 (SPAM, ABUSE, INAPPROPRIATE 등) */
    private String reportType;
    /** 상세 사유 */
    private String detailReason;
    /** 상태 (P:대기, A:처리완료, R:반려) */
    private String status;
    /** 처리 결과 */
    private String result;
    /** 신고일 */
    private String createdAt;
    /** 처리일 */
    private String updatedAt;

    // ==================== JOIN 파생 필드 ====================

    /** 신고자 닉네임 */
    private String reporterNickname;
    /** 신고 대상 제목 */
    private String targetTitle;
    /** 신고 대상 작성자 닉네임 */
    private String targetAuthorNickname;
}
