import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from '../api/core/tokenStorage';
import type { Notification } from '../types';

/**
 * 알림 전용 WebSocket 훅
 * - /notificationSock SockJS 연결
 * - 수신 시 React Query 캐시 무효화
 * - 연결 끊김 시 자동 재연결 (최대 5회, 점진적 대기)
 */
export default function useNotificationSocket(
  onNotification?: (data: Notification) => void
): React.MutableRefObject<InstanceType<typeof SockJS> | null> {
  const socketRef = useRef<InstanceType<typeof SockJS> | null>(null);
  const queryClient = useQueryClient();
  const retriesRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef<boolean>(false);
  const onNotificationRef = useRef(onNotification);

  // 콜백 참조만 최신으로 유지
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  // WebSocket 연결은 마운트 시 한 번만
  useEffect(() => {
    unmountedRef.current = false;

    function connect(): void {
      const accessToken = getToken('accessToken');
      if (!accessToken || unmountedRef.current) return;

      const sock = new SockJS('/notificationSock?token=' + accessToken);
      socketRef.current = sock;

      sock.onopen = () => {
        retriesRef.current = 0;
      };

      sock.onmessage = (e: MessageEvent) => {
        const data: Notification = JSON.parse(e.data);

        // React Query 캐시 무효화 (알림 목록 + 읽지않은 수)
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        // 콜백 호출
        onNotificationRef.current?.(data);
      };

      sock.onclose = () => {
        socketRef.current = null;
        // 언마운트 상태가 아니면 재연결 시도
        if (!unmountedRef.current && retriesRef.current < 5) {
          const delay = Math.min(3000 * Math.pow(2, retriesRef.current), 30000);
          retriesRef.current += 1;
          timerRef.current = setTimeout(connect, delay);
        }
      };
    }

    connect();

    return () => {
      unmountedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [queryClient]); // queryClient는 안정적 참조라 실질적으로 한 번만 실행

  return socketRef;
}
