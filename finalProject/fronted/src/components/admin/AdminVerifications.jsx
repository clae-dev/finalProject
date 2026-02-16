import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
      case 'W': return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold"><Clock className="w-3 h-3" />대기</span>;
      case 'Y': return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" />승인</span>;
      case 'R': return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" />거부</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          인증 관리
        </h2>
        <span className="text-sm text-slate-400">총 {totalCount}건</span>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {isLoading ? (
        <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-sky-500 mx-auto" /></div>
      ) : list.length === 0 ? (
        <div className="text-center py-10 text-slate-400">인증 요청이 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left">회원</th>
                <th className="px-4 py-3 text-left">파일</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">제출일</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.verificationNo} className="border-t border-slate-50 hover:bg-sky-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-600 overflow-hidden">
                        {item.memberProfileImg ? (
                          <img src={item.memberProfileImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                          item.memberNickname?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{item.memberNickname}</p>
                        <p className="text-xs text-slate-400">{item.memberEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setViewImage(item.verificationFile)}
                      className="flex items-center gap-1 text-sky-500 hover:text-sky-600 text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      서류 보기
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400">{item.submittedAt}</td>
                  <td className="px-4 py-3 text-center">
                    {item.status === 'W' && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(item.verificationNo)}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-md text-xs font-bold hover:bg-emerald-600 disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => { setRejectTarget(item.verificationNo); setRejectComment(''); }}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600"
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
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-bold ${
                  page === pageNum ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 서류 이미지 모달 */}
      {viewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewImage(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={viewImage} alt="인증서류" className="max-w-full rounded-lg" />
            <button
              onClick={() => setViewImage(null)}
              className="mt-3 w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200"
            >
              닫기
            </button>
          </motion.div>
        </div>
      )}

      {/* 거부 사유 모달 */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectTarget(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">인증 거부</h3>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="거부 사유를 입력해주세요..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50"
              >
                {rejectMutation.isPending ? '처리 중...' : '거부'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
