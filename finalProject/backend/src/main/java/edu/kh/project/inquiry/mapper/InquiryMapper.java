package edu.kh.project.inquiry.mapper;

import edu.kh.project.inquiry.dto.InquiryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InquiryMapper {

    int insertInquiry(InquiryDTO inquiry);

    List<InquiryDTO> selectMyInquiryList(
        @Param("memberNo") int memberNo,
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    int selectMyInquiryCount(@Param("memberNo") int memberNo);

    InquiryDTO selectInquiryDetail(@Param("inquiryNo") int inquiryNo);

    List<InquiryDTO> selectAdminInquiryList(
        @Param("offset") int offset,
        @Param("limit") int limit,
        @Param("status") String status
    );

    int selectAdminInquiryCount(@Param("status") String status);

    int updateAnswer(
        @Param("inquiryNo") int inquiryNo,
        @Param("answer") String answer
    );

    int softDeleteInquiry(@Param("inquiryNo") int inquiryNo);
}
