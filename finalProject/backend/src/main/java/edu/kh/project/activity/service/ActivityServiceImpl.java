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
        List<CommentDTO> parents = activityMapper.selectParentComments(boardNo);

        for (CommentDTO parent : parents) {
            List<CommentDTO> replies = activityMapper.selectChildComments(parent.getCommentNo());
            parent.setReplies(replies);
        }

        return parents;
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
