package edu.kh.project.member.mapper;

import edu.kh.project.member.dto.MemberVerificationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 회원 인증 서류 MyBatis Mapper
 *
 * <p>MEMBER_VERIFICATION 테이블에 대한 SQL 매핑 인터페이스.
 * 인증 서류 제출, 관리자 승인/거부, 인증뱃지 상태 변경 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface MemberVerificationMapper {

    /** 인증 서류 제출 */
    int insertVerification(MemberVerificationDTO dto);

    /** 최근 인증 신청 조회 (회원별) */
    MemberVerificationDTO selectLatestByMemberNo(@Param("memberNo") int memberNo);

    /** 인증 신청 목록 (관리자용, 상태 필터) */
    List<MemberVerificationDTO> selectVerificationList(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("status") String status);

    /** 인증 신청 총 수 */
    int selectVerificationCount(@Param("status") String status);

    /** 인증 상태 변경 (승인/거부) */
    int updateVerificationStatus(
            @Param("verificationNo") int verificationNo,
            @Param("status") String status,
            @Param("adminComment") String adminComment,
            @Param("processedBy") int processedBy);

    /** 회원 인증뱃지 상태 변경 */
    int updateMemberVerifiedReviewer(
            @Param("memberNo") int memberNo,
            @Param("verifiedReviewer") String verifiedReviewer);
}
