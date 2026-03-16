import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Loader2, Trash2, MessageSquare, Send, X } from 'lucide-react';
import {
  useAdminInquiries,
  useAdminInquiryDetail,
  useAnswerInquiry,
  useDeleteAdminInquiry,
} from '../../api/inquiry/useInquiry';

const CATEGORIES = {
  MEMBER: '회원',
  ACCOM: '숙소',
  COMMUNITY: '커뮤니티',
  ETC: '기타',
};

const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'W', label: '대기' },
  { value: 'A', label: '답변완료' },
];

const STATUS_BADGE = {
  W: 'bg-amber-100 text-amber-700',
  A: 'bg-emerald-100 text-emerald-700',
};

function AnswerModal({ inquiryNo, onClose }) {
  const { data, isLoading } = useAdminInquiryDetail(inquiryNo);
  const answerMutation = useAnswerInquiry();
  const [answer, setAnswer] = useState('');

  const inquiry = data?.data;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    answerMutation.mutate(
      { inquiryNo, answer: answer.trim() },
      { onSuccess: (res) => { if (res.success) onClose(); } }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-black text-slate-800 font-pretendard"
          >
            문의 상세 / 답변
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : inquiry ? (
          <div className="space-y-5">
            {/* 문의 정보 */}
            <div className="grid grid-cols-2 gap-3 text-sm font-pretendard">
              <div>
                <span className="text-slate-400">작성자: </span>
                <span className="font-semibold text-slate-700">{inquiry.memberNickname}</span>
              </div>
              <div>
                <span className="text-slate-400">이메일: </span>
                <span className="font-semibold text-slate-700">{inquiry.memberEmail}</span>
              </div>
              <div>
                <span className="text-slate-400">카테고리: </span>
                <span className="font-semibold text-slate-700">{CATEGORIES[inquiry.category] || inquiry.category}</span>
              </div>
              <div>
                <span className="text-slate-400">등록일: </span>
                <span className="font-semibold text-slate-700">{inquiry.createdAt}</span>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1 font-pretendard">제목</p>
              <p className="text-sm font-bold text-slate-800 font-pretendard">{inquiry.title}</p>
            </div>

            {/* 내용 */}
            <div className="bg-sky-50/80 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 mb-1 font-pretendard">문의 내용</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-pretendard">
                {inquiry.content}
              </p>
            </div>

            {/* 기존 답변 or 답변 폼 */}
            {inquiry.status === 'A' ? (
              <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600 mb-1 font-pretendard">등록된 답변</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-pretendard">
                  {inquiry.answer}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-pretendard">
                  답변일: {inquiry.answeredAt}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5 font-pretendard">
                    답변 작성
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    rows={5}
                    placeholder="답변 내용을 입력하세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none font-pretendard"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors font-pretendard"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={answerMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 font-pretendard"
                  >
                    <Send className="w-4 h-4" />
                    {answerMutation.isPending ? '등록중...' : '답변 등록'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-8 font-pretendard">
            문의를 찾을 수 없습니다.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function AdminInquiry() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedNo, setSelectedNo] = useState(null);
  const size = 10;

  const { data, isLoading } = useAdminInquiries(page, size, statusFilter);
  const deleteMutation = useDeleteAdminInquiry();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleDelete = (e, inquiryNo) => {
    e.stopPropagation();
    if (!confirm('문의를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(inquiryNo);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3"
      >
        <div className="flex items-center gap-2 flex-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatusFilter(opt.value); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                statusFilter === opt.value
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                  : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-500'
              }`}
              className="font-pretendard"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-400 font-pretendard">
          총 {totalCount}건
        </span>
      </div>

      {/* 테이블 */}
      <div
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">번호</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">카테고리</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">제목</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">작성자</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">등록일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 font-pretendard">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr
                  key={item.inquiryNo}
                  onClick={() => setSelectedNo(item.inquiryNo)}
                  className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 text-sm text-slate-500">{item.inquiryNo}</td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-600">
                      {CATEGORIES[item.category] || item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[200px] truncate font-pretendard">
                    {item.title}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 font-pretendard">
                    {item.memberNickname}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[item.status] || 'bg-slate-100 text-slate-500'}`}>
                      {item.status === 'W' ? '대기' : '답변완료'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-400 font-pretendard">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedNo(item.inquiryNo); }}
                        className="p-2 rounded-xl text-sky-400 hover:bg-sky-50 hover:text-sky-500 transition-all"
                        title={item.status === 'W' ? '답변하기' : '상세보기'}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.inquiryNo)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm font-pretendard">
                    등록된 문의가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* 답변 모달 */}
      <AnimatePresence>
        {selectedNo && (
          <AnswerModal
            inquiryNo={selectedNo}
            onClose={() => setSelectedNo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
