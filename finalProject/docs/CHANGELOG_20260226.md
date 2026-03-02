# 2026-02-26 작업 내역 정리

## 1. 명소 지도 섹션 전면 개편

### 변경 파일
- `fronted/src/components/main/SpotsMapSection.jsx`

### 변경 내용
- 기본 5곳 명소(월정리, 협재, 성산일출봉, 우도, 한라산) 하드코딩 데이터 제거
- 검색 전용 구조로 전환 (검색/카테고리 클릭 시에만 결과 표시)
- 카카오 Places API 키워드 검색에서 "제주" 강제 붙이기 제거
- 검색 범위를 `radius: 20km` → `rect: '126.08,33.10,127.00,33.62'` (제주도 전체 영역)로 변경
- 검색 결과 페이지네이션("더보기") 추가
- 마커 클릭 시 카카오맵 스타일 커스텀 오버레이로 상세 카드 표시 (장소명, 카테고리, 주소, 전화, 길찾기, 상세보기)
- 좌측 리스트에 장소 상세 패널 추가 (주소 복사, 전화 연결, 거리 표시, 길찾기/카카오맵 링크)
- 초기 화면에 추천 검색어 버튼 (흑돼지, 해물라면, 오름, 올레길, 감귤체험, 서핑)

### UI/UX 전면 개편
- 기존: 좌측 리스트(2칸) + 우측 지도(3칸) 분리형 → 결과 리스트가 끝없이 길어지고 상세패널이 맨 밑에 묻힘
- 변경: 검색바+카테고리 상단 통합, 지도 전체 너비(520px), 검색 결과를 지도 위 좌측 플로팅 패널(스크롤)로 배치
- 모바일 대응 하단 결과 시트 추가 (max-height 280px, 스크롤)
- 타이틀 "혼행러들이 사랑한 명소" → "혼행러들이 궁금해하는 제주도"

---

## 2. 관리자 페이지 애니메이션 수정

### 변경 파일
- `fronted/src/components/admin/AdminReports.jsx`
- `fronted/src/components/admin/AdminInquiry.jsx`
- `fronted/src/components/admin/AdminVerifications.jsx`

### 변경 내용
- 필터 박스와 테이블의 `motion.div` → 일반 `div`로 변경
- 원인: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`가 필터 변경/페이지 전환 등 매 렌더링마다 반복 실행되어 UI가 정신없이 깜빡임
- 로딩 스피너, 모달 등 의미 있는 애니메이션은 유지

### 신고 상세 모달 스크롤 잠금
- `AdminReports.jsx`에 `useEffect` 추가
- 모달 열릴 때 `body`를 `position: fixed`로 고정하여 배경 스크롤 완전 방지
- 스크롤바 너비만큼 `paddingRight` 보정으로 레이아웃 밀림 방지
- 모달 닫힐 때 원래 스크롤 위치로 복원

---

## 3. 백엔드 500 에러 수정 (4건)

### 변경 파일
- `backend/src/main/resources/mappers/admin-mapper.xml`
- `backend/src/main/resources/mappers/companion-wishlist-mapper.xml`

### 에러 1: DBMS_LOB.SUBSTR() 오류
- 원인: `COMMENT_TBL.CONTENT`가 CLOB인데 `DBMS_LOB.SUBSTR()`은 정상이지만, 다른 VARCHAR2 컬럼과 CASE문에서 섞이면서 타입 불일치
- 수정: `DBMS_LOB.SUBSTR(C.CONTENT, 50, 1)` → `SUBSTR(C.CONTENT, 1, 50)`

### 에러 2: ORA-12704 character set mismatch
- 원인: CASE WHEN 문에서 서로 다른 테이블의 TITLE 컬럼(VARCHAR2 vs NVARCHAR2)을 하나의 결과로 반환할 때 캐릭터셋 불일치
- 수정: 모든 CASE WHEN 결과를 `TO_CHAR()`로 감싸서 동일한 VARCHAR2로 통일

### 에러 3: CLOB Jackson 직렬화 실패
- 원인: `CONTENT_REPORT` 테이블의 `DETAIL_REASON`, `RESULT` 컬럼이 CLOB 타입인데, `resultType="map"`으로 반환 시 `oracle.sql.CLOB` 객체가 그대로 전달됨 → Jackson이 직렬화 불가
- 수정: `R.DETAIL_REASON AS "detailReason"` → `TO_CHAR(R.DETAIL_REASON) AS "detailReason"` (RESULT도 동일)

### 에러 4: 위시리스트 CURRENT_MEMBERS 컬럼 오류
- 원인: `companion-wishlist-mapper.xml`에서 `CB.CURRENT_MEMBERS`를 직접 컬럼으로 접근했지만, 실제 COMPANION_BOARD 테이블에 해당 컬럼 없음 (COMPANION_JOIN에서 COUNT로 계산하는 값)
- 수정: `CB.CURRENT_MEMBERS` → `(SELECT COUNT(*) FROM COMPANION_JOIN J WHERE J.COMPANION_NO = CB.COMPANION_NO AND J.STATUS IN ('W', 'A'))`

---

## 4. DB 테이블 생성 (프로덕션)

### 실행 SQL
```sql
CREATE TABLE COMPANION_WISHLIST (
    WISHLIST_NO   NUMBER PRIMARY KEY,
    COMPANION_NO  NUMBER NOT NULL REFERENCES COMPANION_BOARD(COMPANION_NO) ON DELETE CASCADE,
    MEMBER_NO     NUMBER NOT NULL REFERENCES MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CREATED_AT    DATE DEFAULT SYSDATE NOT NULL,
    CONSTRAINT UK_COMPANION_WISHLIST UNIQUE (COMPANION_NO, MEMBER_NO)
);
CREATE SEQUENCE SEQ_COMPANION_WISHLIST_NO START WITH 1 INCREMENT BY 1;

CREATE TABLE REVIEW_WISHLIST (
    WISHLIST_NO  NUMBER PRIMARY KEY,
    REVIEW_NO    NUMBER NOT NULL REFERENCES COMPANION_REVIEW(REVIEW_NO) ON DELETE CASCADE,
    MEMBER_NO    NUMBER NOT NULL REFERENCES MEMBER(MEMBER_NO) ON DELETE CASCADE,
    CREATED_AT   DATE DEFAULT SYSDATE NOT NULL,
    CONSTRAINT UK_REVIEW_WISHLIST UNIQUE (REVIEW_NO, MEMBER_NO)
);
CREATE SEQUENCE SEQ_REVIEW_WISHLIST_NO START WITH 1 INCREMENT BY 1;
```

---

## 5. SVG 애니메이션 콘솔 에러 수정

### 변경 파일
- `fronted/src/components/main/SpotsMapSection.jsx`

### 변경 내용
- `motion.path`와 `motion.line`에 `initial` 속성 추가 (총 11곳)
- 원인: Framer Motion에서 `animate`만 있고 `initial`이 없으면 첫 렌더 시 `d`, `x2`, `y2` 값이 `undefined`로 처리됨
- 수정 대상: KiteChild(3곳), JumpingChild(2곳), Dog(1곳), Seagull(1곳), 파도 애니메이션(4곳)

---

## 6. 프로젝트 전체 버그 점검 및 보안 개선

### 변경 파일
- `backend/src/main/resources/mappers/admin-mapper.xml`
- `backend/src/main/java/edu/kh/project/freeboard/controller/FreeBoardController.java`
- `backend/src/main/java/edu/kh/project/accommodation/controller/AccommodationController.java`
- `backend/src/main/java/edu/kh/project/companion/controller/CompanionController.java`
- `backend/src/main/java/edu/kh/project/admin/controller/AdminController.java`
- `backend/src/main/resources/config.properties`

### 숙소 후기 관리 CLOB 수정
- `DBMS_LOB.SUBSTR(R.CONTENT, 100, 1)` → `TO_CHAR(SUBSTR(R.CONTENT, 1, 100))`

### API size 파라미터 상한 제한
- 4개 컨트롤러에 `size = Math.min(size, 100);` 추가
- size=999999 같은 요청으로 인한 DoS 방지

### HikariCP 커넥션 풀 증가
- `config.properties`의 `maximum-pool-size` 20 → 50
- 동시 접속 증가 시 커넥션 부족 방지

---

## 7. 창식이 AI 프롬프트

- 백엔드 `AiChatService.java`의 시스템 프롬프트를 OpenAI Playground용으로 제공
- 모델: `gpt-4.1-nano`, Temperature: `0.7`, Max tokens: `800`
- OpenAI Playground에서 프롬프트 발행 완료 (pmpt_699f13a8a9d0819391ec427069340fcd09f6acf603271180)

---

## 8. 문서화

### QnA.md (프로젝트 루트)
- 위치: `finalProject/QnA.md`
- WebSocket 연결 에러 원인 설명 (SockJS fallback 동작, 채팅 기능에 영향 없음)
- visitkorea 이미지 CORS 에러 설명 (크롬 확장 프로그램 문제, img 태그는 정상)
- 크롬 확장 프로그램 파일 로드 에러 설명 (프로젝트와 무관)

---

## 커밋 히스토리

```
714d8f6 [Docs] 콘솔 에러 Q&A 문서 추가
b54bc97 [Fix] 프로젝트 전체 버그 점검 및 보안 개선
a212909 [Fix] SVG 애니메이션 initial 값 누락으로 인한 콘솔 에러 수정
0074703 [Fix] 신고 상세 모달 스크롤 잠금 방식 개선
e96ffc2 [Fix] 신고 상세 모달 열릴 때 body 스크롤 잠금 처리
a5c2e16 [Fix] 신고 CLOB 직렬화 에러 및 위시리스트 컬럼 오류 수정
a3b722e [Fix] 신고 목록 ORA-12704 character set mismatch 에러 수정
51d5c4b [Fix] 관리자 페이지 애니메이션 겹침 및 신고 목록 500 에러 수정
c59cc03 [Style] 명소 지도 섹션 UI/UX 개선 및 타이틀 변경
c250f64 [Refactor] 명소 지도 섹션을 카카오 플레이스 검색 전용으로 개편
```

---

## 배포 현황

- 프론트엔드: EC2 `/home/ec2-user/dist/` (Nginx 서빙)
- 백엔드: EC2 `/home/ec2-user/backend-0.0.1-SNAPSHOT.jar` (Spring Boot)
- 프로덕션 DB: Oracle `COMPANION_WISHLIST`, `REVIEW_WISHLIST` 테이블 생성 완료
