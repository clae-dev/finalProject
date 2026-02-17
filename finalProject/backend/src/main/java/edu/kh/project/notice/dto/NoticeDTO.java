package edu.kh.project.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 공지사항 DTO
 * - BOARD 테이블 (BOARD_TYPE_NO=1) 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NoticeDTO {

    private int boardNo;           // 게시글 번호 (PK)
    private String boardTitle;     // 제목
    private String boardContent;   // 내용
    private int readCount;         // 조회수
    private String boardDelFl;     // 삭제 여부 (N:정상, Y:삭제)
    private int memberNo;          // 작성자 번호 (FK)
    private int boardTypeNo;       // 게시판 유형 번호
    private String createdAt;      // 작성일
    private String updatedAt;      // 수정일

    // JOIN 파생 필드 (작성자 정보)
    private String memberNickname; // 작성자 닉네임
}
