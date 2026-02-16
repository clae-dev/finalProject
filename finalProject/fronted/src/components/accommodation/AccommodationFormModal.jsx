import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

const ACCOMMODATION_TYPES = [
  '호텔', '리조트', '펜션', '풀빌라', '게스트하우스', '호스텔', '모텔', '민박', '한옥', '기타',
];
const REGIONS = ['제주시', '서귀포시'];

const INITIAL_FORM = {
  name: '',
  address: '',
  phone: '',
  accommodationType: '호텔',
  region: '제주시',
  priceMin: '',
  priceMax: '',
  checkInTime: '',
  checkOutTime: '',
  facilities: '',
  thumbnailUrl: '',
  latitude: '',
  longitude: '',
  recommendationReason: '',
};

export default function AccommodationFormModal({ isOpen, onClose, editTarget, onSubmit, isPending }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);

  // editTarget 변경 시 폼 초기화
  useEffect(() => {
    if (editTarget) {
      setForm({
        name: editTarget.name || '',
        address: editTarget.address || '',
        phone: editTarget.phone || '',
        accommodationType: editTarget.accommodationType || '호텔',
        region: editTarget.region || '제주시',
        priceMin: editTarget.priceMin ?? '',
        priceMax: editTarget.priceMax ?? '',
        checkInTime: editTarget.checkInTime || '',
        checkOutTime: editTarget.checkOutTime || '',
        facilities: editTarget.facilities || '',
        thumbnailUrl: editTarget.thumbnailUrl || '',
        latitude: editTarget.latitude ?? '',
        longitude: editTarget.longitude ?? '',
        recommendationReason: editTarget.recommendationReason || '',
      });
      setThumbnailPreview(editTarget.thumbnailUrl || '');
      setExistingImages(editTarget.imageUrls || []);
      setKeepExistingImages(true);
    } else {
      setForm(INITIAL_FORM);
      setThumbnailPreview('');
      setExistingImages([]);
      setKeepExistingImages(true);
    }
    setThumbnailFile(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  }, [editTarget, isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, thumbnailUrl: '' }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImages = () => {
    setExistingImages([]);
    setKeepExistingImages(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      alert('숙소명과 주소는 필수 입력 항목입니다.');
      return;
    }

    const formData = new FormData();
    // 텍스트 필드
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // 썸네일 파일
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    // 갤러리 이미지 파일
    galleryFiles.forEach((file) => {
      formData.append('images', file);
    });

    // 수정 시 기존 이미지 유지 여부
    if (editTarget) {
      formData.append('keepExistingImages', keepExistingImages);
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        >
          {/* 모달 헤더 */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-sky-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
            <h2 className="text-lg font-bold text-slate-700" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              {editTarget ? '숙소 수정' : '숙소 추가'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* 모달 폼 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            {/* 숙소명 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">숙소명 *</label>
              <input
                name="name" value={form.name} onChange={handleFormChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="숙소명을 입력하세요"
              />
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">주소 *</label>
              <input
                name="address" value={form.address} onChange={handleFormChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="주소를 입력하세요"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">전화번호</label>
              <input
                name="phone" value={form.phone} onChange={handleFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="064-000-0000"
              />
            </div>

            {/* 유형 + 지역 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">유형</label>
                <select
                  name="accommodationType" value={form.accommodationType} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {ACCOMMODATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">지역</label>
                <select
                  name="region" value={form.region} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* 가격 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">최소 가격</label>
                <input
                  name="priceMin" type="number" value={form.priceMin} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">최대 가격</label>
                <input
                  name="priceMax" type="number" value={form.priceMax} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="200000"
                />
              </div>
            </div>

            {/* 체크인/아웃 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">체크인 시간</label>
                <input
                  name="checkInTime" value={form.checkInTime} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="15:00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">체크아웃 시간</label>
                <input
                  name="checkOutTime" value={form.checkOutTime} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="11:00"
                />
              </div>
            </div>

            {/* 편의시설 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">편의시설</label>
              <input
                name="facilities" value={form.facilities} onChange={handleFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="Wi-Fi, 주차장, 수영장, 조식 등"
              />
            </div>

            {/* 썸네일 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">썸네일 이미지</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 cursor-pointer hover:bg-sky-50 transition-colors">
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-sky-500">파일 선택</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                  <div className="mt-2">
                    <input
                      name="thumbnailUrl"
                      value={form.thumbnailUrl}
                      onChange={(e) => {
                        handleFormChange(e);
                        if (e.target.value) {
                          setThumbnailFile(null);
                          setThumbnailPreview(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                      placeholder="또는 URL 직접 입력"
                    />
                  </div>
                </div>
                {thumbnailPreview && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-sky-100 flex-shrink-0">
                    <img src={thumbnailPreview} alt="썸네일" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 갤러리 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">갤러리 이미지</label>

              {/* 기존 이미지 (수정 시) */}
              {existingImages.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">기존 이미지 ({existingImages.length}장)</span>
                    <button type="button" onClick={handleRemoveExistingImages}
                      className="text-xs text-red-400 hover:text-red-500 transition-colors">
                      전체 삭제
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={url} alt={`기존 ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 cursor-pointer hover:bg-emerald-50 transition-colors">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-500">갤러리 이미지 추가 (다중 선택)</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
              </label>

              {galleryPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {galleryPreviews.map((preview, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-200 relative group">
                      <img src={preview} alt={`새 ${idx + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryFile(idx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 위도/경도 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">위도</label>
                <input
                  name="latitude" type="number" step="any" value={form.latitude} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="33.4996"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">경도</label>
                <input
                  name="longitude" type="number" step="any" value={form.longitude} onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="126.5312"
                />
              </div>
            </div>

            {/* 추천 이유 */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">추천 이유</label>
              <textarea
                name="recommendationReason" value={form.recommendationReason} onChange={handleFormChange} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                placeholder="이 숙소를 추천하는 이유를 작성하세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                취소
              </button>
              <button type="submit" disabled={isPending}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-sky-400 to-cyan-400 shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? '저장 중...' : editTarget ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
