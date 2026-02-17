import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, MessageCircle } from 'lucide-react';
import logo from '@/assets/images/logo/혼디.png';
import bgNoeul from '@/assets/images/main/노을.png';

const features = [
  {
    icon: Building2,
    title: '숙소 검색',
    desc: '제주 전역의 감성 숙소를 한눈에 비교하고 예약하세요',
  },
  {
    icon: Users,
    title: '동행 찾기',
    desc: '혼자여도 괜찮아요, 마음 맞는 여행 동행을 만나보세요',
  },
  {
    icon: MessageCircle,
    title: '여행 후기',
    desc: '생생한 제주 여행 후기를 나누고 영감을 얻으세요',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ──────────── 섹션 1: 풀스크린 히어로 ──────────── */}
      <section className="relative h-screen min-h-[600px]">
        {/* 배경 이미지 + 미세 줌 */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'easeOut' }}
        >
          <img
            src={bgNoeul}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 어두운 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* 상단 로고 */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-20 px-6 py-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <img src={logo} alt="혼디" className="h-12" />
            <div className="flex flex-col leading-tight">
              <span
                className="text-xl font-black text-white tracking-wider"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                HONDI
              </span>
              <span
                className="text-[10px] font-semibold text-white/60 tracking-widest"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                혼디
              </span>
            </div>
          </div>
        </motion.div>

        {/* 중앙 콘텐츠 */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-5">
          <motion.p
            className="text-white/60 text-xs sm:text-sm tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Jeju Solo Travel Community
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            혼자여서 더 자유로운,
          </motion.h1>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 leading-tight drop-shadow-lg bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-transparent"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            제주 여행
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-white/75 mb-12 max-w-md leading-relaxed drop-shadow"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            파도 소리와 함께 나만의 시간을 찾아보세요
          </motion.p>

          {/* CTA 버튼 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/home')}
              className="group px-10 py-4 bg-white text-sky-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              여행 시작하기
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              로그인
            </motion.button>
          </motion.div>
        </div>

        {/* 스크롤 다운 인디케이터 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span
            className="text-white/40 text-xs tracking-widest"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────── 섹션 2: CTA / 기능 소개 ──────────── */}
      <section className="relative min-h-screen py-32 overflow-hidden">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600" />

        {/* 파도 SVG */}
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
              animate={{
                d: [
                  'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z',
                  'M0,40 C240,20 480,80 720,40 C960,20 1200,80 1440,40 L1440,0 L0,0 Z',
                  'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>

        {/* 떠다니는 장식 */}
        <motion.div
          className="absolute top-20 left-[10%] w-52 h-52 bg-white/15 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 25, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 거품 */}
        {[
          { size: 'w-3 h-3', left: '20%', delay: 0, duration: 5 },
          { size: 'w-2 h-2', left: '45%', delay: 1.5, duration: 6 },
          { size: 'w-4 h-4', left: '70%', delay: 0.8, duration: 7 },
          { size: 'w-2.5 h-2.5', left: '85%', delay: 2, duration: 5.5 },
        ].map((bubble, i) => (
          <motion.div
            key={i}
            className={`absolute bottom-0 ${bubble.size} bg-white/30 rounded-full`}
            style={{ left: bubble.left }}
            animate={{ y: [0, -300, -500], opacity: [0, 0.6, 0], scale: [0.5, 1, 0.3] }}
            transition={{ duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: 'easeOut' }}
          />
        ))}

        {/* 콘텐츠 */}
        <div className="relative max-w-5xl mx-auto px-5 text-center">
          {/* 기능 카드 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center shadow-xl shadow-sky-900/10 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.15 }}
              >
                <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200/50">
                  <feat.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3
                  className="text-xl font-bold text-slate-800 mb-3"
                  style={{ fontFamily: "'GmarketSans', sans-serif" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm text-slate-500 leading-relaxed"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* 하단 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg shadow-sky-900/20 border border-white/30 mb-8"
            >
              <span className="text-4xl">🌊</span>
            </motion.div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              지금 HONDI와
              <br />
              함께하세요
            </h2>

            <p
              className="text-lg text-white/80 mb-10 leading-relaxed"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              제주 바다가 당신을 기다리고 있어요
            </p>

            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/home')}
              className="group inline-flex items-center gap-3 px-12 py-5 bg-white text-sky-600 font-black text-lg rounded-full shadow-2xl shadow-sky-900/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              <span>시작하기</span>
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

          {/* 푸터 카피라이트 */}
          <motion.p
            className="mt-20 text-xs text-white/30 font-medium"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            &copy; 2025 HONDI. All rights reserved.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
