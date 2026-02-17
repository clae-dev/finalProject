package edu.kh.project.notice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.notice.dto.NoticeDTO;
import edu.kh.project.notice.mapper.NoticeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 공지사항 서비스 구현체
 *
 * <p>공지사항 목록/상세 조회, CRUD, 조회수 증가 등
 * 공지사항 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NoticeServiceImpl implements NoticeService {

    private final NoticeMapper noticeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NoticeDTO> getNoticeList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return noticeMapper.selectNoticeList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getNoticeCount(String search) {
        return noticeMapper.selectNoticeCount(search);
    }

    @Override
    public NoticeDTO getNoticeDetail(int boardNo) {
        // 조회수 증가
        noticeMapper.updateReadCount(boardNo);
        return noticeMapper.selectNoticeDetail(boardNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeDTO> getAdminNoticeList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return noticeMapper.selectAdminNoticeList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getAdminNoticeCount(String search) {
        return noticeMapper.selectAdminNoticeCount(search);
    }

    @Override
    public int createNotice(NoticeDTO notice) {
        return noticeMapper.insertNotice(notice);
    }

    @Override
    public int updateNotice(NoticeDTO notice) {
        return noticeMapper.updateNotice(notice);
    }

    @Override
    public int deleteNotice(int boardNo) {
        return noticeMapper.softDeleteNotice(boardNo);
    }
}
