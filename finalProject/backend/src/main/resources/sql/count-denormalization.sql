-- ============================================================
-- 카운트 비정규화 마이그레이션
-- 실행 환경: Oracle 12c+
-- 목적   : 매 조회마다 GROUP BY/COUNT(*)로 집계하던 카운터를
--          비정규화 컬럼으로 옮겨 목록/상세 응답 시간 단축
-- ============================================================

-- 1) 비정규화 컬럼 추가
--    Oracle 11g+ 부터 DEFAULT NOT NULL 추가는 메타데이터 only(테이블 풀 리라이트 없음)
ALTER TABLE COMPANION_BOARD ADD (CURRENT_MEMBERS NUMBER DEFAULT 0 NOT NULL);
ALTER TABLE BOARD ADD (COMMENT_COUNT NUMBER DEFAULT 0 NOT NULL);
ALTER TABLE BOARD ADD (LIKE_COUNT NUMBER DEFAULT 0 NOT NULL);

-- 2) 백필 (idempotent — 드리프트 발생 시 재실행 가능)
--    동행 현재 인원: COMPANION_JOIN.STATUS IN ('W','A')
UPDATE COMPANION_BOARD CB
SET CB.CURRENT_MEMBERS = (
    SELECT COUNT(*) FROM COMPANION_JOIN J
    WHERE J.COMPANION_NO = CB.COMPANION_NO
      AND J.STATUS IN ('W','A')
);

-- 게시판 댓글 수: COMMENT_TBL.STATUS = 'A'
UPDATE BOARD B
SET B.COMMENT_COUNT = (
    SELECT COUNT(*) FROM COMMENT_TBL C
    WHERE C.BOARD_NO = B.BOARD_NO
      AND C.STATUS = 'A'
);

-- 게시판 좋아요 수: BOARD_LIKE 전체
UPDATE BOARD B
SET B.LIKE_COUNT = (
    SELECT COUNT(*) FROM BOARD_LIKE L
    WHERE L.BOARD_NO = B.BOARD_NO
);

COMMIT;

-- ============================================================
-- 드리프트 검증 쿼리 (모두 0 행이어야 정상)
-- ============================================================
-- SELECT COUNT(*) FROM COMPANION_BOARD CB
-- WHERE CB.CURRENT_MEMBERS <> NVL((SELECT COUNT(*) FROM COMPANION_JOIN J
--   WHERE J.COMPANION_NO = CB.COMPANION_NO AND J.STATUS IN ('W','A')), 0);
--
-- SELECT COUNT(*) FROM BOARD B
-- WHERE B.COMMENT_COUNT <> NVL((SELECT COUNT(*) FROM COMMENT_TBL C
--   WHERE C.BOARD_NO = B.BOARD_NO AND C.STATUS = 'A'), 0);
--
-- SELECT COUNT(*) FROM BOARD B
-- WHERE B.LIKE_COUNT <> NVL((SELECT COUNT(*) FROM BOARD_LIKE L
--   WHERE L.BOARD_NO = B.BOARD_NO), 0);
