/**
 * React Query 클라이언트 전역 설정 (재포커스 시 재요청 비활성화, 재시도 1회)
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
