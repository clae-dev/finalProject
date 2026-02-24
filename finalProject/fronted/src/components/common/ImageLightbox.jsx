import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageLightbox – 이미지 라이트박스 공통 컴포넌트
 * Props:
 *   images: string[]  – 이미지 URL 배열
 *   initialIndex: number – 처음 열릴 인덱스 (기본 0)
 *   onClose: () => void – 닫기 콜백
 */
export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const goPrev = useCallback((e) => {
    e?.stopPropagation();
    if (hasPrev) setCurrentIndex(i => i - 1);
  }, [hasPrev]);

  const goNext = useCallback((e) => {
    e?.stopPropagation();
    if (hasNext) setCurrentIndex(i => i + 1);
  }, [hasNext]);

  // 키보드 ESC / 좌우 화살표 지원
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext]);

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        {/* 이미지 */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-full max-h-[85vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`이미지 ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />

          {/* 이미지 카운터 */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 이전 버튼 */}
        {hasPrev && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* 다음 버튼 */}
        {hasNext && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
