# Troubleshooting

프로젝트 진행 중 발생한 이슈와 해결 과정을 기록합니다.

---

## 1. 숙소 목록 페이지 8~12번 데이터 누락

### 증상
- 숙소 메인 페이지에서 페이지 8번 이후 숙소 카드에 실제 사진이 표시되지 않음
- 페이지 후반부의 숙소 데이터가 일부 누락되는 현상

### 원인 분석

프론트엔드에서 전체 숙소를 한 번에 요청하여 클라이언트 측에서 필터링/정렬/페이지네이션을 처리하는 구조였다.

**프론트엔드 (Accommodations.jsx)**
```js
// 전체 데이터를 요청 (size=10000)
const { data } = useAccommodations(1, 10000, regionParam);

// 썸네일이 있는 숙소를 앞으로 정렬
const sortedAccommodations = [...filteredAccommodations].sort((a, b) => {
  const aHas = a.thumbnailUrl ? 1 : 0;
  const bHas = b.thumbnailUrl ? 1 : 0;
  return bHas - aHas;
});

// 프론트엔드 페이지네이션 (9개씩)
const paginatedAccommodations = sortedAccommodations.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
```

**백엔드 (AccommodationController.java)**
```java
@GetMapping
public ResponseEntity<Map<String, Object>> getAccommodationList(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String region) {

    size = Math.min(size, 100);  // ← 여기서 최대 100개로 제한!
    // ...
}
```

**문제의 흐름:**
1. 프론트엔드가 `size=10000`으로 전체 데이터 요청
2. 백엔드에서 `Math.min(size, 100)`으로 **100개만 반환**
3. 프론트엔드는 100개만 받았지만 `totalCount`는 실제 전체 개수(100개 이상)를 표시
4. 썸네일 유무 정렬로 인해 사진 없는 숙소가 뒤쪽 페이지(8~12)에 집중
5. 100개를 초과하는 숙소 데이터는 아예 누락

### 해결

백엔드의 `size` 상한을 프론트엔드의 요청에 맞게 조정:

```java
// 변경 전
size = Math.min(size, 100);

// 변경 후
size = Math.min(size, 10000);
```

### 파일 변경
- `backend/src/main/java/edu/kh/project/accommodation/controller/AccommodationController.java`

---

## 2. WebSocket 연결 실패 (채팅/알림)

### 증상
브라우저 콘솔에 다음 에러들이 연속 발생:

```
WebSocket connection to 'wss://hondi.site/chattingSock/...' failed
WebSocket connection to 'wss://hondi.site/notificationSock/...' failed
EventSource's response has a MIME type ("text/plain") that is not "text/event-stream". Aborting the connection.
notificationSock/iframe.html?token=... 404 (Not Found)
notificationSock/.../jsonp?token=... 404 (Not Found)
```

SockJS의 모든 전송 방식(WebSocket → EventSource → iframe → jsonp)이 전부 실패하고 있었다.

### 원인 분석

**Nginx 설정 (수정 전)**
```nginx
location /chattingSock {
    proxy_pass             http://127.0.0.1:8080;
    proxy_http_version     1.1;
    proxy_set_header       Upgrade $http_upgrade;
    proxy_set_header       Connection "upgrade";  # ← 문제!
    proxy_set_header       Host $host;
    proxy_read_timeout     3600s;
}
```

`Connection "upgrade"`가 **하드코딩**되어 있어서 WebSocket이 아닌 일반 HTTP 요청에도 `Connection: upgrade` 헤더가 붙었다.

**SockJS의 동작 방식:**
1. 먼저 WebSocket 연결 시도
2. 실패 시 EventSource(SSE) 폴백
3. 실패 시 iframe 폴백
4. 실패 시 jsonp 폴백

단계 2~4는 일반 HTTP 요청인데, `Connection: upgrade`가 강제 설정되면 백엔드가 정상 응답하지 못한다. 결과적으로 모든 폴백 전송이 실패했다.

### 해결

`map` 디렉티브를 사용하여 `Upgrade` 헤더 유무에 따라 `Connection` 값을 동적으로 설정:

```nginx
# http 블록 안에 추가
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

# WebSocket location 블록 수정
location /chattingSock {
    proxy_pass             http://127.0.0.1:8080;
    proxy_http_version     1.1;
    proxy_set_header       Upgrade $http_upgrade;
    proxy_set_header       Connection $connection_upgrade;  # 동적 판별
    proxy_set_header       Host $host;
    proxy_set_header       X-Real-IP $remote_addr;
    proxy_set_header       X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header       X-Forwarded-Proto $scheme;
    proxy_read_timeout     3600s;
    proxy_send_timeout     3600s;
}
```

**동작 원리:**
| 요청 유형 | `$http_upgrade` 값 | `$connection_upgrade` 값 |
|-----------|-------------------|------------------------|
| WebSocket | `websocket` | `upgrade` |
| 일반 HTTP (SSE, polling 등) | (빈 문자열) | `close` |

### 파일 변경
- EC2 서버: `/etc/nginx/nginx.conf`

---

## 3. 행사/액티비티 히어로 섹션 이미지 가시성 문제

### 증상
- 히어로 슬라이드에서 벚꽃, 알파카 등 세로 사진이 잘 보이지 않음
- 이미지 위의 오버레이가 너무 진해서 사진이 가려짐

### 원인 분석

**오버레이 색상이 진함:**
```jsx
// 오렌지/앰버 기반 그라데이션으로 불투명도가 높음
<div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-amber-900/20 to-slate-900/70" />
```

**이미지 위치 기본값:**
```jsx
// object-cover + 기본 center로 세로 사진의 주요 피사체가 잘림
<img className="w-full h-full object-cover" />
```

세로 사진(portrait)이 가로로 넓은 히어로 영역(480px 높이)에 `object-cover`로 표시되면서 상하가 많이 잘리고, 진한 오버레이까지 겹쳐 사진이 거의 보이지 않았다.

### 해결

```jsx
// 오버레이: 깔끔한 검정 계열로 밝게 변경
<div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50" />

// 이미지 위치: 40% 지점에 포커스하여 주요 피사체 노출
<img className="w-full h-full object-cover object-[center_40%]" />
```

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 오버레이 상단 | `orange-900/40` (40%) | `black/25` (25%) |
| 오버레이 중앙 | `amber-900/20` (20%) | `black/10` (10%) |
| 오버레이 하단 | `slate-900/70` (70%) | `black/50` (50%) |
| 이미지 위치 | `object-cover` (center 50%) | `object-cover object-[center_40%]` (center 40%) |

### 파일 변경
- `fronted/src/pages/activity/Activities.jsx`

---

## 4. 숙소 상세 페이지 조회수 미증가

### 증상
- 숙소 상세 페이지의 눈(Eye) 아이콘 옆 조회수가 항상 0으로 표시
- 페이지를 여러 번 방문해도 숫자가 올라가지 않음

### 원인 분석

백엔드의 숙소 상세 조회 Service 메서드가 `@Transactional(readOnly = true)`로 설정되어 있었고, 조회수를 증가시키는 로직 자체가 없었다.

**Service (AccommodationServiceImpl.java)**
```java
@Override
@Transactional(readOnly = true)  // ← 읽기 전용이라 UPDATE 불가
public AccommodationDTO getAccommodationDetail(long accommodationNo) {
    // 조회수 증가 로직 없음!
    AccommodationDTO dto = accommodationMapper.selectAccommodationByNo(accommodationNo);
    // ...
    return dto;
}
```

**Mapper XML (accommodation-mapper.xml)**
- `incrementViewCount` 같은 UPDATE 쿼리 자체가 존재하지 않았음

DB의 `VIEW_COUNT` 컬럼은 있지만, 아무도 값을 갱신하지 않아 기본값 0(또는 NULL)이 계속 반환되었다.

### 해결

**1. Mapper XML에 조회수 증가 SQL 추가:**
```xml
<update id="incrementViewCount" parameterType="long">
    UPDATE ACCOMMODATION
    SET VIEW_COUNT = NVL(VIEW_COUNT, 0) + 1
    WHERE ACCOMMODATION_NO = #{accommodationNo}
</update>
```

**2. Mapper 인터페이스에 메서드 선언:**
```java
int incrementViewCount(@Param("accommodationNo") long accommodationNo);
```

**3. Service에서 상세 조회 시 조회수 증가 호출:**
```java
@Override
@Transactional  // readOnly 제거
public AccommodationDTO getAccommodationDetail(long accommodationNo) {
    accommodationMapper.incrementViewCount(accommodationNo);  // 조회수 +1
    AccommodationDTO dto = accommodationMapper.selectAccommodationByNo(accommodationNo);
    // ...
    return dto;
}
```

### 파일 변경
- `backend/src/main/resources/mappers/accommodation-mapper.xml`
- `backend/src/main/java/edu/kh/project/accommodation/mapper/AccommodationMapper.java`
- `backend/src/main/java/edu/kh/project/accommodation/service/AccommodationServiceImpl.java`

---

## 5. 숙소 상세 페이지 평점 하드코딩

### 증상
- 숙소 상세 페이지 사이드바의 별점이 후기 유무와 관계없이 항상 `4.5`로 표시
- 후기가 없는 숙소에서도 4.5점으로 보여 사용자에게 잘못된 정보 제공

### 원인 분석

사이드바 예약 카드의 평점 표시 부분이 실제 리뷰 데이터를 사용하지 않고 **하드코딩**되어 있었다.

**AccommodationDetail.jsx (사이드바)**
```jsx
<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
<span className="font-bold text-slate-700">4.5</span>  {/* ← 하드코딩! */}
```

하단의 `AccommodationReviewSection` 컴포넌트에서는 `useReviewSummary` 훅으로 실제 평균 평점을 조회하고 있었지만, 상위 컴포넌트의 사이드바에서는 이 데이터를 사용하지 않았다.

### 해결

**1. 상위 컴포넌트에서 리뷰 요약 데이터 조회:**
```jsx
const { data: sidebarSummary } = useReviewSummary(Number(accommodationNo));
```

**2. 하드코딩된 값을 실제 데이터로 교체:**
```jsx
// 변경 전
<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
<span className="font-bold text-slate-700">4.5</span>

// 변경 후
<Star className={`w-4 h-4 ${(sidebarSummary?.data?.avgRating || 0) > 0
    ? 'fill-amber-400 text-amber-400'
    : 'text-slate-300'}`}
/>
<span className="font-bold text-slate-700">
    {sidebarSummary?.data?.avgRating || 0}
</span>
```

후기가 없으면 0점 + 회색 별, 후기가 있으면 실제 평균 평점 + 노란 별이 표시된다.

### 파일 변경
- `fronted/src/pages/accommodation/AccommodationDetail.jsx`
