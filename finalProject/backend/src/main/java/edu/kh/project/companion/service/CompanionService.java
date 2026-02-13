package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;

import java.util.List;

public interface CompanionService {

    List<CompanionDTO> getCompanionList(int page, int size, String tag);

    int getCompanionCount(String tag);

    CompanionDTO getCompanionDetail(int companionNo);

    List<CompanionJoinDTO> getJoinList(int companionNo);

    int createCompanion(CompanionDTO companion);

    int deleteCompanion(int companionNo, int memberNo);

    int joinCompanion(int companionNo, int memberNo);

    int cancelJoin(int companionNo, int memberNo);

    int updateJoinStatus(int joinNo, String status, int memberNo);
}
