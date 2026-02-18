import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, Loader2, MessageSquare, Clock, CheckCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { AuthContext } from '../../components/AuthContext';
import { useMyInquiries, useCreateInquiry, useDeleteInquiry, useInquiryDetail } from '../../api/inquiry/useInquiry';

const CATEGORIES = [
  { value: 'MEMBER', label: '회원' },
  { value: 'ACCOM', label: '숙소' },
  { value: 'COMMUNITY', label: '커뮤니티' },
  { value: 'ETC', label: '기타' },
];

const STATUS_LABELS = {
  W: { text: '대기중', color: 'bg-amber-100 text-amber-700' },
  A: { text: '답변완료', color: 'bg-emerald-100 text-emerald-700' },
};

function InquiryDetailView({ inquiryNo, onClose }) {
  const { data, isLoading } = useInquiryDetail(inquiryNo);
  const inquiry = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (!inquiry) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="px-6 pb-5 space-y-4">
        <div className="bg-sky-50/80 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 mb-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>문의 내용</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            {inquiry.content}
          </p>
        </div>

        {inquiry.answer ? (
          <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 mb-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>관리자 답변</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              {inquiry.answer}
            </p>
            {inquiry.answeredAt && (
              <p className="text-[11px] text-slate-400 mt-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                답변일: {inquiry.answeredAt}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-slate-300 mx-auto mb-1" />
            <p className="text-sm text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              답변 대기중입니다
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function InquiryPage() {
  const { user } = useContext(AuthContext) || {};
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('ETC');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedNo, setExpandedNo] = useState(null);
  const size = 10;

  const { data, isLoading } = useMyInquiries(page, size);
  const createMutation = useCreateInquiry();
  const deleteMutation = useDeleteInquiry();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createMutation.mutate(
      { category, title: title.trim(), content: content.trim() },
      {
        onSuccess: (res) => {
          if (res.success) {
            setTitle('');
            setContent('');
            setPage(1);
          }
        },
      }
    );
  };

  const handleDelete = (e, inquiryNo) => {
    e.stopPropagation();
    if (!confirm('문의를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(inquiryNo);
  };

  const toggleExpand = (no) => {
    setExpandedNo(expandedNo === no ? null : no);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[320px] overflow-hidden mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600" />
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg"
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>1:1 Support</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">1:1 </span>
            <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-teal-200 bg-clip-text text-transparent">문의하기</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-white/70 text-center"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            궁금한 점이 있으시면 편하게 문의해 주세요
          </motion.p>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 space-y-10">
        {/* 문의 작성 폼 */}
        {user ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 p-6 md:p-8 space-y-5"
          >
            <h2
              className="text-lg font-black text-slate-800"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              문의 작성
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      category === cat.value
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                        : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-500'
                    }`}
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                placeholder="문의 제목을 입력하세요"
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                placeholder="문의 내용을 자세히 적어주세요"
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                <Send className="w-4 h-4" />
                {createMutation.isPending ? '등록중...' : '문의 등록'}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 p-8 text-center"
          >
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p
              className="text-slate-500 text-sm mb-4"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              문의를 등록하려면 로그인이 필요합니다
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              로그인하기
            </a>
          </motion.div>
        )}

        {/* 내 문의 목록 */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2
              className="text-lg font-black text-slate-800 mb-5"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              내 문의 내역
              {totalCount > 0 && (
                <span className="ml-2 text-sm font-medium text-slate-400">{totalCount}건</span>
              )}
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-10 h-10 text-sky-400" />
                </motion.div>
              </div>
            ) : list.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 py-16 text-center">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  등록된 문의가 없습니다
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {list.map((item) => (
                  <div
                    key={item.inquiryNo}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-sky-50 border border-sky-50 overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div
                      onClick={() => toggleExpand(item.inquiryNo)}
                      className="flex items-center gap-3 px-6 py-4 cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-600">
                            {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_LABELS[item.status]?.color || 'bg-slate-100 text-slate-500'}`}>
                            {STATUS_LABELS[item.status]?.text || item.status}
                          </span>
                        </div>
                        <p
                          className="text-sm font-semibold text-slate-700 truncate"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                          {item.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.status === 'W' && (
                          <button
                            onClick={(e) => handleDelete(e, item.inquiryNo)}
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {expandedNo === item.inquiryNo
                          ? <ChevronUp className="w-5 h-5 text-slate-400" />
                          : <ChevronDown className="w-5 h-5 text-slate-400" />
                        }
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedNo === item.inquiryNo && (
                        <InquiryDetailView inquiryNo={item.inquiryNo} onClose={() => setExpandedNo(null)} />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
