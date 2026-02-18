package edu.kh.project.inquiry.service;

import edu.kh.project.inquiry.dto.InquiryDTO;
import edu.kh.project.inquiry.mapper.InquiryMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class InquiryServiceImpl implements InquiryService {

    private final InquiryMapper inquiryMapper;
    private final NotificationService notificationService;

    @Override
    public int createInquiry(InquiryDTO inquiry) {
        return inquiryMapper.insertInquiry(inquiry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryDTO> getMyInquiryList(int memberNo, int page, int size) {
        int offset = (page - 1) * size;
        return inquiryMapper.selectMyInquiryList(memberNo, offset, size);
    }

    @Override
    @Transactional(readOnly = true)
    public int getMyInquiryCount(int memberNo) {
        return inquiryMapper.selectMyInquiryCount(memberNo);
    }

    @Override
    @Transactional(readOnly = true)
    public InquiryDTO getInquiryDetail(int inquiryNo) {
        return inquiryMapper.selectInquiryDetail(inquiryNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryDTO> getAdminInquiryList(int page, int size, String status) {
        int offset = (page - 1) * size;
        return inquiryMapper.selectAdminInquiryList(offset, size, status);
    }

    @Override
    @Transactional(readOnly = true)
    public int getAdminInquiryCount(String status) {
        return inquiryMapper.selectAdminInquiryCount(status);
    }

    @Override
    public int answerInquiry(int inquiryNo, String answer) {
        int result = inquiryMapper.updateAnswer(inquiryNo, answer);

        if (result > 0) {
            try {
                InquiryDTO inquiry = inquiryMapper.selectInquiryDetail(inquiryNo);
                if (inquiry != null) {
                    NotificationDTO notification = NotificationDTO.builder()
                            .recipientNo(inquiry.getMemberNo())
                            .notificationType("INQUIRY_ANSWERED")
                            .targetType("INQUIRY")
                            .targetNo(inquiryNo)
                            .title("문의 답변 완료")
                            .content("'" + inquiry.getTitle() + "' 문의에 답변이 등록되었습니다.")
                            .build();
                    notificationService.createNotification(notification);
                }
            } catch (Exception e) {
                log.warn("문의 답변 알림 전송 실패", e);
            }
        }

        return result;
    }

    @Override
    public int deleteInquiry(int inquiryNo) {
        return inquiryMapper.softDeleteInquiry(inquiryNo);
    }
}
