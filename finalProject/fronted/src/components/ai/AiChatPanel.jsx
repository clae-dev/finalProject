import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RotateCcw, AlertCircle, User, Palmtree, MapPin, UtensilsCrossed, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendAiChat } from '../../api/useAiChat';

const QUICK_QUESTIONS = [
  { icon: <Compass className="w-3.5 h-3.5" />, text: '제주 혼자 여행 코스 추천해줘' },
  { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, text: '제주 맛집 추천해줘' },
  { icon: <Palmtree className="w-3.5 h-3.5" />, text: '제주 숨은 명소 알려줘' },
  { icon: <MapPin className="w-3.5 h-3.5" />, text: '제주 게스트하우스 추천해줘' },
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: '혼저옵서예~ 🍊\n저는 제주 여행 AI 도우미 창식이예요!\n\n관광지, 맛집, 숙소, 교통 등\n제주에 대해 궁금한 거 뭐든 물어보세요!',
};

export default function AiChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sendMutation = useSendAiChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendMutation.isPending]);

  const getHistory = () => {
    return messages
      .filter((_, idx) => idx > 0)
      .map((msg) => ({ role: msg.role, content: msg.content }));
  };

  const handleSend = (text) => {
    const trimmed = (text || inputValue).trim();
    if (!trimmed || sendMutation.isPending) return;

    setError(null);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMsg = { role: 'user', content: trimmed };
    const history = getHistory();
    setMessages((prev) => [...prev, userMsg]);

    sendMutation.mutate(
      { message: trimmed, history },
      {
        onSuccess: (data) => {
          if (data.success) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: data.data.reply },
            ]);
          } else {
            setError(data.message || 'AI 응답을 받지 못했습니다.');
          }
        },
        onError: () => {
          setError('AI 응답 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
      }
    );
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

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    setInputValue('');
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* 슬라이드 패널 */}
      <div
        className={`fixed top-0 left-0 h-full w-[420px] max-w-full z-[70] transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 패널 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-amber-50/30 rounded-r-2xl shadow-2xl" />

        {/* 헤더 */}
        <div className="relative z-10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 창식이 아바타 */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-200/60">
                  <span className="text-xl">🍊</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">AI 창식이</h2>
                <p className="text-[11px] text-emerald-500 font-medium">온라인</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-2 rounded-xl hover:bg-orange-100 transition-all duration-200 group"
                title="대화 초기화"
              >
                <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:rotate-[-180deg] transition-all duration-300" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
              >
                <X className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="relative z-10 mx-5">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        </div>

        {/* 메시지 영역 */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx === 0 ? 0.1 : 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* 아바타 */}
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="text-sm">🍊</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}

              {/* 메시지 버블 */}
              <div
                className={`max-w-[78%] px-4 py-3 text-[13.5px] leading-[1.7] whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl rounded-tr-md shadow-md'
                    : 'bg-white border border-orange-100/80 text-slate-700 rounded-2xl rounded-tl-md shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* 타이핑 인디케이터 */}
          <AnimatePresence>
            {sendMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="text-sm">🍊</span>
                </div>
                <div className="bg-white border border-orange-100/80 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-orange-300 rounded-full"
                      animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 에러 배너 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-[13px] text-red-500"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 빠른 질문 칩 */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="pt-2 space-y-2"
            >
              <p className="text-[11px] text-slate-400 font-medium px-1">이런 걸 물어보세요</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-medium bg-white text-orange-600 border border-orange-200/70 rounded-xl hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm active:scale-[0.97] transition-all duration-200"
                  >
                    {q.icon}
                    {q.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="relative z-10 px-5 py-3">
          <div className="flex items-end gap-2 bg-white border border-slate-200/80 rounded-2xl px-4 py-2 shadow-sm focus-within:border-orange-300 focus-within:shadow-md focus-within:shadow-orange-100/40 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="제주 여행에 대해 물어보세요..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13.5px] py-1.5 focus:outline-none placeholder:text-slate-300 max-h-[100px] text-slate-700"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || sendMutation.isPending}
              className={`p-2 flex-shrink-0 rounded-xl transition-all duration-200 ${
                inputValue.trim() && !sendMutation.isPending
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md shadow-orange-200/50 hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'text-slate-300'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* 면책 조항 */}
          <p className="text-[10px] text-slate-300 text-center mt-2 mb-1">
            AI가 생성한 정보는 정확하지 않을 수 있습니다
          </p>
        </div>
      </div>
    </>
  );
}
