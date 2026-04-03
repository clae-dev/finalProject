package edu.kh.project.freeboard.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.freeboard.dto.CommentDTO;
import edu.kh.project.freeboard.dto.FreeBoardDTO;
import edu.kh.project.freeboard.mapper.FreeBoardMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 자유게시판 서비스 구현체
 *
 * <p>게시글 CRUD, 댓글(대댓글), 좋아요 토글, 이미지 업로드 등
 * 자유게시판 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FreeBoardServiceImpl implements FreeBoardService {

    private final FreeBoardMapper freeBoardMapper;

    @Override
    @Transactional(readOnly = true)
    public List<FreeBoardDTO> getFreeBoardList(int page, int size, String search) {
        int offset = Math.max(0, (page - 1) * size);
        return freeBoardMapper.selectFreeBoardList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getFreeBoardCount(String search) {
        return freeBoardMapper.selectFreeBoardCount(search);
    }

    @Override
    public FreeBoardDTO getFreeBoardDetail(int boardNo, int memberNo) {
        freeBoardMapper.updateReadCount(boardNo);

        FreeBoardDTO board = freeBoardMapper.selectFreeBoardDetail(boardNo, memberNo);

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
    public int createFreeBoard(FreeBoardDTO board, List<MultipartFile> images,
                               String webPath, String folderPath) {

        int result = freeBoardMapper.insertFreeBoard(board);

        if (result > 0 && images != null && !images.isEmpty()) {
            saveImages(board.getBoardNo(), images, webPath, folderPath);
        }

        return result;
    }

    @Override
    public int updateFreeBoard(FreeBoardDTO board, List<MultipartFile> images,
                               String webPath, String folderPath) {

        int result = freeBoardMapper.updateFreeBoard(board);

        if (result > 0) {
            // 기존 이미지 삭제 후 새 이미지 삽입
            freeBoardMapper.deleteBoardImages(board.getBoardNo());

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
                    freeBoardMapper.insertBoardImage(boardNo, webPath + rename, order++);
                }
            }
        } catch (Exception e) {
            log.error("게시글 이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.", e);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    @Override
    public int deleteFreeBoard(int boardNo, int memberNo) {
        return freeBoardMapper.softDeleteFreeBoard(boardNo, memberNo);
    }

    @Override
    public int adminDeleteFreeBoard(int boardNo) {
        return freeBoardMapper.adminSoftDeleteFreeBoard(boardNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentList(int boardNo) {
        List<CommentDTO> allComments = freeBoardMapper.selectAllComments(boardNo);

        Map<Integer, CommentDTO> parentMap = new LinkedHashMap<>();
        List<CommentDTO> children = new ArrayList<>();

        for (CommentDTO c : allComments) {
            if (c.getParentCommentNo() == null) {
                c.setReplies(new ArrayList<>());
                parentMap.put(c.getCommentNo(), c);
            } else {
                children.add(c);
            }
        }

        for (CommentDTO child : children) {
            CommentDTO parent = parentMap.get(child.getParentCommentNo());
            if (parent != null) {
                parent.getReplies().add(child);
            }
        }

        return new ArrayList<>(parentMap.values());
    }

    @Override
    public int createComment(CommentDTO comment) {
        return freeBoardMapper.insertComment(comment);
    }

    @Override
    public int deleteComment(int commentNo, int memberNo) {
        return freeBoardMapper.deleteComment(commentNo, memberNo);
    }

    @Override
    public Map<String, Object> toggleLike(int boardNo, int memberNo) {
        Map<String, Object> result = new HashMap<>();

        int exists = freeBoardMapper.selectLikeCheck(boardNo, memberNo);

        if (exists > 0) {
            freeBoardMapper.deleteLike(boardNo, memberNo);
            result.put("liked", false);
        } else {
            freeBoardMapper.insertLike(boardNo, memberNo);
            result.put("liked", true);
        }

        result.put("likeCount", freeBoardMapper.selectLikeCount(boardNo));
        return result;
    }
}
