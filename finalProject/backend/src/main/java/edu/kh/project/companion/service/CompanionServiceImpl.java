package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import edu.kh.project.companion.mapper.CompanionMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 동행 모집 서비스 구현체
 *
 * <p>동행 모집 게시글의 CRUD, 이미지 파일 관리, 참여 관리,
 * 알림 연동을 포함한 비즈니스 로직을 구현한다.</p>
 *
 * <h3>주요 기능</h3>
 * <ul>
 *   <li>게시글 목록/상세 조회 (페이징, 태그 필터)</li>
 *   <li>게시글 작성 (썸네일 + 본문 이미지 업로드)</li>
 *   <li>참여 신청/취소/승인/거절 + 알림 전송</li>
 * </ul>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompanionServiceImpl implements CompanionService {

    /** 동행 MyBatis Mapper */
    private final CompanionMapper companionMapper;

    /** 알림 서비스 (참여 신청/승인 시 알림 전송) */
    private final NotificationService notificationService;

    // ==================== 조회 ====================

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public List<CompanionDTO> getCompanionList(int page, int size, String tag) {
        int offset = (page - 1) * size;
        return companionMapper.selectCompanionList(offset, size, tag);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public int getCompanionCount(String tag) {
        return companionMapper.selectCompanionCount(tag);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public CompanionDTO getCompanionDetail(int companionNo) {
        return companionMapper.selectCompanionDetail(companionNo);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public List<CompanionJoinDTO> getJoinList(int companionNo) {
        return companionMapper.selectJoinList(companionNo);
    }

    // ==================== 게시글 작성/삭제 ====================

    /**
     * {@inheritDoc}
     *
     * <p>이미지 파일을 UUID 기반으로 리네임하여 서버에 저장하고,
     * 웹 경로를 DTO에 설정한 후 DB에 삽입한다.</p>
     */
    @Override
    public int createCompanion(CompanionDTO companion, MultipartFile thumbnail,
                               List<MultipartFile> contentImages,
                               String webPath, String folderPath) {

        // 업로드 폴더 생성
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        try {
            // 썸네일 이미지 저장
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

    /**
     * 파일명에서 확장자를 추출한다.
     *
     * @param fileName 원본 파일명
     * @return 확장자 문자열 (예: ".jpg"), 없으면 빈 문자열
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    /** {@inheritDoc} */
    @Override
    public int deleteCompanion(int companionNo, int memberNo) {
        return companionMapper.deleteCompanion(companionNo, memberNo);
    }

    // ==================== 참여 관리 ====================

    /**
     * {@inheritDoc}
     *
     * <p>중복 신청을 확인한 후 참여를 등록하고,
     * 게시글 작성자에게 COMPANION_JOIN 알림을 전송한다.</p>
     */
    @Override
    public int joinCompanion(int companionNo, int memberNo) {
        // 중복 신청 체크
        int exists = companionMapper.selectJoinCheck(companionNo, memberNo);
        if (exists > 0) {
            return -1;
        }
        int result = companionMapper.insertJoin(companionNo, memberNo);

        // 게시글 작성자에게 참여 신청 알림 전송
        if (result > 0) {
            try {
                CompanionDTO companion = companionMapper.selectCompanionDetail(companionNo);
                if (companion != null && companion.getMemberNo() != memberNo) {
                    NotificationDTO notification = NotificationDTO.builder()
                            .recipientNo(companion.getMemberNo())
                            .senderNo(memberNo)
                            .notificationType("COMPANION_JOIN")
                            .targetType("COMPANION")
                            .targetNo(companionNo)
                            .title("동행 참여 신청")
                            .content("'" + companion.getTitle() + "' 게시글에 새로운 참여 신청이 있습니다.")
                            .build();
                    notificationService.createNotification(notification);
                }
            } catch (Exception e) {
                log.warn("동행 참여 알림 전송 실패", e);
            }
        }

        return result;
    }

    /** {@inheritDoc} */
    @Override
    public int cancelJoin(int companionNo, int memberNo) {
        return companionMapper.deleteJoin(companionNo, memberNo);
    }

    /**
     * {@inheritDoc}
     *
     * <p>승인("A") 시 신청자에게 COMPANION_ACCEPTED 알림을 전송한다.</p>
     */
    @Override
    public int updateJoinStatus(int joinNo, String status, int memberNo) {
        int result = companionMapper.updateJoinStatus(joinNo, status, memberNo);

        // 승인 시 신청자에게 알림 전송
        if (result > 0 && "A".equals(status)) {
            try {
                CompanionJoinDTO join = companionMapper.selectJoinByJoinNo(joinNo);
                if (join != null) {
                    CompanionDTO companion = companionMapper.selectCompanionDetail(join.getCompanionNo());
                    if (companion != null) {
                        NotificationDTO notification = NotificationDTO.builder()
                                .recipientNo(join.getMemberNo())
                                .senderNo(memberNo)
                                .notificationType("COMPANION_ACCEPTED")
                                .targetType("COMPANION")
                                .targetNo(join.getCompanionNo())
                                .title("동행 신청 승인")
                                .content("'" + companion.getTitle() + "' 동행 신청이 승인되었습니다.")
                                .build();
                        notificationService.createNotification(notification);
                    }
                }
            } catch (Exception e) {
                log.warn("동행 승인 알림 전송 실패", e);
            }
        }

        return result;
    }
}
