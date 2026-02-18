import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquareText, Search, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight, Loader2, PenLine } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
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
      <div className="relative h-[480px] overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600">
        <motion.div
          className="absolute top-20 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-56 h-56 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-[30%] w-32 h-32 bg-sky-400/10 rounded-full blur-3xl"
          animate={{ x: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            Free Board
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <MessageSquareText className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>자유게시판</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">자유롭게 나누는 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주 이야기</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            제주 혼행의 이야기를 자유롭게 나눠보세요
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* 검색바 + 글쓰기 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <form onSubmit={handleSearch} className="flex-1 w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="제목이나 내용으로 검색"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              검색
            </button>
          </form>

          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/freeboard/write')}
              className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold rounded-2xl shadow-lg shadow-sky-200/50 hover:shadow-xl transition-all whitespace-nowrap"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              <PenLine className="w-4 h-4" />
              글쓰기
            </motion.button>
          )}
        </motion.div>

        {/* 게시글 카드 그리드 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-sky-400" />
            </motion.div>
          </div>
        ) : list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquareText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              등록된 게시글이 없습니다.
            </p>
          </motion.div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-sky-100/40 border border-sky-50 overflow-hidden">
            <table className="w-full text-sm" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              <thead>
                <tr className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-100">
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-16">번호</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500">제목</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-24">작성자</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-16">조회</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-16">댓글</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-16">좋아요</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 w-28 whitespace-nowrap">작성일</th>
                </tr>
              </thead>
              <tbody>
                {list.map((board, index) => (
                  <motion.tr
                    key={board.boardNo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => navigate(`/freeboard/${board.boardNo}`)}
                    className="border-b border-sky-50 last:border-b-0 cursor-pointer hover:bg-sky-50/60 transition-colors duration-200"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{totalCount - ((page - 1) * size) - index}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium hover:text-sky-600 transition-colors line-clamp-1">
                        {board.boardTitle}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 truncate">{board.memberNickname}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {board.readCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {board.commentCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {board.likeCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 text-xs whitespace-nowrap">{board.createdAt}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-slate-300 px-1">...</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPage(p)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 ${
                      page === p
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                        : 'bg-white shadow-md shadow-sky-50 text-slate-500 hover:text-sky-500 border border-sky-50'
                    }`}
                  >
                    {p}
                  </motion.button>
                </React.Fragment>
              ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
