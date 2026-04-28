package edu.kh.project.companion.service;

import edu.kh.project.chatting.service.GroupChatService;
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

    /** 그룹 채팅 서비스 (수락 시 그룹방 자동 생성) */
    private final GroupChatService groupChatService;

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

    /**
     * {@inheritDoc}
     *
     * <p>유지할 기존 이미지 URL과 새로 업로드한 이미지를 합쳐
     * contentImages에 저장한다.</p>
     */
    @Override
    public int updateCompanion(CompanionDTO companion, String keepImages,
                               List<MultipartFile> newImages,
                               String webPath, String folderPath) {

        List<String> allImages = new ArrayList<>();

        // 기존에 유지할 이미지 URL
        if (keepImages != null && !keepImages.isBlank()) {
            for (String url : keepImages.split(",")) {
                if (!url.isBlank()) allImages.add(url.trim());
            }
        }

        // 새로 추가된 이미지 파일 저장
        if (newImages != null && !newImages.isEmpty()) {
            File dir = new File(folderPath);
            if (!dir.exists()) dir.mkdirs();
            try {
                for (MultipartFile file : newImages) {
                    if (file != null && !file.isEmpty()) {
                        String rename = UUID.randomUUID()
                                + getFileExtension(file.getOriginalFilename());
                        file.transferTo(new File(folderPath + rename));
                        allImages.add(webPath + rename);
                    }
                }
            } catch (Exception e) {
                log.error("동행 수정 이미지 저장 실패", e);
                throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.", e);
            }
        }

        companion.setContentImages(allImages.isEmpty() ? null : String.join(",", allImages));
        return companionMapper.updateCompanion(companion);
    }

    /** {@inheritDoc} */
    @Override
    public int deleteCompanion(int companionNo, int memberNo) {
        return companionMapper.deleteCompanion(companionNo, memberNo);
    }

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
            // 현재 인원 카운터 +1 (목록/상세에서 비정규화 컬럼 직접 사용)
            companionMapper.incrementCurrentMembers(companionNo);

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
        int result = companionMapper.deleteJoin(companionNo, memberNo);
        if (result > 0) {
            // 실제 W/A → C 전환이 일어난 경우만 카운터 -1
            companionMapper.decrementCurrentMembers(companionNo);
        }
        return result;
    }

    /**
     * {@inheritDoc}
     *
     * <p>승인("A") 시 신청자에게 COMPANION_ACCEPTED 알림을 전송한다.</p>
     */
    @Override
    public int updateJoinStatus(int joinNo, String status, int memberNo) {
        int result = companionMapper.updateJoinStatus(joinNo, status, memberNo);

        // 승인/거절 시 신청자에게 알림 전송
        if (result > 0 && ("A".equals(status) || "R".equals(status))) {
            try {
                // LEFT JOIN으로 동행 제목/작성자까지 한 번에 조회 (이전 2쿼리 → 1쿼리)
                CompanionJoinDTO join = companionMapper.selectJoinByJoinNo(joinNo);
                if (join != null && join.getCompanionTitle() != null) {
                    String companionTitle = join.getCompanionTitle();
                    Integer companionAuthorNo = join.getCompanionAuthorNo();

                    // 거절(W → R)만 카운터 -1. 승인(W → A)은 둘 다 카운트 집합이라 변화 없음
                    if ("R".equals(status)) {
                        companionMapper.decrementCurrentMembers(join.getCompanionNo());
                    }

                    String type = "A".equals(status) ? "COMPANION_ACCEPTED" : "COMPANION_REJECTED";
                    String title = "A".equals(status) ? "동행 신청 승인" : "동행 신청 거절";
                    String content = "A".equals(status)
                            ? "'" + companionTitle + "' 동행 신청이 승인되었습니다."
                            : "'" + companionTitle + "' 동행 신청이 거절되었습니다.";

                    NotificationDTO notification = NotificationDTO.builder()
                            .recipientNo(join.getMemberNo())
                            .senderNo(memberNo)
                            .notificationType(type)
                            .targetType("COMPANION")
                            .targetNo(join.getCompanionNo())
                            .title(title)
                            .content(content)
                            .build();
                    notificationService.createNotification(notification);

                    // 승인 시 그룹 채팅방 자동 생성 (실패해도 수락 트랜잭션 롤백 안 함)
                    if ("A".equals(status) && companionAuthorNo != null) {
                        try {
                            groupChatService.createGroupRoom(
                                join.getCompanionNo(),
                                companionTitle,
                                List.of(companionAuthorNo, join.getMemberNo())
                            );
                        } catch (Exception e) {
                            log.warn("그룹 채팅방 생성 실패 - joinNo: {}", joinNo, e);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("동행 승인/거절 알림 전송 실패", e);
            }
        }

        return result;
    }
}
