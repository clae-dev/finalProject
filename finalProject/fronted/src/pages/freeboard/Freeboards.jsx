import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquareText, Search, Eye, Heart, MessageCircle,
  ChevronLeft, ChevronRight, Loader2, PenLine, Flame, TrendingUp,
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import freeboardHero from '../../assets/images/자유게시판.jpg';
import { useFreeBoardList } from '../../api/freeboard/useFreeboard';
import { AuthContext } from '../../components/AuthContext';

export default function Freeboards() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const size = 15;

  const { data, isLoading } = useFreeBoardList(page, size, search);

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[360px] overflow-hidden mt-8">
        <img
          src={freeboardHero}
          alt="자유게시판"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 6%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/60 text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            Free Board
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">자유롭게 나누는 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
              제주 이야기
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm text-white/75 text-center max-w-xs leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            제주 혼행의 이야기를 자유롭게 나눠보세요
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,30 C360,60 720,10 1080,35 C1260,48 1380,20 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* 검색바 + 글쓰기 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch gap-3 mb-6"
        >
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl shadow-md shadow-sky-100/60 border border-sky-100 px-4 py-2.5"
          >
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="제목이나 내용으로 검색"
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-1"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              검색
            </button>
          </form>

          {user && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/freeboard/write')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-sky-200/50 hover:shadow-lg transition-all whitespace-nowrap"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              <PenLine className="w-4 h-4" />
              글쓰기
            </motion.button>
          )}
        </motion.div>

        {/* 게시글 목록 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-9 h-9 text-sky-400" />
            </motion.div>
            <p className="text-sm text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>불러오는 중...</p>
          </div>
        ) : list.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <MessageSquareText className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              {search ? `"${search}"에 대한 검색 결과가 없습니다.` : '아직 게시글이 없습니다.'}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                className="mt-4 text-sm text-sky-500 font-semibold hover:underline"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                전체 글 보기
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-md shadow-sky-100/50 border border-sky-100 overflow-hidden"
          >
            {/* 목록 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                <span style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  총 <strong className="text-sky-600">{totalCount.toLocaleString()}</strong>개의 글
                </span>
              </div>
              <span className="text-xs text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                {page} / {totalPages} 페이지
              </span>
            </div>

            {/* 컬럼 헤더 */}
            <div className="hidden sm:grid grid-cols-[52px_1fr_88px_100px] border-b border-slate-100 px-5 py-2.5 text-[11px] font-bold text-slate-400 tracking-wide uppercase"
              style={{ fontFamily: "'Pretendard', sans-serif" }}>
              <span className="text-center">번호</span>
              <span>제목</span>
              <span className="text-center">작성자</span>
              <span className="text-center">통계</span>
            </div>

            {/* 게시글 리스트 */}
            <div className="divide-y divide-slate-50">
              {list.map((board, index) => {
                const num = totalCount - ((page - 1) * size) - index;
                const isHot = board.likeCount >= 5 || board.commentCount >= 10;

                return (
                  <motion.div
                    key={board.boardNo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.018 }}
                    onClick={() => navigate(`/freeboard/${board.boardNo}`)}
                    className={`group grid grid-cols-[52px_1fr] sm:grid-cols-[52px_1fr_88px_100px] items-center px-5 py-3.5 cursor-pointer transition-colors duration-150 ${isHot ? 'hover:bg-orange-50/40' : 'hover:bg-sky-50/50'}`}
                  >
                    {/* 번호 */}
                    <div className="flex justify-center">
                      {isHot ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg">
                          <Flame className="w-3.5 h-3.5 text-white" />
                        </span>
                      ) : (
                        <span className="text-sm text-slate-300 font-medium">{num}</span>
                      )}
                    </div>

                    {/* 제목 + 메타 */}
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        {isHot && (
                          <span className="flex-shrink-0 text-[10px] font-black text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full leading-none">
                            HOT
                          </span>
                        )}
                        <span
                          className={`text-[13.5px] font-semibold line-clamp-1 transition-colors ${isHot ? 'text-slate-800 group-hover:text-orange-600' : 'text-slate-700 group-hover:text-sky-600'}`}
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {board.boardTitle}
                        </span>
                        {board.commentCount > 0 && (
                          <span className="flex-shrink-0 text-[11px] font-bold text-sky-500">
                            [{board.commentCount}]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        <span className="font-medium text-slate-500">{board.memberNickname}</span>
                        <span className="text-slate-300">·</span>
                        <span>{board.createdAt}</span>
                        {/* 모바일: 통계 인라인 표시 */}
                        <span className="sm:hidden flex items-center gap-2 ml-auto text-slate-300">
                          <span className="inline-flex items-center gap-0.5">
                            <Eye className="w-3 h-3" />{board.readCount}
                          </span>
                          {board.likeCount > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-rose-400">
                              <Heart className="w-3 h-3 fill-rose-400" />{board.likeCount}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* 작성자 (sm+) */}
                    <div className="hidden sm:block text-center">
                      <span
                        className="text-xs text-slate-500 font-medium truncate block px-1"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {board.memberNickname}
                      </span>
                    </div>

                    {/* 통계 (sm+) */}
                    <div className="hidden sm:flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />
                          {board.readCount}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 ${board.likeCount > 0 ? 'text-rose-400 font-semibold' : ''}`}>
                          <Heart className={`w-3 h-3 ${board.likeCount > 0 ? 'fill-rose-400' : ''}`} />
                          {board.likeCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-slate-300 text-sm px-0.5">…</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                      page === p
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200/60'
                        : 'bg-white border border-sky-100 text-slate-500 hover:text-sky-600 hover:border-sky-200 shadow-sm'
                    }`}
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    {p}
                  </motion.button>
                </React.Fragment>
              ))}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl bg-white shadow-sm border border-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
