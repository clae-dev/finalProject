package edu.kh.project.report.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.admin.mapper.AdminMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import edu.kh.project.report.dto.ReportDTO;
import edu.kh.project.report.mapper.ReportMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 신고 서비스 구현체
 *
 * <p>사용자 신고 접수, 중복 신고 확인 등
 * 신고 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final ReportMapper reportMapper;
    private final NotificationService notificationService;
    private final AdminMapper adminMapper;

    @Override
    public int submitReport(ReportDTO report) {
        int result = reportMapper.insertReport(report);

        if (result > 0) {
            for (int adminNo : adminMapper.selectAdminMemberNos()) {
                notificationService.createNotification(NotificationDTO.builder()
                        .recipientNo(adminNo)
                        .senderNo(report.getMemberNo())
                        .notificationType("REPORT_SUBMITTED")
                        .targetType("ADMIN_REPORT")
                        .targetNo(0)
                        .title("신고 접수")
                        .content("새 신고가 접수되었습니다.")
                        .build());
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkReport(String targetType, int targetNo, int memberNo) {
        return reportMapper.selectReportCheck(targetType, targetNo, memberNo) > 0;
    }
}
