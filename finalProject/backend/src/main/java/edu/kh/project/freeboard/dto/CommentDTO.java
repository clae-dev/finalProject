package edu.kh.project.freeboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    private Integer parentCommentNo;
    private String content;
    private String status;
    private String createdAt;

    // JOIN 파생 필드
    private String memberNickname;
    private String memberProfile;

    // 대댓글 목록
    private List<CommentDTO> replies;
}
