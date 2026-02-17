import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useAdminAccommodations,
  useUpdateAccommodationStatus,
  useCreateAccommodation,
  useUpdateAccommodation,
  useDeleteAccommodation,
} from '../../api/admin/useAdmin';
import { getAccommodationDetail } from '../../api/accommodation/accommodationAPI';
import AccommodationFormModal from '../accommodation/AccommodationFormModal';

export default function AdminAccommodations() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const size = 10;

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const { data, isLoading } = useAdminAccommodations(page, size, search);
  const updateStatus = useUpdateAccommodationStatus();
  const createAccom = useCreateAccommodation();
  const updateAccom = useUpdateAccommodation();
  const deleteAccom = useDeleteAccommodation();

  const list = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusToggle = (item) => {
    const newStatus = item.status === 'A' ? 'C' : 'A';
    const action = newStatus === 'C' ? '비활성화' : '활성화';
    if (!confirm(`"${item.name}" 숙소를 ${action}하시겠습니까?`)) return;
    updateStatus.mutate({ accommodationNo: item.accommodationNo, status: newStatus });
  };

  const openAddModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const [editLoading, setEditLoading] = useState(false);

  const openEditModal = async (item) => {
    setEditLoading(true);
    try {
      const res = await getAccommodationDetail(item.accommodationNo);
      if (res?.success && res.data) {
        setEditTarget(res.data);
      } else {
        setEditTarget(item);
      }
    } catch {
      setEditTarget(item);
    }
    setEditLoading(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleModalSubmit = (formData) => {
    if (editTarget) {
      updateAccom.mutate(
        { accommodationNo: editTarget.accommodationNo, formData },
        { onSuccess: (res) => { if (res?.success) closeModal(); else alert(res?.message || '수정 실패'); } }
      );
    } else {
      createAccom.mutate(formData, {
        onSuccess: (res) => { if (res?.success) closeModal(); else alert(res?.message || '추가 실패'); },
      });
    }
  };

  const handleDelete = (item) => {
    if (!confirm(`"${item.name}" 숙소를 삭제하시겠습니까?\n(소프트 삭제 — 상태가 'N'으로 변경됩니다)`)) return;
    deleteAccom.mutate(item.accommodationNo);
  };

  const isMutating = createAccom.isPending || updateAccom.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">숙소 목록을 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 + 추가 버튼 */}
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
            placeholder="숙소명 또는 지역으로 검색"
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
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          <Plus className="w-4 h-4" />
          숙소 추가
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">이름</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">지역</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">타입</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">상태</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.accommodationNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-500">{item.accommodationNo}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700 max-w-[200px] truncate">{item.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.region || '-'}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{item.accommodationType || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'A' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status === 'A' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusToggle(item)}
                        disabled={updateStatus.isPending}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          item.status === 'A'
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                        }`}
                      >
                        {item.status === 'A' ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
                        title="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleteAccom.isPending}
                        className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
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
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">숙소가 없습니다.</td>
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

      {/* 공유 모달 (이미지 업로드 지원) */}
      <AccommodationFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editTarget={editTarget}
        isPending={isMutating}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
