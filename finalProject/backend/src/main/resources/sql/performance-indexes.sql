-- ============================================================
-- 성능 최적화 인덱스
-- 실행 환경: Oracle
-- ============================================================

-- 1:1 채팅 메시지 조회 (채팅방별 메시지 SELECT 시 FULL SCAN 방지)
CREATE INDEX IDX_MSG_ROOM ON MESSAGE(CHATTING_ROOM_NO);

-- 그룹 메시지 조회 (방별 메시지 SELECT 시 FULL SCAN 방지)
CREATE INDEX IDX_GMSG_ROOM ON GROUP_MESSAGE(GROUP_ROOM_NO);

-- 그룹 멤버 조회 (방별 멤버 SELECT 및 브로드캐스트 대상 조회)
CREATE INDEX IDX_GCM_ROOM ON GROUP_CHAT_MEMBER(GROUP_ROOM_NO);

-- 읽음 워터마크 조회 (MERGE 조건 WHERE GROUP_ROOM_NO + MEMBER_NO)
CREATE INDEX IDX_GMR_ROOM_MEMBER ON GROUP_MSG_READ(GROUP_ROOM_NO, MEMBER_NO);

-- 숙소 리뷰 조회 (숙소별 리뷰 목록)
CREATE INDEX IDX_ACCOM_REVIEW_ACCOM ON ACCOMMODATION_REVIEW(ACCOMMODATION_NO);

-- 동행 참가 조회 (동행별 참가자 목록)
CREATE INDEX IDX_COMPANION_JOIN_COMP ON COMPANION_JOIN(COMPANION_NO);

-- 댓글 조회 (게시글별 댓글 목록)
CREATE INDEX IDX_COMMENT_BOARD ON COMMENT_TBL(BOARD_NO);

-- 알림 조회 (수신자별 미읽음 알림 조회)
CREATE INDEX IDX_NOTIFICATION_RECIP ON NOTIFICATION(RECIPIENT_NO, IS_READ);
