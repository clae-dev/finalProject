package edu.kh.project.companion.mapper;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 동행 모집 MyBatis Mapper
 *
 * <p>COMPANION_BOARD, COMPANION_JOIN 테이블에 대한 SQL 매핑 인터페이스.
 * 동행 게시글 CRUD 및 참여 신청 관리 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface CompanionMapper {

    /** 동행 목록 조회 (페이징 + 태그 필터) */
    List<CompanionDTO> selectCompanionList(
        @Param("offset") int offset,
        @Param("limit") int limit,
        @Param("tag") String tag
    );

    /** 동행 총 수 */
    int selectCompanionCount(@Param("tag") String tag);

    /** 동행 상세 조회 */
    CompanionDTO selectCompanionDetail(@Param("companionNo") int companionNo);

    /** 동행 참가 신청 목록 조회 */
    List<CompanionJoinDTO> selectJoinList(@Param("companionNo") int companionNo);

    /** 동행 게시글 등록 */
    int insertCompanion(CompanionDTO companion);

    /** 동행 게시글 수정 (작성자만) */
    int updateCompanion(CompanionDTO companion);

    /** 동행 게시글 삭제 (작성자) */
    int deleteCompanion(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    /** 동행 참가 신청 */
    int insertJoin(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    /** 동행 참가 신청 취소 */
    int deleteJoin(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    /** 참가 신청 상태 변경 (수락/거절) */
    int updateJoinStatus(
        @Param("joinNo") int joinNo,
        @Param("status") String status,
        @Param("memberNo") int memberNo
    );

    /** 참가 신청 여부 확인 */
    int selectJoinCheck(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    /** 참여 신청 단건 조회 (알림용) */
    CompanionJoinDTO selectJoinByJoinNo(@Param("joinNo") int joinNo);

    /** 현재 인원 +1 (참여 신청 시) */
    int incrementCurrentMembers(@Param("companionNo") int companionNo);

    /** 현재 인원 -1 (취소/거절 시, 0 미만으로는 떨어지지 않음) */
    int decrementCurrentMembers(@Param("companionNo") int companionNo);
}
