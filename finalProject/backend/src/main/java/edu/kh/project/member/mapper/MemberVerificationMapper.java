package edu.kh.project.member.mapper;

import edu.kh.project.member.dto.MemberVerificationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberVerificationMapper {

    int insertVerification(MemberVerificationDTO dto);

    MemberVerificationDTO selectLatestByMemberNo(@Param("memberNo") int memberNo);

    List<MemberVerificationDTO> selectVerificationList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("status") String status);

    int selectVerificationCount(@Param("status") String status);

    int updateVerificationStatus(
            @Param("verificationNo") int verificationNo,
            @Param("status") String status,
            @Param("adminComment") String adminComment,
            @Param("processedBy") int processedBy);

    int updateMemberVerifiedReviewer(
            @Param("memberNo") int memberNo,
            @Param("verifiedReviewer") String verifiedReviewer);
}
