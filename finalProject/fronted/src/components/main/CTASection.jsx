import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600" />

      {/* 파도 SVG 레이어 */}
      <div className="absolute inset-0">
        <motion.svg
          className="absolute top-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.path
            fill="white"
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z"
            animate={{ d: [
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z",
              "M0,40 C240,20 480,80 720,40 C960,20 1200,80 1440,40 L1440,0 L0,0 Z",
              "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z",
            ] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
        <motion.svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.path
            fill="white"
            d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 C1350,40 1440,80 1440,80 L1440,120 L0,120 Z"
            animate={{ d: [
              "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 C1350,40 1440,80 1440,80 L1440,120 L0,120 Z",
              "M0,80 C200,100 400,20 600,80 C800,100 1000,20 1200,80 C1350,60 1440,40 1440,40 L1440,120 L0,120 Z",
              "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 C1350,40 1440,80 1440,80 L1440,120 L0,120 Z",
            ] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      </div>

      {/* 떠다니는 장식 */}
      <motion.div
        className="absolute top-12 left-[10%] w-52 h-52 bg-white/15 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-12 right-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, 25, 0], x: [0, -15, 0], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-[50%] w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 떠다니는 거품 */}
      {[
        { size: 'w-3 h-3', left: '15%', delay: 0, duration: 5 },
        { size: 'w-2 h-2', left: '30%', delay: 1.5, duration: 6 },
        { size: 'w-4 h-4', left: '55%', delay: 0.8, duration: 7 },
        { size: 'w-2.5 h-2.5', left: '75%', delay: 2, duration: 5.5 },
        { size: 'w-3 h-3', left: '88%', delay: 0.5, duration: 6.5 },
      ].map((bubble, i) => (
        <motion.div
          key={i}
          className={`absolute bottom-0 ${bubble.size} bg-white/30 rounded-full`}
          style={{ left: bubble.left }}
          animate={{
            y: [0, -300, -500],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 콘텐츠 */}
      <div className="relative max-w-4xl mx-auto px-5 text-center">
        {/* 아이콘 */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg shadow-sky-900/20 border border-white/30"
          >
            <span className="text-4xl">🌊</span>
          </motion.div>
        </motion.div>

        {/* 제목 */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight"
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          파도가 부르는 소리,
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            들리시나요?
          </motion.span>
        </motion.h2>

        {/* 설명 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-xl md:text-2xl text-white/85 mb-12 leading-relaxed font-medium"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          제주 바다가 당신을 기다리고 있어요
          <br />
          지금 바로 나만의 여행을 시작해보세요
        </motion.p>

        {/* 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/companions')}
            className="group inline-flex items-center gap-3 px-12 py-5 bg-white text-sky-600 font-black text-lg rounded-full shadow-2xl shadow-sky-900/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <span>여행 시작하기</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>
        </motion.div>

        {/* 하단 장식 텍스트 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 flex items-center justify-center gap-6 text-white/40 text-sm font-medium"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            혼자여도 괜찮아
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            함께하면 더 좋아
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            제주에서 만나요
          </span>
        </motion.div>
      </div>
    </section>
  );
}
