package edu.kh.project.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 공지사항 DTO
 *
 * <p>BOARD 테이블(BOARD_TYPE_NO=1)과 매핑되는 공지사항 데이터 객체.
 * 게시글 정보, 조회수, 삭제 여부, 작성자 닉네임을 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NoticeDTO {

    /** 게시글 번호 (PK) */
    private int boardNo;
    /** 제목 */
    private String boardTitle;
    /** 내용 */
    private String boardContent;
    /** 조회수 */
    private int readCount;
    /** 삭제 여부 (N:정상, Y:삭제) */
    private String boardDelFl;
    /** 작성자 번호 (FK → MEMBER) */
    private int memberNo;
    /** 게시판 유형 번호 (1: 공지사항) */
    private int boardTypeNo;
    /** 작성일 */
    private String createdAt;
    /** 수정일 */
    private String updatedAt;

    // ==================== JOIN 파생 필드 ====================

    /** 작성자 닉네임 */
    private String memberNickname;
}
