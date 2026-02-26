import { useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { getToken } from '../api/core/tokenStorage';
import type { Message } from '../types';

/**
 * WebSocket 커스텀 훅
 * - SockJS로 연결 (연결은 한 번만, 콜백은 항상 최신 참조)
 * - onMessage 콜백으로 수신 메시지 전달
 * - sendMessage 함수 반환
 * - 언마운트 시 자동 연결 종료
 */
export default function useWebSocket(
  onMessage: (data: Message) => void
): { sendMessage: (messageObj: Message) => void; connected: boolean } {
  const socketRef = useRef<InstanceType<typeof SockJS> | null>(null);
  const connectedRef = useRef<boolean>(false);
  const onMessageRef = useRef(onMessage);

  // 콜백 참조만 최신으로 유지 (WebSocket 재연결 없음)
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // WebSocket 연결은 마운트 시 한 번만
  useEffect(() => {
    const accessToken = getToken('accessToken');
    if (!accessToken) return;

    const sock = new SockJS('/chattingSock?token=' + accessToken);
    socketRef.current = sock;

    sock.onopen = () => {
      connectedRef.current = true;
    };

    sock.onmessage = (e: MessageEvent) => {
      const data: Message = JSON.parse(e.data);
      onMessageRef.current?.(data);
    };

    sock.onclose = () => {
      connectedRef.current = false;
    };

    return () => {
      if (sock) {
        sock.close();
      }
    };
  }, []); // 빈 배열 — 마운트/언마운트 시에만

  const sendMessage = useCallback((messageObj: Message): void => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.send(JSON.stringify(messageObj));
    }
  }, []);

  return { sendMessage, connected: connectedRef.current };
}
