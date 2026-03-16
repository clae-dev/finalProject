import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Route, Mountain, ChevronRight,
  Footprints, SlidersHorizontal,
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useOlleTrails } from '../../api/olletrail/useOlleTrail';

const DIFFICULTY = {
  하: {
    badge:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    header: 'from-emerald-400 via-teal-400 to-cyan-500',
    hover:  'group-hover:bg-emerald-500 group-hover:border-emerald-500',
  },
  중: {
    badge:  'bg-amber-100 text-amber-700 border-amber-200',
    header: 'from-amber-400 via-orange-400 to-rose-400',
    hover:  'group-hover:bg-amber-500 group-hover:border-amber-500',
  },
  상: {
    badge:  'bg-red-100 text-red-700 border-red-200',
    header: 'from-red-400 via-rose-400 to-pink-500',
    hover:  'group-hover:bg-red-500 group-hover:border-red-500',
  },
};

export default function OlleTrails() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('전체');
  const [region, setRegion]         = useState('전체');

  const { data: olleTrails = [] } = useOlleTrails();

  const filtered = useMemo(() =>
    olleTrails.filter((t) => {
      if (difficulty !== '전체' && t.difficulty !== difficulty) return false;
      if (region     !== '전체' && t.region     !== region)     return false;
      return true;
    }),
  [difficulty, region, olleTrails]);

  const totalDistance = olleTrails.reduce((s, t) => s + t.distance, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <Header />

      {/* ── Hero ── */}
      <div className="relative h-[380px] overflow-hidden mt-8">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596273306870-21ec3a8ed0b3?w=1400')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/65" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/60 text-xs tracking-[0.35em] uppercase mb-4 font-pretendard"
          >
            JEJU OLLE TRAIL
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg font-gmarket"
          >
            제주 올레길
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/80 text-sm mb-7 font-pretendard"
          >
            제주 해안과 오름을 잇는 도보 여행의 정수
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/25">
              <Footprints className="w-4 h-4 text-emerald-300" />
              <span className="text-white text-sm font-bold font-pretendard">
                총 {olleTrails.length}개 코스
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/25">
              <Route className="w-4 h-4 text-teal-300" />
              <span className="text-white text-sm font-bold font-pretendard">
                총 {totalDistance} km
              </span>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 253 244)" d="M0,30 C360,60 720,10 1080,35 C1260,48 1380,20 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* ── 필터 바 ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold font-pretendard">난이도</span>
          </div>

          {['전체', '하', '중', '상'].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className="font-pretendard"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                difficulty === d
                  ? d === '전체' ? 'bg-slate-700 text-white border-slate-700'
                  : d === '하'   ? 'bg-emerald-500 text-white border-emerald-500'
                  : d === '중'   ? 'bg-amber-500 text-white border-amber-500'
                  :                'bg-red-500 text-white border-red-500'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {d}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 hidden sm:block mx-1" />
          <span className="text-xs font-semibold text-slate-400 font-pretendard">지역</span>

          {['전체', '제주시', '서귀포시'].map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className="font-pretendard"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                region === r
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {r}
            </button>
          ))}

          <div className="ml-auto">
            <span
              className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full font-pretendard"
            >
              {filtered.length}개 코스
            </span>
          </div>
        </div>
      </div>

      {/* ── 코스 그리드 ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Mountain className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium font-pretendard">
              해당 조건의 코스가 없습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((trail, i) => {
              const dc = DIFFICULTY[trail.difficulty];
              const numLabel = trail.name.replace('코스', '');
              const firstStamp = trail.stamps[0];
              const lastStamp  = trail.stamps[trail.stamps.length - 1];

              return (
                <motion.div
                  key={trail.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.35, ease: 'easeOut' }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/olle/${trail.id}`)}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  {/* 카드 헤더 — 그라데이션 */}
                  <div className={`relative bg-gradient-to-br ${dc.header} px-5 pt-5 pb-7 overflow-hidden`}>
                    {/* 배경 장식 — 큰 코스 번호 */}
                    <span className="absolute -right-1 -bottom-3 text-[80px] font-black text-white/15 leading-none select-none pointer-events-none">
                      {numLabel}
                    </span>

                    {/* 상단 행 — 지역 + 난이도 */}
                    <div className="flex items-center justify-between mb-4 relative">
                      <span className="flex items-center gap-1 text-[11px] text-white/85 font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 font-pretendard"
                      >
                        <MapPin className="w-3 h-3" />
                        {trail.region}
                      </span>
                      <span className="text-[11px] text-white/90 font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 font-pretendard"
                      >
                        난이도 {trail.difficulty}
                      </span>
                    </div>

                    {/* 코스명 + 부제 */}
                    <h3
                      className="text-xl font-black text-white mb-1 relative drop-shadow-sm font-gmarket"
                    >
                      {trail.name}
                    </h3>
                    <p className="text-white/75 text-xs relative truncate font-pretendard">
                      {trail.subtitle}
                    </p>
                  </div>

                  {/* 카드 바디 — 3분할 스탯 */}
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-3 divide-x divide-slate-100">
                      <div className="flex flex-col items-center gap-1 pr-3">
                        <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                          <Route className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                        <p className="text-sm font-black text-slate-800 font-pretendard">
                          {trail.distance}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">km</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 px-3">
                        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5 text-violet-500" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 text-center leading-tight font-pretendard">
                          {trail.duration}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">소요</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 pl-3">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                          <Footprints className="w-3.5 h-3.5 text-teal-500" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 text-center leading-tight font-pretendard">
                          {trail.terrain}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">지형</p>
                      </div>
                    </div>
                  </div>

                  {/* 카드 푸터 — 출발→도착 + 화살표 버튼 */}
                  <div className="px-5 pb-4 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-400 font-medium truncate font-pretendard">
                      {firstStamp}
                      <span className="mx-1 text-slate-300">→</span>
                      {lastStamp}
                    </p>
                    <div className={`w-7 h-7 flex-shrink-0 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center transition-all ${dc.hover}`}>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
