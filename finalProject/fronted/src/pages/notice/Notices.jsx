import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Search, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useNoticeList } from '../../api/notice/useNotice';
import noticeHeroImg from '../../assets/images/공지사항.png';

export default function Notices() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const size = 10;

  const { data, isLoading } = useNoticeList(page, size, search);

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
      <div className="relative h-[320px] overflow-hidden mt-8">
        <img src={noticeHeroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/60 via-slate-800/50 to-blue-900/60" />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg"
          >
            <Megaphone className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>Notice</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-teal-200 bg-clip-text text-transparent">공지사항</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-white/70 text-center"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            HONDI의 새로운 소식을 확인하세요
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* 검색바 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3 mb-8"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="제목으로 검색"
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
        </motion.form>

        {/* 공지 목록 */}
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
            <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              등록된 공지사항이 없습니다.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {list.map((notice, index) => (
              <motion.div
                key={notice.boardNo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/notices/${notice.boardNo}`)}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-sky-100 border border-sky-50 px-6 py-5 cursor-pointer hover:bg-sky-50/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-semibold text-slate-700 truncate group-hover:text-sky-600 transition-colors"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {notice.boardTitle}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        {notice.createdAt}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Eye className="w-3.5 h-3.5" />
                        {notice.readCount}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors shrink-0" />
                </div>
              </motion.div>
            ))}
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
