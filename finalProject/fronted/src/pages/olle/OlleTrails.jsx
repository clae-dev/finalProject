import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Route, Mountain, ChevronRight, Filter } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { olleTrails } from '../../data/olleTrails';

const DIFFICULTY_COLOR = {
  하: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  중: { badge: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500'   },
  상: { badge: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-500'     },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function OlleTrails() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('전체');
  const [region, setRegion]         = useState('전체');

  const filtered = useMemo(() => {
    return olleTrails.filter((t) => {
      if (difficulty !== '전체' && t.difficulty !== difficulty) return false;
      if (region !== '전체' && t.region !== region) return false;
      return true;
    });
  }, [difficulty, region]);

  const totalDistance = olleTrails.reduce((s, t) => s + t.distance, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <Header />

      {/* ── Hero ── */}
      <div className="relative h-[420px] overflow-hidden mt-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596273306870-21ec3a8ed0b3?w=1400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-4 border border-white/30">
              JEJU OLLE TRAIL
            </span>
            <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
              제주 올레길
            </h1>
            <p className="text-white/90 text-lg mb-6 drop-shadow">
              제주 해안과 오름을 잇는 도보 여행의 정수
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold border border-white/30">
                총 {olleTrails.length}개 코스
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold border border-white/30">
                총 {totalDistance} km
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 필터 바 ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">필터</span>
          </div>

          {/* 난이도 필터 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">난이도</span>
            {['전체', '하', '중', '상'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  difficulty === d
                    ? d === '전체'
                      ? 'bg-slate-700 text-white border-slate-700'
                      : d === '하'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : d === '중'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

          {/* 지역 필터 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">지역</span>
            {['전체', '제주시', '서귀포시'].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  region === r
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs text-slate-400 font-medium">
            {filtered.length}개 코스
          </div>
        </div>
      </div>

      {/* ── 코스 그리드 ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Mountain className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">해당 조건의 코스가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((trail, i) => {
              const dc = DIFFICULTY_COLOR[trail.difficulty];
              return (
                <motion.div
                  key={trail.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/olle/${trail.id}`)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                >
                  {/* 카드 상단 색상 바 */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-emerald-400" />

                  <div className="p-5">
                    {/* 코스 번호 + 지역 */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-sm font-black shadow-md">
                        {trail.name.replace('코스', '')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {trail.region}
                      </span>
                    </div>

                    {/* 이름 */}
                    <h3 className="text-base font-bold text-slate-800 mb-0.5 group-hover:text-teal-600 transition-colors">
                      {trail.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 truncate">{trail.subtitle}</p>

                    {/* 스탯 뱃지 */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-medium border border-sky-100">
                        <Route className="w-3 h-3" />
                        {trail.distance} km
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-100">
                        <Clock className="w-3 h-3" />
                        {trail.duration}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${dc.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dc.dot}`} />
                        {trail.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* 카드 하단 */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{trail.terrain}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
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
