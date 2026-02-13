package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import edu.kh.project.companion.mapper.CompanionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    public int createCompanion(CompanionDTO companion, MultipartFile thumbnail,
                               List<MultipartFile> contentImages,
                               String webPath, String folderPath) {

        // 폴더 생성
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        try {
            // 썸네일 저장
            if (thumbnail != null && !thumbnail.isEmpty()) {
                String rename = UUID.randomUUID().toString()
                        + getFileExtension(thumbnail.getOriginalFilename());
                thumbnail.transferTo(new File(folderPath + rename));
                companion.setImageUrl(webPath + rename);
            }

            // 본문 이미지 저장 (최대 5장)
            if (contentImages != null && !contentImages.isEmpty()) {
                List<String> savedPaths = new ArrayList<>();
                for (MultipartFile file : contentImages) {
                    if (file != null && !file.isEmpty()) {
                        String rename = UUID.randomUUID().toString()
                                + getFileExtension(file.getOriginalFilename());
                        file.transferTo(new File(folderPath + rename));
                        savedPaths.add(webPath + rename);
                    }
                }
                if (!savedPaths.isEmpty()) {
                    companion.setContentImages(String.join(",", savedPaths));
                }
            }

        } catch (Exception e) {
            log.error("동행 이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.", e);
        }

        return companionMapper.insertCompanion(companion);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
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
