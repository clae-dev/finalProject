package edu.kh.project.inquiry.service;

import edu.kh.project.inquiry.dto.InquiryDTO;

import java.util.List;

public interface InquiryService {

    int createInquiry(InquiryDTO inquiry);

    List<InquiryDTO> getMyInquiryList(int memberNo, int page, int size);

    int getMyInquiryCount(int memberNo);

    InquiryDTO getInquiryDetail(int inquiryNo);

    List<InquiryDTO> getAdminInquiryList(int page, int size, String status);

    int getAdminInquiryCount(String status);

    int answerInquiry(int inquiryNo, String answer);

    int deleteInquiry(int inquiryNo);
}
