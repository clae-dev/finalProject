package edu.kh.project.olletrail.mapper;

import edu.kh.project.olletrail.dto.OlleTrailOverrideDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OlleTrailMapper {

    /** 저장된 모든 override 조회 */
    List<OlleTrailOverrideDTO> selectAllOverrides();

    /** 특정 코스 override 조회 */
    OlleTrailOverrideDTO selectOverrideById(@Param("trailId") int trailId);

    /** override 저장 (없으면 INSERT, 있으면 UPDATE — MERGE) */
    int upsertOverride(OlleTrailOverrideDTO dto);

    /** 특정 코스 override 삭제 (원본 복원) */
    int deleteOverride(@Param("trailId") int trailId);
}
