import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, RotateCcw, X, Save, MapPin, Route,
  Clock, Mountain, Footprints, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { olleTrails as staticTrails } from '../../data/olleTrails';
import {
  useOlleOverrides,
  useSaveOlleOverride,
  useDeleteOlleOverride,
} from '../../api/olletrail/useOlleTrail';

const DIFFICULTY_OPTIONS = ['하', '중', '상'];

function Toast({ message, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white font-pretendard ${
        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      }`}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4" />
        : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

export default function AdminOlleTrails() {
  const [editTrail, setEditTrail] = useState(null);
  const [form, setForm]           = useState({});
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState('');

  const { data: overridesData, isLoading } = useOlleOverrides();
  const saveOverride   = useSaveOlleOverride();
  const deleteOverride = useDeleteOlleOverride();

  // trailId → override 맵
  const overrideMap = {};
  (overridesData?.list ?? []).forEach((ov) => { overrideMap[ov.trailId] = ov; });

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  function openEdit(trail) {
    const ov = overrideMap[trail.id] || {};
    setForm({
      subtitle:    ov.subtitle    ?? trail.subtitle,
      description: ov.description ?? trail.description,
      difficulty:  ov.difficulty  ?? trail.difficulty,
      duration:    ov.duration    ?? trail.duration,
      terrain:     ov.terrain     ?? trail.terrain,
      distance:    ov.distance    ?? trail.distance,
    });
    setEditTrail(trail);
  }

  function handleSave() {
    saveOverride.mutate(
      {
        trailId: editTrail.id,
        data: {
          subtitle:    form.subtitle.trim(),
          description: form.description.trim(),
          difficulty:  form.difficulty,
          duration:    form.duration.trim(),
          terrain:     form.terrain.trim(),
          distance:    Number(form.distance),
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            showToast(`${editTrail.name} 저장 완료`);
            setEditTrail(null);
          } else {
            showToast(res.message || '저장 실패', 'error');
          }
        },
        onError: () => showToast('서버 오류가 발생했습니다.', 'error'),
      }
    );
  }

  function handleReset(trail, e) {
    e.stopPropagation();
    deleteOverride.mutate(trail.id, {
      onSuccess: (res) => {
        showToast(res.message || `${trail.name} 원본으로 복원`);
      },
      onError: () => showToast('서버 오류가 발생했습니다.', 'error'),
    });
  }

  const filtered = staticTrails.filter(
    (t) =>
      t.name.includes(search) ||
      t.subtitle.includes(search) ||
      (overrideMap[t.id]?.subtitle ?? '').includes(search),
  );

  const modifiedCount = Object.keys(overrideMap).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-6 h-6" />
        </motion.div>
        <span className="font-pretendard">올레길 데이터 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-pretendard">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-800 font-pretendard">올레길 코스 관리</h2>
          <p className="text-sm text-slate-400 mt-0.5 font-pretendard">
            총 {staticTrails.length}개 코스 &nbsp;·&nbsp;
            <span className="text-amber-500 font-semibold font-pretendard">{modifiedCount}개 수정됨</span>
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="코스명 또는 구간 검색"
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-teal-400 w-full sm:w-56 font-pretendard"
        />
      </div>

      {/* 안내 배너 */}
      <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 text-sm text-teal-700 font-pretendard">
        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
        <span>수정 내용은 서버 DB에 영구 저장됩니다. GPS 경로·스탬프 좌표는 수정 불가합니다.</span>
      </div>

      {/* 코스 테이블 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[60px_1fr_90px_80px_110px_100px] px-5 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wide font-pretendard">
          <span>코스</span>
          <span>구간 / 소개</span>
          <span className="text-center">거리</span>
          <span className="text-center">난이도</span>
          <span className="text-center">소요시간</span>
          <span className="text-center">관리</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.map((trail) => {
            const ov = overrideMap[trail.id] || {};
            const isModified = !!overridesData?.list.find((o) => o.trailId === trail.id);
            const displaySubtitle   = ov.subtitle    ?? trail.subtitle;
            const displayDescription = ov.description ?? trail.description;
            const displayDifficulty = ov.difficulty  ?? trail.difficulty;
            const displayDistance   = ov.distance    ?? trail.distance;
            const displayDuration   = ov.duration    ?? trail.duration;

            const diffColor =
              displayDifficulty === '하' ? 'bg-emerald-100 text-emerald-700'
              : displayDifficulty === '중' ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700';

            return (
              <div
                key={trail.id}
                className="grid grid-cols-1 sm:grid-cols-[60px_1fr_90px_80px_110px_100px] items-center px-5 py-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-xs font-black shadow-sm">
                    {trail.name.replace('코스', '')}
                  </span>
                </div>

                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-slate-800 truncate">
                      {displaySubtitle}
                    </span>
                    {isModified && (
                      <span className="flex-shrink-0 text-[10px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full border border-amber-200 font-pretendard">
                        수정됨
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {displayDescription}
                  </p>
                </div>

                <div className="hidden sm:flex justify-center font-pretendard">
                  <span className="text-sm font-bold text-slate-700">{displayDistance} km</span>
                </div>
                <div className="hidden sm:flex justify-center font-pretendard">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diffColor}`}>
                    {displayDifficulty}
                  </span>
                </div>
                <div className="hidden sm:flex justify-center font-pretendard">
                  <span className="text-xs font-medium text-slate-500">{displayDuration}</span>
                </div>

                <div className="flex items-center justify-end sm:justify-center gap-2 mt-2 sm:mt-0 font-pretendard">
                  <button
                    onClick={() => openEdit(trail)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors font-pretendard"
                  >
                    <Pencil className="w-3 h-3" />
                    수정
                  </button>
                  {isModified && (
                    <button
                      onClick={(e) => handleReset(trail, e)}
                      disabled={deleteOverride.isPending}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 font-pretendard"
                      title="원본 복원"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 수정 모달 */}
      <AnimatePresence>
        {editTrail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setEditTrail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50">
                <div>
                  <h3 className="text-base font-black text-slate-800 font-pretendard">
                    {editTrail.name} 수정
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-pretendard">
                    {editTrail.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setEditTrail(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1 font-pretendard">
                    <MapPin className="w-3.5 h-3.5" /> 구간 (출발 → 도착)
                  </span>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-pretendard"
                  />
                </label>

                <label className="block font-pretendard">
                  <span className="text-xs font-bold text-slate-500 mb-1.5 block">
                    📝 코스 소개
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none leading-relaxed font-pretendard"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3 font-pretendard">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1 font-pretendard">
                      <Route className="w-3 h-3" /> 거리 (km)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={form.distance}
                      onChange={(e) => setForm({ ...form, distance: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 font-pretendard"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1 font-pretendard">
                      <Mountain className="w-3 h-3" /> 난이도
                    </span>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 bg-white font-pretendard"
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1 font-pretendard">
                      <Clock className="w-3 h-3" /> 소요시간
                    </span>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 font-pretendard"
                      placeholder="예) 5~6시간"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1 font-pretendard">
                    <Footprints className="w-3 h-3" /> 지형
                  </span>
                  <input
                    type="text"
                    value={form.terrain}
                    onChange={(e) => setForm({ ...form, terrain: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-teal-400 font-pretendard"
                    placeholder="예) 해안·오름"
                  />
                </label>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 font-pretendard">
                <button
                  onClick={() => setEditTrail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveOverride.isPending}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-bold shadow-md transition-all disabled:opacity-60 font-pretendard"
                >
                  {saveOverride.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Save className="w-4 h-4" />}
                  {saveOverride.isPending ? '저장 중...' : '저장'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
