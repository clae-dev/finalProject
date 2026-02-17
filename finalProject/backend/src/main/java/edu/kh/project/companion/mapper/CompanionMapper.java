package edu.kh.project.companion.mapper;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CompanionMapper {

    List<CompanionDTO> selectCompanionList(
        @Param("offset") int offset,
        @Param("limit") int limit,
        @Param("tag") String tag
    );

    int selectCompanionCount(@Param("tag") String tag);

    CompanionDTO selectCompanionDetail(@Param("companionNo") int companionNo);

    List<CompanionJoinDTO> selectJoinList(@Param("companionNo") int companionNo);

    int insertCompanion(CompanionDTO companion);

    int deleteCompanion(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    int insertJoin(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    int deleteJoin(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    int updateJoinStatus(
        @Param("joinNo") int joinNo,
        @Param("status") String status,
        @Param("memberNo") int memberNo
    );

    int selectJoinCheck(
        @Param("companionNo") int companionNo,
        @Param("memberNo") int memberNo
    );

    /** 참여 신청 단건 조회 (알림용) */
    CompanionJoinDTO selectJoinByJoinNo(@Param("joinNo") int joinNo);
}
