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

const DIFFICULTY_COLOR = {
  하: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  중: { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'   },
  상: { bg: 'bg-red-100',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500'     },
};

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

  const dc = DIFFICULTY_COLOR[trail.difficulty];

  // 지도 마커: 출발(초록), 도착(빨강), 경유지(파랑)
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

  // 지도 중심: 경로 평균
  const center = useMemo(() => {
    const lats = trail.path.map((p) => p.lat);
    const lngs = trail.path.map((p) => p.lng);
    return {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
    };
  }, [trail]);

  // 경로 범위로 적절한 줌 레벨 계산
  const mapLevel = useMemo(() => {
    const lats = trail.path.map((p) => p.lat);
    const lngs = trail.path.map((p) => p.lng);
    const latSpan = Math.max(...lats) - Math.min(...lats);
    const lngSpan = Math.max(...lngs) - Math.min(...lngs);
    const span = Math.max(latSpan, lngSpan);
    if (span > 0.3) return 9;
    if (span > 0.15) return 8;
    if (span > 0.07) return 7;
    return 6;
  }, [trail]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16 mt-8">

        {/* ── 뒤로가기 ── */}
        <button
          onClick={() => navigate('/olle')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-5 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          올레길 목록으로
        </button>

        {/* ── 코스 헤더 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
        >
          {/* 상단 컬러 배너 */}
          <div className="h-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-sm font-black shadow-md">
                {trail.name}
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {trail.region}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
              {trail.subtitle}
            </h1>
          </div>
        </motion.div>

        {/* ── 스탯 바 ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: Route,       label: '거리',     value: `${trail.distance} km`,  color: 'from-sky-400 to-cyan-500' },
            { icon: Mountain,    label: '난이도',   value: trail.difficulty,        color: trail.difficulty === '하' ? 'from-emerald-400 to-green-500' : trail.difficulty === '중' ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-500' },
            { icon: Clock,       label: '소요시간', value: trail.duration,           color: 'from-violet-400 to-purple-500' },
            { icon: Footprints,  label: '지형',     value: trail.terrain,            color: 'from-teal-400 to-emerald-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center text-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
              <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── 카카오맵 ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="p-5 pb-0 flex items-center gap-2">
            <Navigation2 className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-bold text-slate-700">코스 경로</h2>
          </div>
          <div className="p-4">
            <KakaoMap
              lat={center.lat}
              lng={center.lng}
              level={mapLevel}
              markers={mapMarkers}
              path={trail.path}
              height="400px"
            />
          </div>
          <div className="px-5 pb-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-sky-400 rounded-full inline-block" />
              올레길 경로
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-600 rounded-full inline-block" />
              출발/도착 지점
            </span>
          </div>
        </motion.div>

        {/* ── 코스 설명 ── */}
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
            <h2 className="text-base font-bold text-slate-800">코스 소개</h2>
          </div>
          <div className="mx-6 mb-6 rounded-2xl bg-gradient-to-br from-teal-50/70 to-emerald-50/50 border border-teal-100/70 px-6 py-5 relative overflow-hidden">
            <span className="absolute top-2 right-4 text-7xl font-black text-teal-100/80 leading-none select-none pointer-events-none">"</span>
            <div className="relative space-y-3">
              {(trail.description.match(/[^.!?]+[.!?]+/g) ?? [trail.description])
                .map((s) => s.trim())
                .filter(Boolean)
                .map((sentence, i) => (
                  <p
                    key={i}
                    className={`text-[15px] leading-8 ${
                      i === 0
                        ? 'font-semibold text-slate-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {sentence}
                  </p>
                ))}
            </div>
          </div>
        </motion.div>

        {/* ── 스탬프 포인트 ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Stamp className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-bold text-slate-700">스탬프 포인트</h2>
          </div>
          <ol className="space-y-0">
            {trail.stamps.map((stamp, idx) => (
              <li key={idx} className="flex items-start gap-3">
                {/* 타임라인 선 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm flex-shrink-0 ${
                      idx === 0
                        ? 'bg-emerald-500'
                        : idx === trail.stamps.length - 1
                        ? 'bg-red-400'
                        : 'bg-teal-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < trail.stamps.length - 1 && (
                    <div className="w-px h-8 bg-slate-100 mt-1" />
                  )}
                </div>
                <div className="pt-1 pb-5">
                  <p
                    className={`text-sm font-semibold ${
                      idx === 0
                        ? 'text-emerald-600'
                        : idx === trail.stamps.length - 1
                        ? 'text-red-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {stamp}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {idx === 0
                      ? '출발 스탬프'
                      : idx === trail.stamps.length - 1
                      ? '도착 스탬프'
                      : `경유 ${idx}번째`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
