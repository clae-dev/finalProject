import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAdminMembers, useUpdateMemberStatus } from '../../api/useAdmin';

export default function AdminMembers() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('nickname');
  const size = 10;

  const { data, isLoading } = useAdminMembers(page, size, search, searchType);
  const updateStatus = useUpdateMemberStatus();

  const members = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusToggle = (member) => {
    const newStatus = member.memberStatus === 'A' ? 'S' : 'A';
    const action = newStatus === 'S' ? '정지' : '활성화';
    if (!confirm(`${member.memberNickname} 회원을 ${action}하시겠습니까?`)) return;
    updateStatus.mutate({ memberNo: member.memberNo, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">회원 목록을 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex flex-wrap items-center gap-3"
      >
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-sky-100 text-sm font-semibold text-slate-600 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-sky-300"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          <option value="nickname">닉네임</option>
          <option value="email">이메일</option>
          <option value="name">이름</option>
        </select>
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="검색어를 입력하세요"
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

      {/* 테이블 */}
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">번호</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">프로필</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">닉네임</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">이메일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">가입일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.memberNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-500">{member.memberNo}</td>
                  <td className="px-6 py-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                      {member.memberProfileImg ? (
                        <img src={member.memberProfileImg} alt="" className="w-full h-full object-cover" />
                      ) : (
                        member.memberNickname?.[0] || '?'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700">{member.memberNickname}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{member.memberEmail}</td>
                  <td className="px-6 py-3 text-sm text-slate-400">{member.createdAt ? String(member.createdAt).substring(0, 10) : ''}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      member.memberStatus === 'A'
                        ? 'bg-emerald-100 text-emerald-600'
                        : member.memberStatus === 'S'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {member.memberStatus === 'A' ? '활성' : member.memberStatus === 'S' ? '정지' : member.memberStatus === 'W' ? '탈퇴' : member.memberStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {member.memberRole !== 'A' && member.memberStatus !== 'W' && (
                      <button
                        onClick={() => handleStatusToggle(member)}
                        disabled={updateStatus.isPending}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          member.memberStatus === 'A'
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                        }`}
                      >
                        {member.memberStatus === 'A' ? '정지' : '활성화'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
    </div>
  );
}
