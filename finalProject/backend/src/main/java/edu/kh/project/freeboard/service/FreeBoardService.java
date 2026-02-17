package edu.kh.project.freeboard.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.freeboard.dto.CommentDTO;
import edu.kh.project.freeboard.dto.FreeBoardDTO;

/**
 * 자유게시판 서비스 인터페이스
 *
 * <p>게시글 CRUD, 댓글, 좋아요 등 자유게시판 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 */
/**
 * 자유게시판 서비스 인터페이스
 *
 * <p>게시글 CRUD, 댓글(대댓글), 좋아요 토글 등 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 * @see FreeBoardServiceImpl
 */
public interface FreeBoardService {

    /** 게시글 목록 (페이징 + 검색) */
    List<FreeBoardDTO> getFreeBoardList(int page, int size, String search);

    /** 게시글 총 개수 */
    int getFreeBoardCount(String search);

    /** 게시글 상세 조회 + 조회수 증가 */
    FreeBoardDTO getFreeBoardDetail(int boardNo, int memberNo);

    /** 게시글 작성 (이미지 포함) */
    int createFreeBoard(FreeBoardDTO board, List<MultipartFile> images,
                        String webPath, String folderPath);

    /** 게시글 수정 (이미지 포함) */
    int updateFreeBoard(FreeBoardDTO board, List<MultipartFile> images,
                        String webPath, String folderPath);

    /** 게시글 소프트 삭제 (작성자) */
    int deleteFreeBoard(int boardNo, int memberNo);

    /** 게시글 소프트 삭제 (관리자) */
    int adminDeleteFreeBoard(int boardNo);

    /** 댓글 목록 (대댓글 포함) */
    List<CommentDTO> getCommentList(int boardNo);

    /** 댓글 작성 */
    int createComment(CommentDTO comment);

    /** 댓글 삭제 */
    int deleteComment(int commentNo, int memberNo);

    /** 좋아요 토글 → {liked, likeCount} 반환 */
    Map<String, Object> toggleLike(int boardNo, int memberNo);
}
