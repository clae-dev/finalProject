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

    private int commentNo;
    private int boardNo;
    private int memberNo;
    /** 부모 댓글 번호 (대댓글 시, null이면 최상위) */
    private Integer parentCommentNo;
    private String content;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    private String createdAt;

    private String memberNickname;
    private String memberProfile;

    /** 대댓글 목록 (서비스에서 조립) */
    private List<CommentDTO> replies;
}
