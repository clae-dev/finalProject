import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from '../api/core/tokenStorage';

/**
 * 알림 전용 WebSocket 훅
 * - /notificationSock SockJS 연결
 * - 수신 시 React Query 캐시 무효화
 * - 연결 끊김 시 자동 재연결 (최대 5회, 점진적 대기)
 *
 * @param {function} onNotification - 알림 수신 콜백 (optional)
 */
export default function useNotificationSocket(onNotification) {
  const socketRef = useRef(null);
  const queryClient = useQueryClient();
  const retriesRef = useRef(0);
  const timerRef = useRef(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;

    function connect() {
      const accessToken = getToken('accessToken');
      if (!accessToken || unmountedRef.current) return;

      const sock = new SockJS('/notificationSock?token=' + accessToken);
      socketRef.current = sock;

      sock.onopen = () => {
        retriesRef.current = 0;
      };

      sock.onmessage = (e) => {
        const data = JSON.parse(e.data);

        // React Query 캐시 무효화 (알림 목록 + 읽지않은 수)
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        // 콜백 호출
        if (onNotification) {
          onNotification(data);
        }
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
  }, [queryClient, onNotification]);

  return socketRef;
}
