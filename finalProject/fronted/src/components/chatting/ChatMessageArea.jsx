import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Info, Phone, Video, Image, Heart, Smile } from 'lucide-react';

/**
 * 채팅 메시지 영역 (Instagram DM 스타일)
 */
function ChatMessageArea({
  messages,
  currentMemberNo,
  targetNickName,
  targetProfile,
  onSendMessage,
  hideHeader,
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue, onSendMessage]);

  // Enter = 전송, Shift+Enter = 줄바꿈
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }, []);

  // 메시지 그룹핑 (연속 같은 사람이면 아바타 숨김)
  const shouldShowAvatar = useCallback((idx) => {
    if (idx === 0) return true;
    const prev = messages[idx - 1];
    const curr = messages[idx];
    return prev.senderNo !== curr.senderNo;
  }, [messages]);

  // 마지막 연속 메시지인지 (시간 표시용)
  const isLastInGroup = useCallback((idx) => {
    if (idx === messages.length - 1) return true;
    const next = messages[idx + 1];
    const curr = messages[idx];
    return next.senderNo !== curr.senderNo;
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 상단 헤더 - IG 스타일 */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {targetProfile ? (
              <img
                src={targetProfile}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{targetNickName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Phone className="w-5 h-5 text-slate-900" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Video className="w-5 h-5 text-slate-900" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Info className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
        {/* 프로필 소개 영역 */}
        {messages && messages.length === 0 && (
          <div className="flex flex-col items-center pt-8 pb-6">
            {targetProfile ? (
              <img src={targetProfile} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-24 h-24 rounded-full object-cover border border-slate-200 mb-4" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-slate-400" />
              </div>
            )}
            <p className="text-lg font-bold text-slate-900">{targetNickName}</p>
            <p className="text-sm text-slate-500 mt-1">HONDI</p>
          </div>
        )}

        {/* 메시지 목록 */}
        <div className="space-y-0.5">
          {messages && messages.map((msg, idx) => {
            const isMine = msg.senderNo === currentMemberNo;
            const showAvatar = shouldShowAvatar(idx);
            const lastInGroup = isLastInGroup(idx);

            return (
              <div key={msg.messageNo || idx}>
                {/* 날짜 구분 (첫 메시지만) */}
                {idx === 0 && msg.sendTime && (
                  <div className="flex justify-center my-6">
                    <span className="text-xs text-slate-400 font-medium">
                      {msg.sendTime.split(' ')[0]}
                    </span>
                  </div>
                )}

                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}>
                  {/* 상대 아바타 */}
                  {!isMine && (
                    <div className="w-8 mr-2 flex-shrink-0">
                      {showAvatar ? (
                        targetProfile ? (
                          <img src={targetProfile} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        )
                      ) : null}
                    </div>
                  )}

                  <div className={`flex items-end gap-1.5 max-w-[65%] ${isMine ? 'flex-row-reverse' : ''}`}>
                    {/* 메시지 버블 */}
                    <div
                      className={`px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        isMine
                          ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white rounded-[22px] rounded-br-[4px]'
                          : 'bg-slate-100 text-slate-900 rounded-[22px] rounded-bl-[4px]'
                      }`}
                    >
                      {msg.messageContent}
                    </div>

                    {/* 시간 (그룹 마지막에만) */}
                    {lastInGroup && msg.sendTime && (
                      <span className="text-[10px] text-slate-400 mb-0.5 flex-shrink-0">
                        {msg.sendTime.split(' ')[1] || msg.sendTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* 읽음 표시 (내 메시지 그룹 마지막) */}
                {isMine && lastInGroup && msg.readFl === 'Y' && (
                  <div className="flex justify-end mt-0.5 pr-1">
                    <span className="text-[10px] text-slate-400">읽음</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 - IG 스타일 */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
          <button className="p-1 flex-shrink-0 text-sky-500 hover:text-sky-600 transition-colors">
            <Smile className="w-6 h-6" />
          </button>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm py-1.5 focus:outline-none placeholder:text-slate-400 max-h-[100px]"
          />
          {inputValue.trim() ? (
            <button
              onClick={handleSend}
              className="p-1 flex-shrink-0 text-sky-500 hover:text-sky-600 font-bold text-sm transition-colors"
            >
              보내기
            </button>
          ) : (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button className="p-1 text-slate-900 hover:text-slate-600 transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-1 text-slate-900 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatMessageArea);
