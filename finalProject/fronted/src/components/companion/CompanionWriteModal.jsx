import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateCompanion } from '../../api/useCompanion';

export default function CompanionWriteModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    travelDate: '',
    maxMembers: 4,
    tags: '',
    imageUrl: '',
  });

  const createMutation = useCreateCompanion();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync(form);
      if (result.success) {
        alert('작성 완료!');
        setForm({ title: '', content: '', travelDate: '', maxMembers: 4, tags: '', imageUrl: '' });
        onClose();
      } else {
        alert(result.message || '작성 실패');
      }
    } catch {
      alert('작성 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">동행 모집글 작성</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예: 2/15 우도 같이 자전거 타실 분!"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              placeholder="동행에 대한 상세 내용을 작성해주세요"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* 여행일자 + 최대인원 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">여행 일자</label>
              <input
                type="text"
                name="travelDate"
                value={form.travelDate}
                onChange={handleChange}
                placeholder="예: 2.15(토)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">최대 인원</label>
              <select
                name="maxMembers"
                value={form.maxMembers}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
              >
                {[2, 3, 4, 5, 6, 8, 10].map(n => (
                  <option key={n} value={n}>{n}명</option>
                ))}
              </select>
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">태그</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="쉼표로 구분 (예: 우도, 자전거, 일출)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
            />
            {form.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.split(',').filter(t => t.trim()).map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">이미지 URL (선택)</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-xl" onError={(e) => e.target.style.display = 'none'} />
            )}
          </div>

          {/* 제출 */}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all disabled:opacity-50 shadow-lg shadow-sky-200"
          >
            {createMutation.isPending ? '작성 중...' : '모집글 작성'}
          </button>
        </form>
      </div>
    </div>
  );
}
