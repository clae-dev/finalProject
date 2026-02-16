import { useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { getToken } from '../api/core/tokenStorage';

/**
 * WebSocket 커스텀 훅
 * - SockJS로 연결
 * - onMessage 콜백으로 수신 메시지 전달
 * - sendMessage 함수 반환
 * - 언마운트 시 자동 연결 종료
 *
 * @param {function} onMessage - 메시지 수신 콜백
 * @returns {{ sendMessage: function, connected: boolean }}
 */
export default function useWebSocket(onMessage) {
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    const accessToken = getToken('accessToken');
    if (!accessToken) return;

    const sock = new SockJS('/chattingSock?token=' + accessToken);
    socketRef.current = sock;

    sock.onopen = () => {
      connectedRef.current = true;
    };

    sock.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (onMessage) {
        onMessage(data);
      }
    };

    sock.onclose = () => {
      connectedRef.current = false;
    };

    // cleanup
    return () => {
      if (sock) {
        sock.close();
      }
    };
  }, [onMessage]);

  const sendMessage = useCallback((messageObj) => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.send(JSON.stringify(messageObj));
    }
  }, []);

  return { sendMessage, connected: connectedRef.current };
}
