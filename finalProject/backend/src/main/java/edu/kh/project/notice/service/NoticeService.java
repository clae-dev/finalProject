package edu.kh.project.notice.service;

import java.util.List;

import edu.kh.project.notice.dto.NoticeDTO;

public interface NoticeService {

    /** 공지 목록 (사용자용, 페이징) */
    List<NoticeDTO> getNoticeList(int page, int size, String search);

    /** 공지 총 개수 */
    int getNoticeCount(String search);

    /** 공지 상세 조회 + 조회수 증가 */
    NoticeDTO getNoticeDetail(int boardNo);

    /** 공지 목록 (관리자용, 페이징) */
    List<NoticeDTO> getAdminNoticeList(int page, int size, String search);

    /** 관리자용 공지 총 개수 */
    int getAdminNoticeCount(String search);

    /** 공지 작성 */
    int createNotice(NoticeDTO notice);

    /** 공지 수정 */
    int updateNotice(NoticeDTO notice);

    /** 공지 소프트 삭제 */
    int deleteNotice(int boardNo);
}
