import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Eye, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAdminVerifications, useApproveVerification, useRejectVerification } from '../../api/admin/useAdmin';

const STATUS_TABS = [
  { key: '', label: '전체' },
  { key: 'W', label: '대기' },
  { key: 'Y', label: '승인' },
  { key: 'R', label: '거부' },
];

export default function AdminVerifications() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewImage, setViewImage] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const { data, isLoading } = useAdminVerifications(page, 10, statusFilter);
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const list = data?.list || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handleApprove = (verificationNo) => {
    if (!window.confirm('인증을 승인하시겠습니까?')) return;
    approveMutation.mutate(verificationNo, {
      onSuccess: (res) => {
        if (res.success) alert('승인되었습니다.');
        else alert(res.message || '승인 실패');
      },
    });
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    rejectMutation.mutate(
      { verificationNo: rejectTarget, adminComment: rejectComment },
      {
        onSuccess: (res) => {
          if (res.success) {
            alert('거부되었습니다.');
            setRejectTarget(null);
            setRejectComment('');
          } else {
            alert(res.message || '거부 실패');
          }
        },
      }
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'W': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-bold"><Clock className="w-3 h-3" />대기</span>;
      case 'Y': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" />승인</span>;
      case 'R': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-500 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" />거부</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">인증 목록을 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상태 필터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex flex-wrap items-center gap-2"
      >
        <span className="text-xs font-bold text-slate-500 mr-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>상태:</span>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200/50'
                : 'bg-sky-50 text-slate-500 hover:bg-sky-100'
            }`}
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-400">총 {totalCount}건</span>
      </motion.div>

      {/* 목록 */}
      {list.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">인증 요청이 없습니다.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sky-50/80">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">회원</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">파일</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">제출일</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">관리</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.verificationNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-600 overflow-hidden">
                          {item.memberProfileImg ? (
                            <img src={item.memberProfileImg} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          ) : (
                            item.memberNickname?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{item.memberNickname}</p>
                          <p className="text-xs text-slate-400">{item.memberEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setViewImage(item.verificationFile)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        서류 보기
                      </button>
                    </td>
                    <td className="px-6 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-3 text-sm text-slate-400">{item.submittedAt}</td>
                    <td className="px-6 py-3">
                      {item.status === 'W' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(item.verificationNo)}
                            disabled={approveMutation.isPending}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => { setRejectTarget(item.verificationNo); setRejectComment(''); }}
                            className="px-3 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            거부
                          </button>
                        </div>
                      )}
                      {item.status !== 'W' && (
                        <span className="text-xs text-slate-300">처리 완료</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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

      {/* 서류 이미지 모달 */}
      <AnimatePresence>
        {viewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={() => setViewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-sky-500" />
                  <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>인증 서류</h3>
                </div>
                <button onClick={() => setViewImage(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <img src={viewImage} alt="인증서류" className="max-w-full rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 거부 사유 모달 */}
      <AnimatePresence>
        {rejectTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={() => setRejectTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>인증 거부</h3>
                </div>
                <button onClick={() => setRejectTarget(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <label className="text-sm font-bold text-slate-700 block mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>거부 사유</label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="거부 사유를 입력해주세요..."
                rows={3}
                className="w-full px-4 py-2.5 border border-sky-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setRejectTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-200/50 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {rejectMutation.isPending ? '처리 중...' : '거부'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
