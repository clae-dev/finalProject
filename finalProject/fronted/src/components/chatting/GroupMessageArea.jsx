import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Smile } from 'lucide-react';

/**
 * 그룹 채팅 메시지 영역
 * - 타인 메시지 위에 senderNickname 표시
 * - 메시지별 senderProfile 아바타
 */
export default function GroupMessageArea({
  messages,
  currentMemberNo,
  roomName,
  onSendMessage,
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // 연속 같은 발신자면 아바타/닉네임 숨김
  const shouldShowSender = (idx) => {
    if (idx === 0) return true;
    return messages[idx - 1].senderNo !== messages[idx].senderNo;
  };

  const isLastInGroup = (idx) => {
    if (idx === messages.length - 1) return true;
    return messages[idx + 1].senderNo !== messages[idx].senderNo;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
        {messages && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <p className="text-base font-semibold text-slate-900 mb-1">{roomName}</p>
            <p className="text-sm text-slate-500">그룹 채팅을 시작해보세요</p>
          </div>
        )}

        <div className="space-y-0.5">
          {messages && messages.map((msg, idx) => {
            const isMine = msg.senderNo === currentMemberNo;
            const showSender = shouldShowSender(idx);
            const lastInGroup = isLastInGroup(idx);

            return (
              <div key={msg.groupMsgNo || idx}>
                {/* 날짜 구분 */}
                {idx === 0 && msg.sendTime && (
                  <div className="flex justify-center my-6">
                    <span className="text-xs text-slate-400 font-medium">
                      {msg.sendTime.split(' ')[0]}
                    </span>
                  </div>
                )}

                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showSender ? 'mt-3' : 'mt-0.5'}`}>
                  {/* 상대 아바타 */}
                  {!isMine && (
                    <div className="w-8 mr-2 flex-shrink-0">
                      {showSender ? (
                        msg.senderProfile ? (
                          <img
                            src={msg.senderProfile}
                            alt=""
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        )
                      ) : null}
                    </div>
                  )}

                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[65%]`}>
                    {/* 닉네임 (타인 메시지 그룹 첫 번째에만) */}
                    {!isMine && showSender && (
                      <span className="text-xs text-slate-500 font-medium mb-1 ml-1">
                        {msg.senderNickname}
                      </span>
                    )}

                    <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                      {/* 메시지 버블 */}
                      <div
                        className={`px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isMine
                            ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white rounded-[22px] rounded-br-[4px]'
                            : 'bg-slate-100 text-slate-900 rounded-[22px] rounded-bl-[4px]'
                        }`}
                      >
                        {msg.msgContent}
                      </div>

                      {/* 시간 */}
                      {lastInGroup && msg.sendTime && (
                        <span className="text-[10px] text-slate-400 mb-0.5 flex-shrink-0">
                          {msg.sendTime.split(' ')[1] || msg.sendTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
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
          {inputValue.trim() && (
            <button
              onClick={handleSend}
              className="p-1 flex-shrink-0 text-sky-500 hover:text-sky-600 font-bold text-sm transition-colors"
            >
              보내기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
