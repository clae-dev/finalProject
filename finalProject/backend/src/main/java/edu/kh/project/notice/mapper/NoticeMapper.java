package edu.kh.project.notice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.notice.dto.NoticeDTO;

/**
 * 공지사항 MyBatis Mapper
 *
 * <p>BOARD(BOARD_TYPE_NO=1) 테이블에 대한 SQL 매핑 인터페이스.
 * 사용자/관리자용 공지 조회, CRUD, 조회수 증가 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface NoticeMapper {

    /** 공지 목록 (사용자용, 페이징 + 검색) */
    List<NoticeDTO> selectNoticeList(@Param("offset") int offset,
                                     @Param("limit") int limit,
                                     @Param("search") String search);

    /** 공지 총 개수 */
    int selectNoticeCount(@Param("search") String search);

    /** 공지 상세 조회 */
    NoticeDTO selectNoticeDetail(@Param("boardNo") int boardNo);

    /** 조회수 증가 */
    int updateReadCount(@Param("boardNo") int boardNo);

    /** 공지 목록 (관리자용, 페이징 + 검색) */
    List<NoticeDTO> selectAdminNoticeList(@Param("offset") int offset,
                                          @Param("limit") int limit,
                                          @Param("search") String search);

    /** 관리자용 공지 총 개수 */
    int selectAdminNoticeCount(@Param("search") String search);

    /** 공지 작성 */
    int insertNotice(NoticeDTO notice);

    /** 공지 수정 */
    int updateNotice(NoticeDTO notice);

    /** 공지 소프트 삭제 */
    int softDeleteNotice(@Param("boardNo") int boardNo);
}
