import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, useMotionValue } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import { useRoomList } from '../../api/chatting/useChatting';
import ChatPanel from './ChatPanel';

export default function ChatBubble() {
  const { user } = useContext(AuthContext) || {};
  const [open, setOpen] = useState(false);
  const [dragged, setDragged] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const { data: roomData } = useRoomList(!!user);
  const rooms = roomData?.success ? (roomData.data || []) : [];
  const unreadCount = rooms.reduce((sum, r) => sum + (r.notReadCount || 0), 0);

  const handlePointerUp = useCallback(() => {
    if (dragged) {
      setDragged(false);
      return;
    }
    setOpen((prev) => !prev);
  }, [dragged]);

  // 알림에서 채팅 열기 커스텀 이벤트 리스너
  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  if (!user) return null;

  return (
    <>
      {/* 드래그 범위: 뷰포트 전체 */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none" />

      {/* 플로팅 버블 버튼 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDrag={() => setDragged(true)}
        onPointerUp={handlePointerUp}
        style={{ x, y }}
        className="fixed bottom-6 right-24 max-sm:bottom-[88px] max-sm:right-6 z-[75] w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 shadow-xl shadow-sky-300/40 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto select-none touch-none border-[3px] border-white"
        title={open ? '채팅 닫기' : '메시지'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 text-white stroke-[2.5] pointer-events-none" />

        {/* 읽지 않은 메시지 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm pointer-events-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* 미읽 메시지 펄스 애니메이션 */}
        {!open && unreadCount > 0 && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-sky-300 pointer-events-none"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.div>

      {/* 채팅 패널 */}
      <ChatPanel isOpen={open} onClose={() => setOpen(false)} motionX={x} motionY={y} />
    </>
  );
}
