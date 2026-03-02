import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Route, Mountain,
  Flag, Navigation2, Footprints, Stamp,
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import KakaoMap from '../../components/common/KakaoMap';
import { olleTrails } from '../../data/olleTrails';

const DIFFICULTY = {
  하: {
    header:  'from-emerald-400 via-teal-400 to-cyan-500',
    badge:   'bg-emerald-100 text-emerald-700',
    icon:    'from-emerald-400 to-teal-500',
    diffVal: 'text-emerald-600',
    waveFill:'rgb(240 253 244)',
  },
  중: {
    header:  'from-amber-400 via-orange-400 to-rose-400',
    badge:   'bg-amber-100 text-amber-700',
    icon:    'from-amber-400 to-orange-500',
    diffVal: 'text-amber-600',
    waveFill:'rgb(255 251 235)',
  },
  상: {
    header:  'from-red-400 via-rose-400 to-pink-500',
    badge:   'bg-red-100 text-red-700',
    icon:    'from-red-400 to-rose-500',
    diffVal: 'text-red-600',
    waveFill:'rgb(255 241 242)',
  },
};

function getEmoji(text, idx) {
  if (/출발|시작점/.test(text))        return '🚩';
  if (/해안|바다|해변|포구/.test(text)) return '🌊';
  if (/오름|산/.test(text))            return '⛰️';
  if (/숲|수림|나무/.test(text))        return '🌿';
  if (/전망|조망|풍경|경치/.test(text)) return '🔭';
  if (/마을|동네|읍/.test(text))        return '🏘️';
  if (/도착|마지막|마무리/.test(text))  return '🏁';
  if (/걷기|트레킹|도보/.test(text))    return '🚶';
  const fallback = ['📍', '✨', '🌄', '🍃', '🗺️'];
  return fallback[idx % fallback.length];
}

export default function OlleDetail() {
  const { courseNo } = useParams();
  const navigate     = useNavigate();

  const trail = useMemo(
    () => olleTrails.find((t) => t.id === Number(courseNo)),
    [courseNo],
  );

  if (!trail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 text-slate-400">
          <Mountain className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-semibold">코스 정보를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/olle')}
            className="mt-4 px-5 py-2 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const dc = DIFFICULTY[trail.difficulty];
  const numLabel = trail.name.replace('코스', '');

  const mapMarkers = useMemo(() => {
    const ms = [];
    ms.push({ ...trail.startPoint, name: `▶ 출발: ${trail.startPoint.name}` });
    if (
      trail.endPoint.lat !== trail.startPoint.lat ||
      trail.endPoint.lng !== trail.startPoint.lng
    ) {
      ms.push({ ...trail.endPoint, name: `■ 도착: ${trail.endPoint.name}` });
    }
    return ms;
  }, [trail]);

  const center = useMemo(() => {
    const lats = trail.path.map((p) => p.lat);
    const lngs = trail.path.map((p) => p.lng);
    return {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
    };
  }, [trail]);

  const mapLevel = useMemo(() => {
    const lats = trail.path.map((p) => p.lat);
    const lngs = trail.path.map((p) => p.lng);
    const span = Math.max(
      Math.max(...lats) - Math.min(...lats),
      Math.max(...lngs) - Math.min(...lngs),
    );
    if (span > 0.3) return 9;
    if (span > 0.15) return 8;
    if (span > 0.07) return 7;
    return 6;
  }, [trail]);

  // 설명 → 문장 단위 분리
  const sentences = useMemo(
    () =>
      (trail.description.match(/[^.!?]+[.!?]+/g) ?? [trail.description])
        .map((s) => s.trim())
        .filter(Boolean),
    [trail],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <Header />

      {/* ── 히어로 헤더 (난이도 그라데이션) ── */}
      <div className={`relative bg-gradient-to-br ${dc.header} mt-8 pt-10 pb-20 px-4 overflow-hidden`}>
        {/* 배경 장식 — 큰 코스 번호 */}
        <span className="absolute right-6 top-4 text-[110px] font-black text-white/10 leading-none select-none pointer-events-none">
          {numLabel}
        </span>

        <div className="max-w-4xl mx-auto relative">
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate('/olle')}
            className="flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium mb-6 transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            올레길 목록으로
          </button>

          {/* 배지 행 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-sm text-white text-sm font-black border border-white/30"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              {trail.name}
            </span>
            <span
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold border border-white/25"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              <MapPin className="w-3.5 h-3.5" />
              {trail.region}
            </span>
            <span
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold border border-white/25"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              난이도 {trail.difficulty}
            </span>
          </div>

          {/* 코스 부제 */}
          <h1
            className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            {trail.subtitle}
          </h1>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path
              fill={dc.waveFill}
              d="M0,30 C360,60 720,10 1080,35 C1260,48 1380,20 1440,30 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">

        {/* ── 스탯 카드 (히어로에 겹치도록 -mt) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-lg -mt-8 mb-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-slate-100">
            {[
              { icon: Route,      label: '거리',     value: `${trail.distance} km`, color: 'from-sky-400 to-cyan-500'       },
              { icon: Mountain,   label: '난이도',   value: trail.difficulty,        color: dc.icon                          },
              { icon: Clock,      label: '소요시간', value: trail.duration,           color: 'from-violet-400 to-purple-500'  },
              { icon: Footprints, label: '지형',     value: trail.terrain,            color: 'from-teal-400 to-emerald-500'   },
            ].map(({ icon: Icon, label, value, color }, idx) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-5 px-3 text-center">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {label}
                </p>
                <p className="text-sm font-black text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 카카오맵 ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="flex items-center gap-2.5 px-6 pt-5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-sm">
              <Navigation2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              코스 경로
            </h2>
          </div>
          <div className="px-4 pb-0">
            <KakaoMap
              lat={center.lat}
              lng={center.lng}
              level={mapLevel}
              markers={mapMarkers}
              path={trail.path}
              height="400px"
            />
          </div>
          <div className="px-6 py-3 flex flex-wrap gap-4 text-xs text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-sky-400 rounded-full inline-block" />
              올레길 경로
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-500 rounded-full inline-block" />
              출발/도착 지점
            </span>
          </div>
        </motion.div>

        {/* ── 코스 소개 (이모지 키워드 카드) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <Flag className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              코스 소개
            </h2>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sentences.map((sentence, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-100 rounded-2xl px-4 py-3"
              >
                <span className="text-xl leading-none mt-0.5 flex-shrink-0">{getEmoji(sentence, i)}</span>
                <p
                  className="text-[13px] text-slate-700 leading-6 font-medium"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {sentence}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 스탬프 포인트 ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <Stamp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              스탬프 포인트
            </h2>
          </div>

          <div className="px-6 pb-6">
            <ol className="space-y-0">
              {trail.stamps.map((stamp, idx) => {
                const isFirst = idx === 0;
                const isLast  = idx === trail.stamps.length - 1;
                return (
                  <li key={idx} className="flex items-start gap-4">
                    {/* 타임라인 */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm ${
                          isFirst ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                          : isLast  ? 'bg-gradient-to-br from-red-400 to-rose-500'
                          :           'bg-gradient-to-br from-slate-300 to-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {idx < trail.stamps.length - 1 && (
                        <div className="w-px flex-1 min-h-[28px] bg-gradient-to-b from-slate-200 to-transparent mt-1" />
                      )}
                    </div>
                    {/* 내용 */}
                    <div className="pt-1 pb-5">
                      <p
                        className={`text-sm font-bold ${
                          isFirst ? 'text-emerald-600' : isLast ? 'text-rose-500' : 'text-slate-700'
                        }`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {stamp}
                      </p>
                      <span
                        className={`text-[11px] font-semibold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                          isFirst ? 'bg-emerald-50 text-emerald-500'
                          : isLast  ? 'bg-rose-50 text-rose-400'
                          :           'bg-slate-50 text-slate-400'
                        }`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {isFirst ? '출발 스탬프' : isLast ? '도착 스탬프' : `경유 ${idx}번째`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
