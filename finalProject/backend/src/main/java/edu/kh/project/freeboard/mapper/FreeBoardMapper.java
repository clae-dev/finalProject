package edu.kh.project.freeboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.freeboard.dto.CommentDTO;
import edu.kh.project.freeboard.dto.FreeBoardDTO;

/**
 * 자유게시판 MyBatis Mapper 인터페이스
 *
 * <p>BOARD 테이블(BOARD_TYPE_NO=2)에 대한 게시글·댓글·좋아요 SQL을 매핑한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface FreeBoardMapper {

    /** 게시글 목록 (페이징 + 검색) */
    List<FreeBoardDTO> selectFreeBoardList(@Param("offset") int offset,
                                           @Param("limit") int limit,
                                           @Param("search") String search);

    /** 게시글 총 개수 */
    int selectFreeBoardCount(@Param("search") String search);

    /** 게시글 상세 조회 */
    FreeBoardDTO selectFreeBoardDetail(@Param("boardNo") int boardNo,
                                       @Param("memberNo") int memberNo);

    /** 조회수 증가 */
    int updateReadCount(@Param("boardNo") int boardNo);

    /** 게시글 작성 */
    int insertFreeBoard(FreeBoardDTO board);

    /** 게시글 이미지 삽입 */
    int insertBoardImage(@Param("boardNo") int boardNo,
                         @Param("imageUrl") String imageUrl,
                         @Param("imageOrder") int imageOrder);

    /** 게시글 수정 */
    int updateFreeBoard(FreeBoardDTO board);

    /** 게시글 이미지 전체 삭제 */
    int deleteBoardImages(@Param("boardNo") int boardNo);

    /** 게시글 소프트 삭제 (작성자) */
    int softDeleteFreeBoard(@Param("boardNo") int boardNo,
                            @Param("memberNo") int memberNo);

    /** 게시글 소프트 삭제 (관리자) */
    int adminSoftDeleteFreeBoard(@Param("boardNo") int boardNo);

    /** 부모 댓글 목록 */
    List<CommentDTO> selectParentComments(@Param("boardNo") int boardNo);

    /** 대댓글 목록 */
    List<CommentDTO> selectChildComments(@Param("parentCommentNo") int parentCommentNo);

    /** 댓글 작성 */
    int insertComment(CommentDTO comment);

    /** 댓글 삭제 (작성자만) */
    int deleteComment(@Param("commentNo") int commentNo,
                      @Param("memberNo") int memberNo);

    /** 좋아요 여부 확인 */
    int selectLikeCheck(@Param("boardNo") int boardNo,
                        @Param("memberNo") int memberNo);

    /** 좋아요 추가 */
    int insertLike(@Param("boardNo") int boardNo,
                   @Param("memberNo") int memberNo);

    /** 좋아요 삭제 */
    int deleteLike(@Param("boardNo") int boardNo,
                   @Param("memberNo") int memberNo);

    /** 좋아요 총 수 */
    int selectLikeCount(@Param("boardNo") int boardNo);
}
