import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <section className="py-20 bg-gradient-to-b from-cyan-100 via-sky-50 to-white relative">
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-sky-600 shadow-sm mb-4">
              <span>👥</span> 동행 모집
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">함께라서 더 특별한</h2>
            <p className="text-slate-500 mt-3">지금 모집 중인 동행에 참여해보세요</p>
          </div>
          <div className="flex gap-3">
            <button onClick={prevCompanion} disabled={companionSlide === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextCompanion} disabled={companionSlide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        )}

        {!isLoading && companions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">아직 모집 중인 동행이 없습니다</p>
          </div>
        )}

        {!isLoading && companions.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex gap-5 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${companionSlide * 340}px)` }}>
              {companions.map(comp => {
                const dday = getDday(comp.travelDate);
                const tagList = comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

                return (
                  <div key={comp.companionNo}
                    onClick={() => navigate(`/companions/${comp.companionNo}`)}
                    className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-sky-50">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={comp.imageUrl || DEFAULT_IMAGE}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      {dday && (
                        <span className="absolute top-4 right-4 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-sky-500 shadow-lg">
                          {dday}
                        </span>
                      )}
                      {comp.status === 'C' && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 rounded-full text-xs font-bold text-white">
                          마감
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {tagList.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{comp.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200">
                            {comp.authorProfile ? (
                              <img src={comp.authorProfile} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              comp.authorNickname?.[0] || '?'
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{comp.authorNickname || '익명'}</p>
                            <p className="text-xs text-slate-400">{comp.authorAgeRange || ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-sky-500">{comp.currentMembers}/{comp.maxMembers}</p>
                          <p className="text-xs text-slate-400">{comp.travelDate || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
