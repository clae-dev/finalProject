package edu.kh.project.report.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.report.dto.ReportDTO;
import edu.kh.project.report.mapper.ReportMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final ReportMapper reportMapper;

    @Override
    public int submitReport(ReportDTO report) {
        return reportMapper.insertReport(report);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkReport(String targetType, int targetNo, int memberNo) {
        return reportMapper.selectReportCheck(targetType, targetNo, memberNo) > 0;
    }
}
