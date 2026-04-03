import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  useAdminNoticeList,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from '../../api/notice/useNotice';

function AdminNotices() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const size = 10;

  const { data, isLoading } = useAdminNoticeList(page, size, search);
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCreate = () => {
    setEditingNotice(null);
    setModalOpen(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const handleDelete = (notice) => {
    if (!confirm(`"${notice.boardTitle}" 공지를 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(notice.boardNo);
  };

  const handleModalSubmit = (formData) => {
    if (editingNotice) {
      updateMutation.mutate({ boardNo: editingNotice.boardNo, ...formData }, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setModalOpen(false),
      });
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
      {/* 검색바 + 작성 버튼 */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목으로 검색"
            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 font-pretendard"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 font-pretendard"
        >
          검색
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 font-pretendard"
        >
          <Plus className="w-4 h-4" />
          공지 작성
        </button>
      </motion.form>

      {/* 테이블 */}
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">조회수</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">작성일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.boardNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-500">{item.boardNo}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[250px] truncate">{item.boardTitle}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.readCount}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.boardDelFl === 'N'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {item.boardDelFl === 'N' ? '게시' : '삭제'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-400">{item.createdAt || '-'}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-xl text-sky-400 hover:bg-sky-50 hover:text-sky-500 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">등록된 공지사항이 없습니다.</td>
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

      {/* 작성/수정 모달 */}
      <AnimatePresence>
        {modalOpen && (
          <NoticeModal
            editingNotice={editingNotice}
            onClose={() => setModalOpen(false)}
            onSubmit={handleModalSubmit}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NoticeModal({ editingNotice, onClose, onSubmit, isPending }) {
  const [boardTitle, setBoardTitle] = useState(editingNotice?.boardTitle || '');
  const [boardContent, setBoardContent] = useState(editingNotice?.boardContent || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ boardTitle, boardContent });
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-black text-slate-800 font-pretendard"
          >
            {editingNotice ? '공지 수정' : '공지 작성'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 font-pretendard">
              제목
            </label>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 font-pretendard"
              placeholder="공지 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 font-pretendard">
              내용
            </label>
            <textarea
              value={boardContent}
              onChange={(e) => setBoardContent(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none font-pretendard"
              placeholder="공지 내용을 입력하세요"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors font-pretendard"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 font-pretendard"
            >
              {isPending ? '처리중...' : editingNotice ? '수정' : '작성'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(AdminNotices);
