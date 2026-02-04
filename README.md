🏝️ 제주 혼행 커뮤니티 플랫폼

KH정보교육원 파이널 프로젝트 | 2025.01 ~ 2025.02

제주도 게스트하우스 중심의 혼자 여행자(혼행러) 커뮤니티 서비스
📌 프로젝트 개요
기획 배경

1인 여행자 증가 추세와 게스트하우스 수요 증가
기존 숙박 플랫폼의 한계: 가격/위치 중심, 분위기·사람 정보 부족
혼행러 특화 정보(1인실 여부, 커뮤니티 공간, 후기 신뢰도) 필요성

목표

게스트하우스 정보 제공 및 실사용자 후기 시스템 구현
동행 찾기 기능을 통한 커뮤니티 형성
JWT 기반 인증/인가를 통한 안전한 회원 관리


🛠️ 기술 스택
Backend

Framework: Spring Boot 3.5.8
Language: Java 21
Build Tool: Gradle 8.x
Database: Oracle 21c
ORM: MyBatis
Security: JWT (JSON Web Token)
API Documentation: Swagger (선택)

Frontend

Library: React 18 + Vite
Language: JavaScript (ES6+)
Styling: Tailwind CSS
HTTP Client: Axios
State Management: Context API

DevOps

IDE: Eclipse (Spring Tools Suite)
Version Control: Git/GitHub
Deployment: (예정)


📂 프로젝트 구조
finalProject/
├── backend/                # Spring Boot 프로젝트
│   ├── src/main/java/
│   │   └── com/app/
│   │       ├── controller/     # REST API 엔드포인트
│   │       ├── service/        # 비즈니스 로직
│   │       ├── dto/            # 데이터 전송 객체
│   │       ├── mapper/         # MyBatis 인터페이스
│   │       ├── security/       # JWT 인증/인가
│   │       └── config/         # 설정 파일
│   └── src/main/resources/
│       ├── mapper/             # MyBatis XML
│       └── application.yml
│
└── frontend/               # React 프로젝트
    ├── src/
    │   ├── components/         # 재사용 컴포넌트
    │   ├── pages/              # 페이지 컴포넌트
    │   ├── context/            # Context API
    │   └── api/                # Axios 설정
    └── public/

💾 데이터베이스 설계
핵심 테이블 구조
MEMBER (회원)

member_no (PK), member_email, member_password, member_nickname
enroll_date, member_status, member_role

GUESTHOUSE (게스트하우스)

gh_no (PK), gh_name, gh_address, gh_phone
gh_description, latitude, longitude

REVIEW (후기)

review_no (PK), member_no (FK), gh_no (FK)
review_content, review_rating, review_date

COMPANION (동행 찾기)

comp_no (PK), member_no (FK)
comp_title, comp_content, start_date, end_date, max_people


🔑 주요 기능
1. 회원 관리

JWT 기반 회원가입/로그인
권한 분리 (일반 사용자 / 관리자)
회원정보 수정, 탈퇴

2. 숙소 정보 조회

게스트하우스 목록/상세 조회
지역별, 테마별 필터링
지도 기반 위치 표시 (Kakao Map API 연동 예정)

3. 후기 시스템

숙박 후기 작성/수정/삭제
별점 평가 및 통계
후기 신뢰도 표시 (실제 이용 여부 검증)

4. 동행 찾기 게시판

여행 일정 기반 동행 모집글 작성
참여 신청 및 수락/거절 기능
여행 기간 필터링


📋 API 명세 (예시)
인증 (Authentication)
POST   /api/auth/signup      # 회원가입
POST   /api/auth/login       # 로그인
POST   /api/auth/refresh     # 토큰 갱신
회원 (Member)
GET    /api/members/me       # 내 정보 조회
PUT    /api/members/me       # 내 정보 수정
DELETE /api/members/me       # 회원 탈퇴
숙소 (Guesthouse)
GET    /api/guesthouses           # 목록 조회
GET    /api/guesthouses/{id}      # 상세 조회
POST   /api/guesthouses           # 등록 (관리자)
PUT    /api/guesthouses/{id}      # 수정 (관리자)
DELETE /api/guesthouses/{id}      # 삭제 (관리자)
후기 (Review)
GET    /api/reviews?ghNo={id}     # 특정 숙소 후기 목록
POST   /api/reviews                # 후기 작성
PUT    /api/reviews/{id}           # 후기 수정
DELETE /api/reviews/{id}           # 후기 삭제

🎯 평가 요소 반영
데이터 흐름 구조
React Component 
  → Axios API 호출
  → Spring Boot Controller 
  → Service (비즈니스 로직)
  → MyBatis Mapper 
  → Oracle Database
설계 선택 이유

JWT 인증: Stateless 구조로 확장성 확보, REST API 특성에 적합
MyBatis: SQL 직접 제어 가능, 복잡한 조인 쿼리 최적화 용이
Context API: 전역 상태 관리 단순화, 교육과정 패턴 준수
Oracle: 트랜잭션 안정성, 데이터 무결성 보장


🚀 실행 방법
Backend
bashcd backend
./gradlew bootRun
Frontend
bashcd frontend
npm install
npm run dev

📅 개발 일정

2025.01.20 ~ 01.31: 요구사항 분석, DB 설계, API 설계
2025.02.01 ~ 02.07: Backend 핵심 기능 구현 (회원, 인증)
2025.02.08 ~ 02.12: Frontend 구현 및 API 연동
2025.02.13: 포트폴리오 제출
2025.02.14 ~ 02.26: UI/UX 개선, 테스트
2025.02.27: 최종 발표


👤 개발자
조창래 | KH정보교육원 종로캠퍼스 풀스택 개발자 과정

📝 향후 개선 계획

Tour API 연동을 통한 실제 숙소 데이터 확보
채팅 기능 추가 (WebSocket)
이미지 업로드 및 CDN 연동
반응형 디자인 고도화
