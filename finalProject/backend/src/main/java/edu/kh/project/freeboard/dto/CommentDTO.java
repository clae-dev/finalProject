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
 * - COMMENT_TBL 테이블과 매핑
 * - 자유게시판, 행사게시판 공용
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CommentDTO {

    private int commentNo;             // 댓글 번호 (PK)
    private int boardNo;               // 게시글 번호 (FK)
    private int memberNo;              // 작성자 번호 (FK)
    private Integer parentCommentNo;   // 부모 댓글 번호 (대댓글 시, null이면 최상위)
    private String content;            // 댓글 내용
    private String status;             // 상태 (A:활성, D:삭제)
    private String createdAt;          // 작성일

    // JOIN 파생 필드 (작성자 정보)
    private String memberNickname;     // 작성자 닉네임
    private String memberProfile;      // 작성자 프로필 이미지

    // 대댓글 목록 (서비스에서 조립)
    private List<CommentDTO> replies;
}
