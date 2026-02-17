import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from '../api/core/tokenStorage';

/**
 * 알림 전용 WebSocket 훅
 * - /notificationSock SockJS 연결
 * - 수신 시 React Query 캐시 무효화
 * - onNotification 콜백으로 실시간 알림 데이터 전달
 *
 * @param {function} onNotification - 알림 수신 콜백 (optional)
 */
export default function useNotificationSocket(onNotification) {
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = getToken('accessToken');
    if (!accessToken) return;

    const sock = new SockJS('/notificationSock?token=' + accessToken);
    socketRef.current = sock;

    sock.onopen = () => {
      // 연결 성공
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
      // 연결 종료
    };

    return () => {
      if (sock) {
        sock.close();
      }
    };
  }, [queryClient, onNotification]);

  return socketRef;
}
