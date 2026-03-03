import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, ExternalLink, Search, Globe, ArrowRight, Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';

import heroImage from '../../assets/images/page/공항.webp';
const HERO_IMAGE = heroImage;

const bookingSites = [
  {
    name: '네이버 항공',
    description: '국내 최대 항공권 비교 검색. 최저가 알림과 다양한 필터로 제주행 항공권을 손쉽게 비교하세요.',
    url: 'https://flight.naver.com',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    hoverBg: 'group-hover:bg-emerald-500',
    tag: '국내 1위',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: '스카이스캐너',
    description: '전 세계 항공사 가격을 한눈에 비교. 유연한 날짜 검색으로 가장 저렴한 제주행 항공편을 찾아보세요.',
    url: 'https://www.skyscanner.co.kr',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-600',
    hoverBg: 'group-hover:bg-sky-500',
    tag: '글로벌 인기',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: '카약',
    description: '글로벌 여행 검색 엔진. 수백 개 항공사와 여행 사이트를 한번에 비교하여 최적의 항공권을 제안합니다.',
    url: 'https://www.kayak.co.kr',
    gradient: 'from-orange-400 via-red-500 to-rose-600',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    hoverBg: 'group-hover:bg-orange-500',
    tag: '스마트 추천',
    tagColor: 'bg-orange-100 text-orange-700',
  },
  {
    name: '인터파크 투어',
    description: '국내 대표 여행 플랫폼. 항공권과 숙소를 함께 예약하면 추가 할인 혜택을 받을 수 있습니다.',
    url: 'https://tour.interpark.com/air',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    hoverBg: 'group-hover:bg-violet-500',
    tag: '패키지 할인',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: '트립닷컴',
    description: '아시아 최대 온라인 여행사. 앱 전용 특가와 다양한 결제 수단으로 편리하게 예약하세요.',
    url: 'https://kr.trip.com/flights',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    hoverBg: 'group-hover:bg-indigo-500',
    tag: '앱 특가',
    tagColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    name: '제주항공',
    description: '제주 기반 대표 저비용 항공사. 공식 사이트 직접 예약으로 가장 저렴한 운임을 확인하세요.',
    url: 'https://www.jejuair.net',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    hoverBg: 'group-hover:bg-amber-500',
    tag: '공식 직항',
    tagColor: 'bg-amber-100 text-amber-700',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function SiteCard({ site, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 글로우 배경 */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${site.glowColor}, transparent 70%)` }}
      />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-white/80">
        {/* 상단 그라데이션 바 — 호버 시 확장 */}
        <div className="relative h-1.5 overflow-hidden">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${site.gradient}`}
            animate={{ scaleY: isHovered ? 3 : 1 }}
            transition={{ duration: 0.3 }}
          />
          {/* 시머 효과 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          />
        </div>

        <div className="p-6">
          {/* 태그 */}
          <motion.div
            className="mb-4"
            animate={{ y: isHovered ? 0 : 0, opacity: 1 }}
          >
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${site.tagColor}`}
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              <Sparkles className="w-3 h-3" />
              {site.tag}
            </span>
          </motion.div>

          {/* 아이콘 + 이름 */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${site.gradient} flex items-center justify-center shadow-lg`}
              style={{ boxShadow: isHovered ? `0 8px 30px ${site.glowColor}` : '0 4px 15px rgba(0,0,0,0.1)' }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <Plane className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h3
                className="text-xl font-black text-slate-800"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                {site.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Globe className="w-3 h-3" />
                <span style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {site.url.replace('https://', '').replace('http://', '')}
                </span>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <p
            className="text-sm text-slate-500 leading-relaxed mb-6"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {site.description}
          </p>

          {/* 바로가기 버튼 */}
          <motion.div
            className={`relative inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold overflow-hidden transition-all duration-500 ${site.bgLight} ${site.textColor} ${site.hoverBg} group-hover:text-white group-hover:shadow-lg`}
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <span className="relative z-10">바로가기</span>
            <motion.div
              className="relative z-10"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* 호버 시 우측 상단 화살표 */}
        <motion.div
          className="absolute top-8 right-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${site.gradient} flex items-center justify-center shadow-md`}>
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/* 배경 장식 원 — 호버 시만 */}
        <motion.div
          className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${site.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`}
        />
      </div>
    </motion.a>
  );
}

export default function Flights() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[520px] overflow-hidden mt-8">
        {/* 배경 이미지 */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <img
            src={HERO_IMAGE}
            alt="하늘"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/70 via-blue-800/60 to-cyan-700/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-transparent" />

        {/* 애니메이션 파티클 */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* 블러 원 장식 */}
        <motion.div
          className="absolute top-16 left-[8%] w-56 h-56 bg-sky-400/15 rounded-full blur-3xl"
          animate={{ y: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-16 right-[8%] w-64 h-64 bg-cyan-300/15 rounded-full blur-3xl"
          animate={{ y: [0, 25, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 비행기 아이콘 트레일 */}
        <motion.div
          className="absolute top-[25%] right-[15%]"
          animate={{
            x: [0, -80, -160],
            y: [0, -20, -40],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Plane className="w-6 h-6 text-white/20 -rotate-12" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/40 text-sm tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            Flight Booking
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-sky-200 shadow-lg shadow-sky-500/10">
              <Plane className="w-4 h-4 text-sky-300" />
              <span style={{ fontFamily: "'Pretendard', sans-serif" }}>제주행 항공권 예약</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-5 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">제주 </span>
            <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">항공권 예약</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-lg leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            다양한 항공권 예약 사이트에서 최저가를 비교하고
            <br className="hidden sm:block" />
            나에게 딱 맞는 제주행 항공편을 찾아보세요
          </motion.p>

        </div>

        {/* 하단 웨이브 */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 안내 섹션 */}
      <div className="max-w-7xl mx-auto px-6 mt-6 relative z-20 mb-12">
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 flex flex-col sm:flex-row items-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-200/50"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3
              className="text-lg font-bold text-slate-800 mb-1"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              항공권 비교 예약
            </h3>
            <p
              className="text-sm text-slate-500"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              아래 사이트들을 통해 제주행 항공권 가격을 비교하고 예약할 수 있습니다. 각 사이트의 특가와 프로모션을 확인해보세요!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-6 ml-auto flex-shrink-0">
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>실시간 비교</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>빠른 예약</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>최저가 보장</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 예약 사이트 카드 그리드 */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookingSites.map((site, index) => (
            <SiteCard key={site.name} site={site} index={index} />
          ))}
        </div>

        {/* 하단 팁 */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-200/60 shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Plane className="w-5 h-5 text-sky-500" />
            </motion.div>
            <span
              className="text-sm text-sky-700 font-semibold"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              TIP: 여러 사이트를 비교하면 더 저렴한 항공권을 찾을 수 있어요!
            </span>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
