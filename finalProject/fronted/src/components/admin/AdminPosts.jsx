import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Star } from 'lucide-react';
import {
  useAdminCompanions,
  useDeleteAdminCompanion,
  useAdminReviews,
  useDeleteAdminReview,
  useAdminAccommodationReviews,
  useDeleteAdminAccommodationReview,
  useApproveAccommodationReview,
  useRejectAccommodationReview,
} from '../../api/admin/useAdmin';

function formatTravelDate(travelDate) {
  if (!travelDate) return '';
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    return `${d.getMonth() + 1}.${d.getDate()}(${days[d.getDay()]})`;
  }
  return travelDate;
}

const SUB_TABS = [
  { key: 'companions', label: '동행 게시글' },
  { key: 'reviews', label: '동행 후기' },
  { key: 'accomReviews', label: '숙소 후기' },
];

export default function AdminPosts() {
  const [subTab, setSubTab] = useState('companions');

  return (
    <div className="space-y-6">
      {/* 서브 탭 */}
      <div className="flex gap-2">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              subTab === tab.key
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                : 'bg-white text-slate-500 hover:text-sky-600 shadow-sm border border-sky-100'
            }`}
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'companions' && <CompanionTable />}
      {subTab === 'reviews' && <ReviewTable />}
      {subTab === 'accomReviews' && <AccommodationReviewTable />}
    </div>
  );
}

function CompanionTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const size = 10;

  const { data, isLoading } = useAdminCompanions(page, size, search);
  const deleteMutation = useDeleteAdminCompanion();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (item) => {
    if (!confirm(`"${item.title}" 게시글을 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(item.companionNo);
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
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} onSubmit={handleSearch} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">번호</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">제목</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">작성자</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">여행일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">인원</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">삭제</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.companionNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-500">{item.companionNo}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[200px] truncate">{item.title}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.authorNickname}</td>
                  <td className="px-6 py-3 text-sm text-slate-400">{formatTravelDate(item.travelDate) || '-'}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.currentMembers}/{item.maxMembers}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Y' ? 'bg-emerald-100 text-emerald-600'
                        : item.status === 'C' ? 'bg-amber-100 text-amber-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status === 'Y' ? '활성' : item.status === 'C' ? '마감' : item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

function ReviewTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const size = 10;

  const { data, isLoading } = useAdminReviews(page, size, search);
  const deleteMutation = useDeleteAdminReview();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (item) => {
    if (!confirm(`"${item.title}" 후기를 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(item.reviewNo);
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
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} onSubmit={handleSearch} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">번호</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">제목</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">작성자</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">별점</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">등록일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">삭제</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.reviewNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-500">{item.reviewNo}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[200px] truncate">{item.title}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.authorNickname}</td>
                  <td className="px-6 py-3 text-sm text-amber-500 font-bold">{'★'.repeat(item.rating || 0)}</td>
                  <td className="px-6 py-3 text-sm text-slate-400">{item.createdAt || '-'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">후기가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

function AccommodationReviewTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const size = 10;

  const { data, isLoading } = useAdminAccommodationReviews(page, size, search);
  const deleteMutation = useDeleteAdminAccommodationReview();
  const approveMutation = useApproveAccommodationReview();
  const rejectMutation = useRejectAccommodationReview();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (item) => {
    if (!confirm(`이 숙소 후기를 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(item.reviewNo);
  };

  const handleApprove = (item) => {
    if (!confirm(`인증서류를 승인하시겠습니까? 작성자에게 인증 리뷰어 뱃지가 부여됩니다.`)) return;
    approveMutation.mutate(item.reviewNo);
  };

  const handleReject = (item) => {
    if (!confirm(`인증서류를 반려하시겠습니까?`)) return;
    rejectMutation.mutate(item.reviewNo);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'A': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">공개</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">{status}</span>;
    }
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
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} onSubmit={handleSearch} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">번호</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">숙소</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">내용</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">작성자</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">별점</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">등록일</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.reviewNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm text-slate-500">{item.reviewNo}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-700 max-w-[130px] truncate">{item.accommodationName}</td>
                  <td className="px-5 py-3 text-sm text-slate-500 max-w-[180px] truncate">{item.content}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{item.authorNickname}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-amber-500">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{item.createdAt || '-'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {item.verifiedReviewer === 'Y' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">인증됨</span>
                      )}
                      {item.verificationFile && item.verifiedReviewer !== 'Y' && (
                        <>
                          <button
                            onClick={() => setViewingFile(item.verificationFile)}
                            className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-50 hover:text-sky-600 transition-all"
                            title="인증서류 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(item)}
                            disabled={approveMutation.isPending}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                            title="인증 승인"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(item)}
                            disabled={rejectMutation.isPending}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-all"
                            title="인증 반려"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">숙소 후기가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* 인증서류 미리보기 모달 */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingFile(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 max-w-2xl max-h-[80vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">인증서류</h3>
              <button onClick={() => setViewingFile(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>
            <img src={viewingFile} alt="인증서류" loading="lazy" className="max-w-full rounded-lg" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SearchBar({ searchInput, setSearchInput, onSubmit }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="제목 또는 작성자로 검색"
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
  );
}

function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;
  return (
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
  );
}
