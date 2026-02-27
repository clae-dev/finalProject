/**
 * React Query 클라이언트 전역 설정
 * - staleTime: 5분 — 동일 데이터 재요청 억제
 * - gcTime: 30분 — 언마운트 후 캐시 보존으로 뒤로가기 시 즉시 렌더링
 * - refetchOnWindowFocus: false — 탭 전환 시 불필요한 재요청 방지
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,   // 5분
      gcTime: 1000 * 60 * 30,     // 30분
    },
  },
});
