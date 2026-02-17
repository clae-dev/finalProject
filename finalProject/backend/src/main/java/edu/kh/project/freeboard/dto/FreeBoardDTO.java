package edu.kh.project.freeboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 자유게시판 게시글 DTO
 * - BOARD 테이블 (BOARD_TYPE_NO=2) 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FreeBoardDTO {

    private int boardNo;           // 게시글 번호 (PK)
    private int memberNo;          // 작성자 번호 (FK)
    private int boardTypeNo;       // 게시판 유형 번호
    private String boardTitle;     // 제목
    private String boardContent;   // 내용
    private int readCount;         // 조회수
    private String boardDelFl;     // 삭제 여부 (N:정상, Y:삭제)
    private String createdAt;      // 작성일
    private String updatedAt;      // 수정일

    // JOIN 파생 필드 (작성자 정보)
    private String memberNickname; // 작성자 닉네임
    private String memberProfile;  // 작성자 프로필 이미지

    // 집계 필드
    private int commentCount;      // 댓글 수
    private int likeCount;         // 좋아요 수
    private int isLiked;           // 현재 사용자 좋아요 여부 (0/1)

    // 이미지 (LISTAGG 결과, 쉼표 구분)
    private String imageUrls;

    // 이미지 목록 (서비스에서 imageUrls를 파싱한 결과)
    private List<String> imageList;
}
