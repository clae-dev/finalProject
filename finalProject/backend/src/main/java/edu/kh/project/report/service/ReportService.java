package edu.kh.project.report.service;

import edu.kh.project.report.dto.ReportDTO;

public interface ReportService {

    /** 신고 접수 */
    int submitReport(ReportDTO report);

    /** 중복 신고 확인 (이미 신고했으면 true) */
    boolean checkReport(String targetType, int targetNo, int memberNo);
}
