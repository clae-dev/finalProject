import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Flag, X, Eye } from 'lucide-react';
import { useAdminReports, useAdminReportDetail, useUpdateReportStatus } from '../../api/admin/useAdmin';

/** 신고 대상 유형 필터 탭 — 댓글(COMMENT) 포함 */
const TARGET_TYPE_TABS = [
  { key: '', label: '전체' },
  { key: 'FREEBOARD', label: '자유게시판' },
  { key: 'COMPANION', label: '동행' },
  { key: 'REVIEW', label: '후기' },
  { key: 'COMMENT', label: '댓글' },
];

const STATUS_FILTERS = [
  { key: '', label: '전체' },
  { key: 'P', label: '대기' },
  { key: 'I', label: '검토중' },
  { key: 'C', label: '완료' },
  { key: 'R', label: '반려' },
];

const STATUS_BADGE = {
  P: { label: '대기', cls: 'bg-amber-100 text-amber-600' },
  I: { label: '검토중', cls: 'bg-sky-100 text-sky-600' },
  C: { label: '완료', cls: 'bg-emerald-100 text-emerald-600' },
  R: { label: '반려', cls: 'bg-red-100 text-red-500' },
};

/**
 * 신고 유형 → 한글 라벨 매핑
 * - 공통: SPAM, ABUSE, FALSE_INFO, ADULT, ETC
 * - 동행 전용: NO_SHOW(노쇼), FRAUD(사기), DANGEROUS(위험 행위)
 */
const REPORT_TYPE_LABEL = {
  SPAM: '스팸/광고',
  ABUSE: '욕설/비방',
  FALSE_INFO: '허위정보',
  ADULT: '성인콘텐츠',
  NO_SHOW: '노쇼/잠수',
  FRAUD: '사기/금전 요구',
  DANGEROUS: '위험 행위/안전 위협',
  ETC: '기타',
};

/** 신고 대상 유형 → 한글 라벨 매핑 */
const TARGET_TYPE_LABEL = {
  FREEBOARD: '자유게시판',
  COMPANION: '동행',
  REVIEW: '후기',
  COMMENT: '댓글',
};

function AdminReports() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [selectedReportNo, setSelectedReportNo] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editResult, setEditResult] = useState('');
  const size = 10;

  const { data, isLoading } = useAdminReports(page, size, statusFilter, targetTypeFilter);
  const { data: detailData } = useAdminReportDetail(selectedReportNo);
  const updateStatus = useUpdateReportStatus();

  const reports = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);
  const detail = detailData?.success ? detailData.data : null;

  const handleOpenDetail = (reportNo, currentStatus, currentResult) => {
    setSelectedReportNo(reportNo);
    setEditStatus(currentStatus);
    setEditResult(currentResult || '');
  };

  const handleCloseDetail = () => {
    setSelectedReportNo(null);
    setEditStatus('');
    setEditResult('');
  };

  // 모달 열릴 때 body 스크롤 완전 잠금 (위치 고정)
  useEffect(() => {
    if (selectedReportNo) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedReportNo]);

  const handleUpdateStatus = async () => {
    if (!editStatus) return;
    try {
      const r = await updateStatus.mutateAsync({ reportNo: selectedReportNo, status: editStatus, result: editResult });
      if (r.success) { alert('처리되었습니다.'); handleCloseDetail(); }
      else alert(r.message);
    } catch { alert('처리 중 오류가 발생했습니다.'); }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">신고 목록을 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 space-y-3"
      >
        {/* 대상 유형 필터 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 font-pretendard">대상:</span>
          {TARGET_TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setTargetTypeFilter(tab.key); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                targetTypeFilter === tab.key
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200/50'
                  : 'bg-sky-50 text-slate-500 hover:bg-sky-100'
              }`}
              className="font-pretendard"
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* 상태 필터 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 font-pretendard">상태:</span>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setStatusFilter(f.key); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === f.key
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200/50'
                  : 'bg-sky-50 text-slate-500 hover:bg-sky-100'
              }`}
              className="font-pretendard"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">번호</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">대상</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">게시글 제목</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">신고유형</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">신고자</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">등록일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const badge = STATUS_BADGE[report.status] || { label: report.status, cls: 'bg-slate-100 text-slate-500' };
                return (
                  <tr key={report.reportNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-slate-500">{report.reportNo}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-600">
                        {TARGET_TYPE_LABEL[report.targetType] || report.targetType}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[200px] truncate">
                      {report.targetTitle || '(삭제됨)'}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {REPORT_TYPE_LABEL[report.reportType] || report.reportType}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">{report.reporterNickname}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-400">{report.createdAt}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleOpenDetail(report.reportNo, report.status, report.result)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        상세
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">신고 내역이 없습니다.</td>
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

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedReportNo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={handleCloseDetail}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-800 font-pretendard">신고 상세</h3>
                </div>
                <button onClick={handleCloseDetail} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {detail ? (
                <div className="space-y-5">
                  {/* 신고 정보 */}
                  <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">신고번호</span>
                      <span className="text-sm font-semibold text-slate-700">#{detail.reportNo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">대상</span>
                      <span className="text-sm font-semibold text-slate-700">{TARGET_TYPE_LABEL[detail.targetType] || detail.targetType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">게시글 제목</span>
                      <span className="text-sm font-semibold text-slate-700 max-w-[250px] truncate">{detail.targetTitle || '(삭제됨)'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">게시글 작성자</span>
                      <span className="text-sm font-semibold text-slate-700">{detail.targetAuthorNickname || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">신고 유형</span>
                      <span className="text-sm font-semibold text-orange-600">{REPORT_TYPE_LABEL[detail.reportType] || detail.reportType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">신고자</span>
                      <span className="text-sm font-semibold text-slate-700">{detail.reporterNickname}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">등록일</span>
                      <span className="text-sm text-slate-500">{detail.createdAt}</span>
                    </div>
                    {detail.detailReason && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 block mb-1">상세 사유</span>
                        <p className="text-sm text-slate-600 bg-white rounded-xl p-3 border border-slate-100">{detail.detailReason}</p>
                      </div>
                    )}
                  </div>

                  {/* 처리 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 block font-pretendard">상태 변경</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-300 font-pretendard"
                    >
                      <option value="P">대기</option>
                      <option value="I">검토중</option>
                      <option value="C">완료</option>
                      <option value="R">반려</option>
                    </select>

                    <label className="text-sm font-bold text-slate-700 block font-pretendard">처리 결과</label>
                    <textarea
                      value={editResult}
                      onChange={(e) => setEditResult(e.target.value)}
                      placeholder="처리 결과를 입력하세요 (선택)"
                      maxLength={1000}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none font-pretendard"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseDetail}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                      닫기
                    </button>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updateStatus.isPending}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-sky-200/50 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {updateStatus.isPending ? '처리 중...' : '저장'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(AdminReports);
