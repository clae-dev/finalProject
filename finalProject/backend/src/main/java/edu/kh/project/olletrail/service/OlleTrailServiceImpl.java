package edu.kh.project.olletrail.service;

import edu.kh.project.olletrail.dto.OlleTrailOverrideDTO;
import edu.kh.project.olletrail.mapper.OlleTrailMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OlleTrailServiceImpl implements OlleTrailService {

    private final OlleTrailMapper olleTrailMapper;

    @Override
    public List<OlleTrailOverrideDTO> getAllOverrides() {
        return olleTrailMapper.selectAllOverrides();
    }

    @Override
    public int saveOverride(OlleTrailOverrideDTO dto) {
        int result = olleTrailMapper.upsertOverride(dto);
        log.info("올레길 override 저장: trailId={}, updatedBy={}", dto.getTrailId(), dto.getUpdatedBy());
        return result;
    }

    @Override
    public int deleteOverride(int trailId) {
        int result = olleTrailMapper.deleteOverride(trailId);
        log.info("올레길 override 삭제: trailId={}", trailId);
        return result;
    }
}
