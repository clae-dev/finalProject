package edu.kh.project.spot.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.spot.dto.SpotDTO;

/**
 * 명소 서비스 인터페이스
 *
 * <p>명소 CRUD, 이미지 업로드, 상태 관리 등 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 * @see SpotServiceImpl
 */
public interface SpotService {

    // 활성화된 명소 목록 조회 (메인페이지용)
    List<SpotDTO> getActiveSpots();

    // 전체 명소 목록 조회 (관리자용)
    List<SpotDTO> getAllSpots();

    // 명소 상세 조회
    SpotDTO getSpotByNo(int spotNo);

    // 명소 등록
    int createSpot(SpotDTO spot);

    // 명소 등록 (이미지 파일 업로드 지원)
    int createSpotWithImage(SpotDTO spot, MultipartFile imageFile, String imageUrl, String webPath, String folderPath);

    // 명소 수정
    int updateSpot(SpotDTO spot);

    // 명소 수정 (이미지 파일 업로드 지원)
    int updateSpotWithImage(SpotDTO spot, MultipartFile imageFile, String imageUrl, String webPath, String folderPath);

    // 명소 삭제
    int deleteSpot(int spotNo);

    // 명소 상태 변경
    int updateSpotStatus(int spotNo, String status);
}
