import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompanions } from '../../api/useCompanion';
import { Loader2 } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

function getDday(travelDate) {
  if (!travelDate) return null;
  const match = travelDate.match(/(\d{1,2})\.(\d{1,2})/);
  if (!match) return null;
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(year, parseInt(match[1]) - 1, parseInt(match[2]));
  if (target < now) target.setFullYear(year + 1);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return null;
}

export default function CompanionsSection() {
  const navigate = useNavigate();
  const [companionSlide, setCompanionSlide] = useState(0);

  const { data, isLoading } = useCompanions(1, 9);
  const companions = data?.success ? (data.list || []) : [];

  const maxSlide = Math.max(0, companions.length - 3);
  const nextCompanion = () => setCompanionSlide(prev => Math.min(prev + 1, maxSlide));
  const prevCompanion = () => setCompanionSlide(prev => Math.max(prev - 1, 0));

  return (
    <section className="relative py-24 bg-gradient-to-b from-cyan-50 via-sky-50 to-white overflow-hidden">
      {/* 배경 장식 */}
      <motion.div
        className="absolute top-20 left-[5%] w-44 h-44 bg-cyan-200/40 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[5%] w-56 h-56 bg-sky-200/40 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-6xl mx-auto px-5 relative">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-bold text-sky-600 shadow-md shadow-sky-100/50 mb-5 border border-sky-100/60"
            >
              <span>👥</span> 동행 모집
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              함께라서 더 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">특별한</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>지금 모집 중인 동행에 참여해보세요</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevCompanion}
              disabled={companionSlide === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-100/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextCompanion}
              disabled={companionSlide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-100/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </motion.button>
          </div>
        </motion.div>

        {/* 카드 슬라이드 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-sky-400" />
            </motion.div>
          </div>
        )}

        {!isLoading && companions.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-100"
            >
              <span className="text-3xl">👥</span>
            </motion.div>
            <p className="text-slate-400 text-lg font-medium">아직 모집 중인 동행이 없습니다</p>
          </motion.div>
        )}

        {!isLoading && companions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${companionSlide * 340}px)` }}>
              {companions.map((comp, index) => {
                const dday = getDday(comp.travelDate);
                const tagList = comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

                return (
                  <motion.div
                    key={comp.companionNo}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onClick={() => navigate(`/companions/${comp.companionNo}`)}
                    className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-300 cursor-pointer group border border-sky-50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={comp.imageUrl || DEFAULT_IMAGE}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                      {dday && (
                        <span className="absolute top-4 right-4 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-sky-500 shadow-lg">
                          {dday}
                        </span>
                      )}
                      {comp.status === 'C' && (
                        <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                          마감
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {tagList.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-600 shadow-sm">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300">{comp.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/50 overflow-hidden">
                            {comp.authorProfile ? (
                              <img src={comp.authorProfile} alt="" className="w-full h-full object-cover" />
                            ) : (
                              comp.authorNickname?.[0] || '?'
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{comp.authorNickname || '익명'}</p>
                            <p className="text-xs text-slate-400">{comp.authorAgeRange || ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">{comp.currentMembers}/{comp.maxMembers}</p>
                          <p className="text-xs text-slate-400">{comp.travelDate || ''}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 더보기 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/companions')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-sky-600 font-bold rounded-full shadow-lg shadow-sky-100/50 hover:shadow-xl border border-sky-100/60 transition-all"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            동행 더보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
