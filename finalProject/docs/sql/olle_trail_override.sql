-- ============================================================
-- 올레길 코스 수정 테이블
-- 정적 olleTrails.js 데이터 위에 덮어씌울 텍스트 필드만 저장
-- GPS 경로(path), 스탬프, 출발/도착 좌표는 정적 파일 유지
-- ============================================================

CREATE TABLE OLLE_TRAIL_OVERRIDE (
    TRAIL_ID     NUMBER(5)       PRIMARY KEY,        -- olleTrails.js 기준 id (1~26)
    SUBTITLE     VARCHAR2(300),                       -- 구간 (시흥초등학교 → 광치기해변)
    DESCRIPTION  VARCHAR2(2000),                      -- 코스 소개 텍스트
    DIFFICULTY   VARCHAR2(10),                        -- 난이도: 하 / 중 / 상
    DURATION     VARCHAR2(50),                        -- 소요시간 (예: 5~6시간)
    TERRAIN      VARCHAR2(100),                       -- 지형 (예: 해안·오름)
    DISTANCE     NUMBER(5, 1),                        -- 거리 (km, 소수점 1자리)
    UPDATED_AT   DATE    DEFAULT SYSDATE NOT NULL,    -- 최종 수정일시
    UPDATED_BY   NUMBER(10)                           -- 수정한 관리자 MEMBER_NO (FK 생략)
);

-- 코멘트
COMMENT ON TABLE  OLLE_TRAIL_OVERRIDE              IS '올레길 코스 텍스트 수정 저장 테이블';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.TRAIL_ID     IS '올레길 코스 id (olleTrails.js 기준)';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.SUBTITLE     IS '코스 구간 (출발 → 도착)';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.DESCRIPTION  IS '코스 소개 텍스트';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.DIFFICULTY   IS '난이도 (하/중/상)';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.DURATION     IS '소요시간 텍스트';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.TERRAIN      IS '지형 텍스트';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.DISTANCE     IS '거리(km)';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.UPDATED_AT   IS '마지막 수정일시';
COMMENT ON COLUMN OLLE_TRAIL_OVERRIDE.UPDATED_BY   IS '수정한 관리자 회원번호';
