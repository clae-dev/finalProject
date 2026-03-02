package edu.kh.project.olletrail.service;

import edu.kh.project.olletrail.dto.OlleTrailOverrideDTO;

import java.util.List;

public interface OlleTrailService {

    /** 모든 override 목록 조회 */
    List<OlleTrailOverrideDTO> getAllOverrides();

    /** 특정 코스 override 저장 */
    int saveOverride(OlleTrailOverrideDTO dto);

    /** 특정 코스 override 삭제 */
    int deleteOverride(int trailId);
}
