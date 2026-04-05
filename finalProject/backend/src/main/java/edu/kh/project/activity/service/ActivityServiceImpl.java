package edu.kh.project.activity.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.freeboard.dto.CommentDTO;
import edu.kh.project.activity.dto.ActivityDTO;
import edu.kh.project.activity.mapper.ActivityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 행사/액티비티 게시판 서비스 구현체
 *
 * <p>게시글 CRUD(이미지 UUID 저장 포함), 댓글/대댓글,
 * 좋아요 토글 등 행사 게시판 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ActivityServiceImpl implements ActivityService {

    private final ActivityMapper activityMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDTO> getActivityList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return activityMapper.selectActivityList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getActivityCount(String search) {
        return activityMapper.selectActivityCount(search);
    }

    @Override
    public ActivityDTO getActivityDetail(int boardNo, int memberNo) {
        activityMapper.updateReadCount(boardNo);

        ActivityDTO board = activityMapper.selectActivityDetail(boardNo, memberNo);

        if (board != null && board.getImageUrls() != null && !board.getImageUrls().isEmpty()) {
            List<String> imageList = new ArrayList<>();
            for (String url : board.getImageUrls().split(",")) {
                String trimmed = url.trim();
                if (!trimmed.isEmpty()) {
                    imageList.add(trimmed);
                }
            }
            board.setImageList(imageList);
        }

        return board;
    }

    @Override
    public int createActivity(ActivityDTO board, List<MultipartFile> images,
                              String webPath, String folderPath) {

        int result = activityMapper.insertActivity(board);

        if (result > 0 && images != null && !images.isEmpty()) {
            saveImages(board.getBoardNo(), images, webPath, folderPath);
        }

        return result;
    }

    @Override
    public int updateActivity(ActivityDTO board, List<MultipartFile> images,
                              String webPath, String folderPath) {

        int result = activityMapper.updateActivity(board);

        if (result > 0) {
            activityMapper.deleteBoardImages(board.getBoardNo());

            if (images != null && !images.isEmpty()) {
                saveImages(board.getBoardNo(), images, webPath, folderPath);
            }
        }

        return result;
    }

    /**
     * 게시글 이미지 저장 (UUID 리네임 후 서버에 저장, DB INSERT)
     *
     * @param boardNo    게시글 번호
     * @param images     업로드된 이미지 파일 목록
     * @param webPath    웹 접근 경로
     * @param folderPath 서버 저장 경로
     */
    private void saveImages(int boardNo, List<MultipartFile> images,
                            String webPath, String folderPath) {
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        try {
            int order = 0;
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String rename = UUID.randomUUID().toString()
                            + getFileExtension(file.getOriginalFilename());
                    file.transferTo(new File(folderPath + rename));
                    activityMapper.insertBoardImage(boardNo, webPath + rename, order++);
                }
            }
        } catch (Exception e) {
            log.error("행사 게시글 이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.", e);
        }
    }

    /** 파일명에서 확장자 추출 (.jpg, .png 등) */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    @Override
    public int deleteActivity(int boardNo, int memberNo) {
        return activityMapper.softDeleteActivity(boardNo, memberNo);
    }

    @Override
    public int adminDeleteActivity(int boardNo) {
        return activityMapper.adminSoftDeleteActivity(boardNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentList(int boardNo) {
        List<CommentDTO> allComments = activityMapper.selectAllCommentsByBoardNo(boardNo);

        Map<Integer, CommentDTO> parentMap = new HashMap<>();
        List<CommentDTO> roots = new ArrayList<>();

        for (CommentDTO c : allComments) {
            if (c.getParentCommentNo() == null || c.getParentCommentNo() == 0) {
                c.setReplies(new ArrayList<>());
                parentMap.put(c.getCommentNo(), c);
                roots.add(c);
            }
        }

        for (CommentDTO c : allComments) {
            if (c.getParentCommentNo() != null && c.getParentCommentNo() != 0) {
                CommentDTO parent = parentMap.get(c.getParentCommentNo());
                if (parent != null) {
                    parent.getReplies().add(c);
                }
            }
        }

        return roots;
    }

    @Override
    public int createComment(CommentDTO comment) {
        return activityMapper.insertComment(comment);
    }

    @Override
    public int deleteComment(int commentNo, int memberNo) {
        return activityMapper.deleteComment(commentNo, memberNo);
    }

    @Override
    public Map<String, Object> toggleLike(int boardNo, int memberNo) {
        Map<String, Object> result = new HashMap<>();

        int exists = activityMapper.selectLikeCheck(boardNo, memberNo);

        if (exists > 0) {
            activityMapper.deleteLike(boardNo, memberNo);
            result.put("liked", false);
        } else {
            activityMapper.insertLike(boardNo, memberNo);
            result.put("liked", true);
        }

        result.put("likeCount", activityMapper.selectLikeCount(boardNo));
        return result;
    }
}
