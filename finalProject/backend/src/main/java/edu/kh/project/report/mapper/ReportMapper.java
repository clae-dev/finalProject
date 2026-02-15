package edu.kh.project.report.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.report.dto.ReportDTO;

@Mapper
public interface ReportMapper {

    /** 신고 접수 */
    int insertReport(ReportDTO report);

    /** 중복 신고 확인 */
    int selectReportCheck(@Param("targetType") String targetType,
                          @Param("targetNo") int targetNo,
                          @Param("memberNo") int memberNo);
}
