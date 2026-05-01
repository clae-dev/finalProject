package edu.kh.project.common.service;

import edu.kh.project.accommodation.mapper.AccommodationMapper;
import edu.kh.project.activity.mapper.ActivityMapper;
import edu.kh.project.freeboard.mapper.FreeBoardMapper;
import edu.kh.project.notice.mapper.NoticeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * 조회수 증가 비동기 처리 서비스
 *
 * <p>상세 조회 시 발생하는 {@code UPDATE ... SET VIEW_COUNT = VIEW_COUNT + 1} 쿼리를
 * 메인 응답 트랜잭션에서 분리한다. fire-and-forget 형태로 별도 스레드 풀에서 실행되어
 * 사용자 응답 시간에 UPDATE/row lock 비용이 포함되지 않는다.</p>
 *
 * <p>@Async self-invocation 문제를 피하기 위해 호출 측 서비스와 분리된 빈으로 구성.
 * REQUIRES_NEW 트랜잭션으로 호출자의 readOnly 트랜잭션과 격리된다.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ViewCountAsyncService {

    private final AccommodationMapper accommodationMapper;
    private final FreeBoardMapper freeBoardMapper;
    private final ActivityMapper activityMapper;
    private final NoticeMapper noticeMapper;

    @Async("viewCountExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementAccommodationViewCount(long accommodationNo) {
        try {
            accommodationMapper.incrementViewCount(accommodationNo);
        } catch (Exception e) {
            log.warn("숙소 조회수 증가 실패 - accommodationNo: {}", accommodationNo, e);
        }
    }

    @Async("viewCountExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementFreeBoardViewCount(int boardNo) {
        try {
            freeBoardMapper.updateReadCount(boardNo);
        } catch (Exception e) {
            log.warn("자유게시판 조회수 증가 실패 - boardNo: {}", boardNo, e);
        }
    }

    @Async("viewCountExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementActivityViewCount(int boardNo) {
        try {
            activityMapper.updateReadCount(boardNo);
        } catch (Exception e) {
            log.warn("활동 게시판 조회수 증가 실패 - boardNo: {}", boardNo, e);
        }
    }

    @Async("viewCountExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementNoticeViewCount(int boardNo) {
        try {
            noticeMapper.updateReadCount(boardNo);
        } catch (Exception e) {
            log.warn("공지사항 조회수 증가 실패 - boardNo: {}", boardNo, e);
        }
    }
}
