import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useSearchTarget } from '../../api/useChatting';

/**
 * 새 메시지 검색 모달 (Instagram 스타일)
 */
export default function ChatSearchModal({ onClose, onSelectTarget }) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchTarget(query);

  const results = data?.success ? (data.data || []) : [];

  const handleSelect = (target) => {
    onSelectTarget(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="w-8" />
          <h3 className="text-base font-bold text-slate-900">새로운 메시지</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        {/* 받는 사람 검색 */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-900 flex-shrink-0">받는 사람:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색..."
            autoFocus
            className="flex-1 text-sm py-1 focus:outline-none placeholder:text-slate-400 bg-transparent"
          />
        </div>

        {/* 검색 결과 */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
              검색 중...
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
              계정을 찾을 수 없습니다.
            </div>
          )}

          {!query && !isLoading && (
            <div className="px-4 py-3">
              <p className="text-sm font-bold text-slate-900 mb-3">추천</p>
              <div className="flex items-center justify-center py-6 text-slate-400 text-sm">
                닉네임 또는 이메일을 검색하세요
              </div>
            </div>
          )}

          {results.map((target) => (
            <div
              key={target.memberNo}
              onClick={() => handleSelect(target)}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {target.profileImage ? (
                <img
                  src={target.profileImage}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{target.nickname}</p>
                <p className="text-sm text-slate-500 truncate">{target.email}</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* 채팅 버튼 */}
        <div className="px-4 py-3 border-t border-slate-200">
          <button
            disabled
            className="w-full py-2.5 bg-sky-200 text-white text-sm font-bold rounded-lg cursor-not-allowed"
          >
            채팅
          </button>
        </div>
      </div>
    </div>
  );
}
