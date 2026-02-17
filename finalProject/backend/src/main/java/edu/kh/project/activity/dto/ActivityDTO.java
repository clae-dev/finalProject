package edu.kh.project.activity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 행사/액티비티 게시글 DTO
 *
 * <p>BOARD 테이블(BOARD_TYPE_NO=3)과 매핑되는 행사/액티비티 게시글 데이터 객체.
 * 게시글 정보, 작성자 정보, 댓글/좋아요 집계, 이미지 목록을 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ActivityDTO {

    /** 게시글 번호 (PK) */
    private int boardNo;
    /** 작성자 번호 (FK → MEMBER) */
    private int memberNo;
    /** 게시판 유형 번호 (3: 행사/액티비티) */
    private int boardTypeNo;
    /** 제목 */
    private String boardTitle;
    /** 내용 */
    private String boardContent;
    /** 조회수 */
    private int readCount;
    /** 삭제 여부 (N:정상, Y:삭제) */
    private String boardDelFl;
    /** 작성일 */
    private String createdAt;
    /** 수정일 */
    private String updatedAt;

    // ==================== JOIN 파생 필드 ====================

    /** 작성자 닉네임 */
    private String memberNickname;
    /** 작성자 프로필 이미지 */
    private String memberProfile;

    // ==================== 집계 필드 ====================

    /** 댓글 수 */
    private int commentCount;
    /** 좋아요 수 */
    private int likeCount;
    /** 현재 사용자 좋아요 여부 (0/1) */
    private int isLiked;

    /** 이미지 URL (LISTAGG 결과, 쉼표 구분) */
    private String imageUrls;
    /** 이미지 목록 (서비스에서 imageUrls를 파싱한 결과) */
    private List<String> imageList;
}
