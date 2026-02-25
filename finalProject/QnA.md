# 프로젝트 콘솔 에러 Q&A

## 1. WebSocket 연결 에러

```
WebSocket connection to 'wss://hondi.site/chattingSock/...' failed:
WebSocket is closed before the connection is established.
```

### 원인
- 채팅 기능에서 사용하는 SockJS가 메인 페이지 로드 시에도 WebSocket 연결을 시도함
- 채팅방에 입장하지 않은 상태에서 연결이 열리자마자 바로 닫히면서 발생
- SockJS의 정상적인 fallback 동작 (WebSocket → XHR Streaming → XHR Polling 순으로 시도)

### 영향
- 실제 채팅 기능에는 영향 없음 (채팅방 입장 시 정상 연결됨)
- 콘솔에 경고만 표시될 뿐 사용자 경험에 문제 없음

### 해결 방법 (선택사항)
- 채팅방 입장 시에만 WebSocket을 연결하도록 코드 수정 가능
- 현재는 기능상 문제없으므로 무시해도 됨

---

## 2. visitkorea 이미지 CORS 에러

```
Access to image at 'https://tong.visitkorea.or.kr/cms/resource/...'
from origin 'https://hondi.site' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 원인
- 크롬 확장 프로그램(content_script.js)이 페이지의 이미지를 스캔(QR코드 감지 등)할 때 발생
- 확장 프로그램이 JavaScript fetch/XHR로 외부 이미지를 읽으려 하면 CORS 정책에 의해 차단됨
- 한국관광공사(visitkorea) 서버가 외부 도메인의 JavaScript 요청에 대해 CORS 헤더를 제공하지 않기 때문

### 영향
- 실제 숙소 이미지는 HTML의 `<img>` 태그로 로드되므로 CORS 제한을 받지 않음
- 사용자 화면에서 이미지는 정상적으로 표시됨
- 크롬 확장 프로그램의 내부 동작에서만 발생하는 에러

### 해결 방법
- 프로젝트 코드 수정 불필요 (확장 프로그램 문제)
- 해당 크롬 확장 프로그램을 비활성화하면 에러 사라짐
- 또는 크롬 개발자 도구 Console에서 "content_script" 관련 로그를 필터링하면 됨

---

## 3. 크롬 확장 프로그램 파일 로드 에러

```
GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUND
GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUND
GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUND
```

### 원인
- 설치된 크롬 확장 프로그램(비밀번호 자동완성 관련)의 내부 파일이 손상되었거나 버전 불일치

### 영향
- 프로젝트와 전혀 무관한 에러
- 웹사이트 기능에 영향 없음

### 해결 방법
- 크롬 설정 → 확장 프로그램에서 해당 확장을 제거하거나 재설치
