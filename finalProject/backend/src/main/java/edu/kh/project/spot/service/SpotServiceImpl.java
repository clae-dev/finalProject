package edu.kh.project.spot.service;

import java.io.File;
import java.util.List;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.spot.dto.SpotDTO;
import edu.kh.project.spot.mapper.SpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 명소 서비스 구현체
 *
 * <p>명소 CRUD, 이미지 파일 업로드(UUID 리네임),
 * 상태 변경 등의 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SpotServiceImpl implements SpotService {

    private final SpotMapper spotMapper;

    /**
     * 활성화된 명소 목록 조회 (메인페이지용)
     */
    @Override
    @Cacheable("activeSpots")
    public List<SpotDTO> getActiveSpots() {
        return spotMapper.selectActiveSpots();
    }

    /**
     * 전체 명소 목록 조회 (관리자용)
     */
    @Override
    public List<SpotDTO> getAllSpots() {
        return spotMapper.selectAllSpots();
    }

    /**
     * 명소 상세 조회
     */
    @Override
    public SpotDTO getSpotByNo(int spotNo) {
        return spotMapper.selectSpotByNo(spotNo);
    }

    /**
     * 명소 등록
     */
    @Override
    @CacheEvict(value = "activeSpots", allEntries = true)
    public int createSpot(SpotDTO spot) {
        int result = spotMapper.insertSpot(spot);

        if (result > 0) {
            log.info("명소 등록 성공: {}", spot.getSpotTitle());
        }

        return result;
    }

    /**
     * 명소 등록 (이미지 파일 업로드 지원)
     */
    @Override
    public int createSpotWithImage(SpotDTO spot, MultipartFile imageFile, String imageUrl, String webPath, String folderPath) {
        // 파일 업로드 우선, 없으면 URL 사용
        if (imageFile != null && !imageFile.isEmpty()) {
            String savedPath = saveFile(imageFile, webPath, folderPath);
            if (savedPath != null) {
                spot.setSpotImage(savedPath);
            }
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            spot.setSpotImage(imageUrl);
        }

        return createSpot(spot);
    }

    /**
     * 명소 수정
     */
    @Override
    @CacheEvict(value = "activeSpots", allEntries = true)
    public int updateSpot(SpotDTO spot) {
        int result = spotMapper.updateSpot(spot);

        if (result > 0) {
            log.info("명소 수정 성공: {}", spot.getSpotTitle());
        }

        return result;
    }

    /**
     * 명소 수정 (이미지 파일 업로드 지원)
     */
    @Override
    public int updateSpotWithImage(SpotDTO spot, MultipartFile imageFile, String imageUrl, String webPath, String folderPath) {
        // 파일 업로드 우선, 없으면 URL 사용, 둘 다 없으면 기존 이미지 유지
        if (imageFile != null && !imageFile.isEmpty()) {
            String savedPath = saveFile(imageFile, webPath, folderPath);
            if (savedPath != null) {
                spot.setSpotImage(savedPath);
            }
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            spot.setSpotImage(imageUrl);
        } else {
            // 이미지 변경 없음 → 기존 이미지 유지를 위해 DB에서 조회
            SpotDTO existing = spotMapper.selectSpotByNo(spot.getSpotNo());
            if (existing != null) {
                spot.setSpotImage(existing.getSpotImage());
            }
        }

        return updateSpot(spot);
    }

    /**
     * 명소 삭제
     */
    @Override
    @CacheEvict(value = "activeSpots", allEntries = true)
    public int deleteSpot(int spotNo) {
        int result = spotMapper.deleteSpot(spotNo);

        if (result > 0) {
            log.info("명소 삭제 성공: spotNo={}", spotNo);
        }

        return result;
    }

    /**
     * 명소 상태 변경
     */
    @Override
    @CacheEvict(value = "activeSpots", allEntries = true)
    public int updateSpotStatus(int spotNo, String status) {
        int result = spotMapper.updateSpotStatus(spotNo, status);

        if (result > 0) {
            log.info("명소 상태 변경: spotNo={}, status={}", spotNo, status);
        }

        return result;
    }

    /**
     * 파일 저장 유틸리티
     *
     * @param file       업로드된 파일
     * @param webPath    웹 접근 경로
     * @param folderPath 서버 저장 경로
     * @return 저장된 파일의 웹 경로 (실패 시 null)
     */
    private String saveFile(MultipartFile file, String webPath, String folderPath) {
        try {
            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String rename = UUID.randomUUID().toString() + ext;

            File dir = new File(folderPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            file.transferTo(new File(folderPath + rename));

            return webPath + rename;
        } catch (Exception e) {
            log.error("파일 저장 실패", e);
            return null;
        }
    }
}
