package edu.kh.project.report.service;

import edu.kh.project.report.dto.ReportDTO;

/**
 * 신고 서비스 인터페이스
 *
 * <p>신고 접수, 중복 신고 확인 등 신고 관련 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 */
public interface ReportService {

    /** 신고 접수 */
    int submitReport(ReportDTO report);

    /** 중복 신고 확인 (이미 신고했으면 true) */
    boolean checkReport(String targetType, int targetNo, int memberNo);
}
