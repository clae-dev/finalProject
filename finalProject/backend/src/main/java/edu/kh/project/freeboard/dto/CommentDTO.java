package edu.kh.project.freeboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 댓글 DTO
 *
 * <p>COMMENT_TBL 테이블과 매핑되는 댓글 데이터 객체.
 * 자유게시판, 행사게시판에서 공용으로 사용하며,
 * 부모-자식 관계(대댓글)를 replies 리스트로 표현한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CommentDTO {

    /** 댓글 번호 (PK) */
    private int commentNo;
    /** 게시글 번호 (FK → BOARD) */
    private int boardNo;
    /** 작성자 번호 (FK → MEMBER) */
    private int memberNo;
    /** 부모 댓글 번호 (대댓글 시, null이면 최상위) */
    private Integer parentCommentNo;
    /** 댓글 내용 */
    private String content;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    /** 작성일 */
    private String createdAt;

    // ==================== JOIN 파생 필드 ====================

    /** 작성자 닉네임 */
    private String memberNickname;
    /** 작성자 프로필 이미지 */
    private String memberProfile;

    /** 대댓글 목록 (서비스에서 조립) */
    private List<CommentDTO> replies;
}
