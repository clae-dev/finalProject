import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/main/Footer';
import CompanionWriteModal from '../components/companion/CompanionWriteModal';
import { useCompanions } from '../api/useCompanion';
import { AuthContext } from '../components/AuthContext';
import heroStar from '../assets/images/comapanion/별.png';
import heroFriends from '../assets/images/comapanion/친구.png';

const heroSlides = [heroStar, heroFriends];

const TAGS = ['전체', '우도', '카페', '트레킹', '맛집', '일출', '올레길', '자전거', '서핑'];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

function getDday(travelDate) {
  if (!travelDate) return null;
  // "2.15(토)" 형태에서 날짜 추출 시도
  const match = travelDate.match(/(\d{1,2})\.(\d{1,2})/);
  if (!match) return null;
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(year, parseInt(match[1]) - 1, parseInt(match[2]));
  // 올해 날짜가 이미 지났으면 내년으로
  if (target < now) target.setFullYear(year + 1);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return null;
}

export default function Companions() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [selectedTag, setSelectedTag] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useCompanions(currentPage, pageSize, selectedTag);

  const companions = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 히어로 — 이미지 슬라이드 */}
      <div className="relative h-[420px] overflow-hidden">
        {/* 슬라이드 배경 */}
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* 텍스트 */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-5 drop-shadow"
             style={{ fontFamily: "'Pretendard', sans-serif" }}>
            Jeju Companion
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-400/20 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-cyan-300/30 text-cyan-100 shadow-lg shadow-cyan-500/10">
            <Users className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>제주 동행 찾기</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}>
            <span className="text-white">함께라서 더 특별한 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주</span>
          </h1>
          <p className="text-lg text-white/80 text-center max-w-md leading-relaxed drop-shadow"
             style={{ fontFamily: "'Pretendard', sans-serif" }}>
            혼자여도 괜찮아요. 같은 길을 걷는 동행을 만나보세요.
          </p>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${heroSlide === idx ? 'w-8 bg-white' : 'w-3 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* 태그 필터 + 작성 버튼 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag === '전체' ? tag : `#${tag}`}
              </button>
            ))}
          </div>
          {user && (
            <button
              onClick={() => setShowWriteModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-full hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-200"
            >
              <Plus className="w-4 h-4" />
              모집글 작성
            </button>
          )}
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && companions.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">아직 모집글이 없습니다</h3>
            <p className="text-slate-400">첫 번째 동행 모집글을 작성해보세요!</p>
          </div>
        )}

        {/* 카드 그리드 (3열) */}
        {!isLoading && companions.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map(comp => {
              const dday = getDday(comp.travelDate);
              const tagList = comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

              return (
                <div
                  key={comp.companionNo}
                  onClick={() => navigate(`/companions/${comp.companionNo}`)}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-sky-50"
                >
                  {/* 이미지 */}
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
                        <span key={tag} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 카드 내용 */}
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
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="text-slate-300">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                      currentPage === page
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                        : 'bg-white shadow-md text-slate-600 hover:text-sky-500'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 작성 모달 */}
      <CompanionWriteModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
      />

      <Footer />
    </div>
  );
}
