import React, { useState } from 'react';
import { X, User, Search } from 'lucide-react';
import { useSearchTarget } from '../../api/chatting/useChatting';

/**
 * 새 메시지 검색 모달
 * - 받는 사람 검색/선택
 * - 메시지 내용 입력
 * - 채팅 시작
 */
export default function ChatSearchModal({ onClose, onSelectTarget }) {
  const [query, setQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [message, setMessage] = useState('');
  const { data, isLoading } = useSearchTarget(query);

  const results = data?.success ? (data.data || []) : [];

  const handleSelect = (target) => {
    setSelectedTarget(target);
    setQuery('');
  };

  const handleRemoveTarget = () => {
    setSelectedTarget(null);
  };

  const handleSubmit = () => {
    if (!selectedTarget) return;
    onSelectTarget(selectedTarget, message.trim());
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

        {/* 받는 사람 */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-900 flex-shrink-0">받는 사람:</span>
          {selectedTarget ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold">
              {selectedTarget.nickname}
              <button onClick={handleRemoveTarget} className="hover:text-sky-800 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="닉네임 또는 이메일 검색..."
                autoFocus
                className="w-full text-sm py-1 focus:outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>
          )}
        </div>

        {/* 검색 결과 (받는 사람 미선택 시) */}
        {!selectedTarget && (
          <div className="max-h-48 overflow-y-auto border-b border-slate-200">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                검색 중...
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                계정을 찾을 수 없습니다.
              </div>
            )}

            {!query && !isLoading && (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                <Search className="w-4 h-4 mr-1.5" />
                닉네임 또는 이메일을 검색하세요
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
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{target.nickname}</p>
                  <p className="text-xs text-slate-500 truncate">{target.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 메시지 입력 */}
        <div className="px-4 py-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            rows={4}
            className="w-full text-sm p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 placeholder:text-slate-400 bg-slate-50/50"
          />
        </div>

        {/* 채팅 시작 버튼 */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedTarget}
            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${
              selectedTarget
                ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            채팅 시작
          </button>
        </div>
      </div>
    </div>
  );
}
