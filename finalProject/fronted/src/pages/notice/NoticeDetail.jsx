import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar, User, Loader2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useNoticeDetail } from '../../api/notice/useNotice';

export default function NoticeDetail() {
  const { boardNo } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useNoticeDetail(boardNo);

  const notice = data?.success ? data.data : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-10 h-10 text-sky-400" />
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-slate-400 text-lg font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            존재하지 않는 공지사항입니다.
          </p>
          <button
            onClick={() => navigate('/notices')}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      <div className="max-w-4xl mx-auto px-5 py-16">
        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/notices')}
          className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            목록으로 돌아가기
          </span>
        </motion.button>

        {/* 공지 상세 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
        >
          {/* 헤더 */}
          <div className="px-8 py-8 border-b border-sky-50">
            <h1
              className="text-2xl font-black text-slate-800 mb-4"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {notice.boardTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {notice.memberNickname || '관리자'}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {notice.createdAt}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {notice.readCount}
                </span>
              </span>
            </div>
          </div>

          {/* 본문 */}
          <div className="px-8 py-8">
            <p
              className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {notice.boardContent}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
