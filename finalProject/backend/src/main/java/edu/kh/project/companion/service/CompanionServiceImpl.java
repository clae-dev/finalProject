package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import edu.kh.project.companion.mapper.CompanionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompanionServiceImpl implements CompanionService {

    private final CompanionMapper companionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CompanionDTO> getCompanionList(int page, int size, String tag) {
        int offset = (page - 1) * size;
        return companionMapper.selectCompanionList(offset, size, tag);
    }

    @Override
    @Transactional(readOnly = true)
    public int getCompanionCount(String tag) {
        return companionMapper.selectCompanionCount(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanionDTO getCompanionDetail(int companionNo) {
        return companionMapper.selectCompanionDetail(companionNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanionJoinDTO> getJoinList(int companionNo) {
        return companionMapper.selectJoinList(companionNo);
    }

    @Override
    public int createCompanion(CompanionDTO companion) {
        return companionMapper.insertCompanion(companion);
    }

    @Override
    public int deleteCompanion(int companionNo, int memberNo) {
        return companionMapper.deleteCompanion(companionNo, memberNo);
    }

    @Override
    public int joinCompanion(int companionNo, int memberNo) {
        // 중복 신청 체크
        int exists = companionMapper.selectJoinCheck(companionNo, memberNo);
        if (exists > 0) {
            return -1;
        }
        return companionMapper.insertJoin(companionNo, memberNo);
    }

    @Override
    public int cancelJoin(int companionNo, int memberNo) {
        return companionMapper.deleteJoin(companionNo, memberNo);
    }

    @Override
    public int updateJoinStatus(int joinNo, String status, int memberNo) {
        return companionMapper.updateJoinStatus(joinNo, status, memberNo);
    }
}
