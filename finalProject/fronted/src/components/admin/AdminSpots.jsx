import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Pencil, Trash2, X, Upload, Link } from 'lucide-react';
import {
  useAllSpots,
  useCreateSpot,
  useUpdateSpot,
  useDeleteSpot,
  useUpdateSpotStatus,
} from '../../api/spot/useSpot';

const TAG_OPTIONS = ['🔥 인기', '🏖 해변', '🌅 일출', '🚲 우도', '🌴 자연', '🏛 문화', '🍊 체험'];
const SIZE_OPTIONS = [
  { value: 'large', label: '크게 (2x2)' },
  { value: 'small', label: '보통 (1x1)' },
];

function SpotFormModal({ isOpen, onClose, editTarget, isPending, onSubmit }) {
  const [form, setForm] = useState({
    spotTitle: '',
    spotDesc: '',
    spotLocation: '',
    spotTag: '🔥 인기',
    spotOrder: 0,
    spotSize: 'small',
  });
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'file'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (editTarget) {
        setForm({
          spotTitle: editTarget.spotTitle || '',
          spotDesc: editTarget.spotDesc || '',
          spotLocation: editTarget.spotLocation || '',
          spotTag: editTarget.spotTag || '🔥 인기',
          spotOrder: editTarget.spotOrder || 0,
          spotSize: editTarget.spotSize || 'small',
        });
        const existingImage = editTarget.spotImage || '';
        if (existingImage.startsWith('http')) {
          setImageMode('url');
          setImageUrl(existingImage);
        } else {
          setImageMode('url');
          setImageUrl(existingImage);
        }
        setImagePreview(existingImage);
        setImageFile(null);
      } else {
        setForm({ spotTitle: '', spotDesc: '', spotLocation: '', spotTag: '🔥 인기', spotOrder: 0, spotSize: 'small' });
        setImageMode('url');
        setImageUrl('');
        setImageFile(null);
        setImagePreview('');
      }
    }
  }, [isOpen, editTarget]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageMode('file');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.spotTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('spotTitle', form.spotTitle);
    if (form.spotDesc) formData.append('spotDesc', form.spotDesc);
    if (form.spotLocation) formData.append('spotLocation', form.spotLocation);
    if (form.spotTag) formData.append('spotTag', form.spotTag);
    formData.append('spotOrder', form.spotOrder);
    formData.append('spotSize', form.spotSize);

    if (imageMode === 'file' && imageFile) {
      formData.append('spotImage', imageFile);
    } else if (imageUrl) {
      formData.append('spotImageUrl', imageUrl);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-sky-50">
            <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              {editTarget ? '명소 수정' : '명소 추가'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                제목 *
              </label>
              <input
                type="text"
                value={form.spotTitle}
                onChange={(e) => setForm({ ...form, spotTitle: e.target.value })}
                placeholder="월정리 해변"
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                required
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                설명
              </label>
              <input
                type="text"
                value={form.spotDesc}
                onChange={(e) => setForm({ ...form, spotDesc: e.target.value })}
                placeholder="에메랄드빛 투명한 바다"
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>

            {/* 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                이미지
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'url' ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" /> URL 입력
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'file' ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> 파일 업로드
                </button>
              </div>

              {imageMode === 'url' ? (
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); setImageFile(null); }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              ) : (
                <label className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-sky-200 rounded-xl cursor-pointer hover:bg-sky-50 transition-colors">
                  <Upload className="w-4 h-4 text-sky-400" />
                  <span className="text-sm text-sky-500 font-medium">
                    {imageFile ? imageFile.name : '클릭하여 이미지 선택'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              {imagePreview && (
                <div className="mt-3 rounded-xl overflow-hidden border border-sky-100">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* 태그 + 크기 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  태그
                </label>
                <select
                  value={form.spotTag}
                  onChange={(e) => setForm({ ...form, spotTag: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  카드 크기
                </label>
                <select
                  value={form.spotSize}
                  onChange={(e) => setForm({ ...form, spotSize: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 정렬 순서 + 위치 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  정렬 순서
                </label>
                <input
                  type="number"
                  value={form.spotOrder}
                  onChange={(e) => setForm({ ...form, spotOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  위치
                </label>
                <input
                  type="text"
                  value={form.spotLocation}
                  onChange={(e) => setForm({ ...form, spotLocation: e.target.value })}
                  placeholder="제주시 구좌읍"
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? '저장 중...' : (editTarget ? '수정' : '등록')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminSpots() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const { data, isLoading } = useAllSpots();
  const createSpot = useCreateSpot();
  const updateSpot = useUpdateSpot();
  const deleteSpot = useDeleteSpot();
  const updateStatus = useUpdateSpotStatus();

  const list = data?.success ? (data.data || []) : [];

  const openAddModal = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleModalSubmit = (formData) => {
    if (editTarget) {
      updateSpot.mutate(
        { spotNo: editTarget.spotNo, formData },
        { onSuccess: (res) => { if (res?.success) closeModal(); else alert(res?.message || '수정 실패'); } }
      );
    } else {
      createSpot.mutate(formData, {
        onSuccess: (res) => { if (res?.success) closeModal(); else alert(res?.message || '추가 실패'); },
      });
    }
  };

  const handleDelete = (item) => {
    if (!confirm(`"${item.spotTitle}" 명소를 삭제하시겠습니까?`)) return;
    deleteSpot.mutate(item.spotNo);
  };

  const handleStatusToggle = (item) => {
    const newStatus = item.spotStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'INACTIVE' ? '비활성화' : '활성화';
    if (!confirm(`"${item.spotTitle}" 명소를 ${action}하시겠습니까?`)) return;
    updateStatus.mutate({ spotNo: item.spotNo, status: newStatus });
  };

  const isMutating = createSpot.isPending || updateSpot.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">명소 목록을 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 바 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center justify-between"
      >
        <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          총 <span className="font-bold text-sky-600">{list.length}</span>개 명소
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          <Plus className="w-4 h-4" />
          명소 추가
        </button>
      </motion.div>

      {/* 카드 그리드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {list.map((item) => (
          <div
            key={item.spotNo}
            className={`group relative rounded-2xl overflow-hidden shadow-lg shadow-sky-100/50 border border-sky-50 bg-white ${
              item.spotSize === 'large' ? 'sm:col-span-2 sm:row-span-2' : ''
            }`}
          >
            {/* 이미지 */}
            <div className={`relative ${item.spotSize === 'large' ? 'h-64' : 'h-40'}`}>
              {item.spotImage ? (
                <img
                  src={item.spotImage}
                  alt={item.spotTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">No Image</text></svg>'; }}
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                  이미지 없음
                </div>
              )}
              {/* 상태 뱃지 */}
              <div className="absolute top-2 left-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  item.spotStatus === 'ACTIVE'
                    ? 'bg-emerald-100/90 text-emerald-600'
                    : 'bg-red-100/90 text-red-500'
                }`}>
                  {item.spotStatus === 'ACTIVE' ? '활성' : '비활성'}
                </span>
              </div>
              {/* 태그 */}
              {item.spotTag && (
                <div className="absolute top-2 right-2">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-slate-700">
                    {item.spotTag}
                  </span>
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                    {item.spotTitle}
                  </h4>
                  {item.spotDesc && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{item.spotDesc}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span>순서: {item.spotOrder}</span>
                    <span>|</span>
                    <span>{item.spotSize === 'large' ? '크게' : '보통'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleStatusToggle(item)}
                    disabled={updateStatus.isPending}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      item.spotStatus === 'ACTIVE'
                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                    }`}
                  >
                    {item.spotStatus === 'ACTIVE' ? '숨기기' : '보이기'}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
                    title="수정"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleteSpot.isPending}
                    className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-slate-400 text-sm mb-4">등록된 명소가 없습니다.</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg"
            >
              <Plus className="w-4 h-4" /> 첫 명소 추가하기
            </button>
          </div>
        )}
      </motion.div>

      {/* 모달 */}
      <SpotFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editTarget={editTarget}
        isPending={isMutating}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
