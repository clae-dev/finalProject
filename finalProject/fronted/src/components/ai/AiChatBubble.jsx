import React, { useState, useRef, useContext } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import AiChatPanel from './AiChatPanel';
import changsikImg from '../../assets/images/page/제주.png';

export default function AiChatBubble() {
  const { user } = useContext(AuthContext) || {};
  const [open, setOpen] = useState(false);
  const [dragged, setDragged] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  if (!user) return null;

  const handlePointerUp = () => {
    // 드래그 중이었으면 클릭 무시
    if (dragged) {
      setDragged(false);
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* 드래그 범위: 뷰포트 전체 */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none" />

      {/* 플로팅 버블 버튼 (항상 표시, 열기/닫기 토글) */}
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
        className="fixed bottom-6 right-6 z-[80] w-16 h-16 rounded-full shadow-xl shadow-sky-300/40 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto select-none touch-none overflow-hidden border-[3px] border-white"
        title={open ? '채팅 닫기' : 'AI 창식이'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 캐릭터 이미지 */}
        <img src={changsikImg} alt="AI 창식이" className="w-full h-full object-cover pointer-events-none" />

        {/* 온라인 dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-[2.5px] border-white pointer-events-none" />

        {/* 펄스 링 (채팅 닫힌 상태에서만) */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-sky-300 pointer-events-none"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.div>

      {/* AI 채팅 패널 */}
      <AiChatPanel isOpen={open} onClose={() => setOpen(false)} motionX={x} motionY={y} />
    </>
  );
}
