/**
 * AI 창식이 채팅 슬라이드 패널 컴포넌트 - 실시간 대화 UI, 빠른 질문, 타이핑 인디케이터
 */
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RotateCcw, AlertCircle, Palmtree, MapPin, UtensilsCrossed, Compass, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendAiChat } from '../../api/ai/useAiChat';
import changsikImg from '../../assets/images/제주.png';

const QUICK_QUESTIONS = [
  { icon: <Compass className="w-3.5 h-3.5" />, text: '제주 혼자 여행 코스 추천해줘' },
  { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, text: '제주 맛집 추천해줘' },
  { icon: <Plane className="w-3.5 h-3.5" />, text: '제주 항공편 저렴하게 예약하는 법 알려줘' },
  { icon: <MapPin className="w-3.5 h-3.5" />, text: 'HONDI에 등록된 숙소 추천해줘' },
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: '혼저옵서예~ 🍊\n저는 제주 여행 AI 도우미 창식이예요!\n\n관광지, 맛집, 숙소, 항공편, 교통 등\n제주에 대해 궁금한 거 뭐든 물어보세요!',
};

/** 마크다운 **bold** 를 <strong> 태그로 변환하여 렌더링 */
function renderMarkdown(text) {
  if (!text) return null;

  return text.split('\n').map((line, li) => {
    const parts = [];
    let rest = line;
    let k = 0;

    while (rest.length > 0) {
      const s = rest.indexOf('**');
      if (s === -1) { parts.push(rest); break; }
      const e = rest.indexOf('**', s + 2);
      if (e === -1) { parts.push(rest); break; }

      if (s > 0) parts.push(rest.substring(0, s));
      parts.push(
        <strong key={k++} className="font-semibold">
          {rest.substring(s + 2, e)}
        </strong>
      );
      rest = rest.substring(e + 2);
    }

    return (
      <React.Fragment key={li}>
        {li > 0 && <br />}
        {parts}
      </React.Fragment>
    );
  });
}

export default function AiChatPanel({ isOpen, onClose, motionX, motionY }) {
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
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ x: motionX, y: motionY }}
        className="fixed bottom-24 right-6 w-[360px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] z-[70] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* 헤더 */}
        <div className="px-5 py-3.5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-100">
                  <img src={changsikImg} alt="창식이" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-px -right-px w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">창식이</h2>
                <p className="text-[11px] text-green-500 font-medium leading-tight">응답 가능</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                title="대화 초기화"
              >
                <RotateCcw className="w-[18px] h-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <X className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f7f7f8]">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* 어시스턴트 아바타 */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1">
                  <img src={changsikImg} alt="창식이" className="w-full h-full object-cover" />
                </div>
              )}

              {/* 메시지 버블 */}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                }`}
              >
                {renderMarkdown(msg.content)}
              </div>
            </motion.div>
          ))}

          {/* 타이핑 인디케이터 */}
          <AnimatePresence>
            {sendMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1">
                  <img src={changsikImg} alt="창식이" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 에러 메시지 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl text-[12.5px] text-red-500"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 빠른 질문 */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="pt-1"
            >
              <p className="text-[11px] text-gray-400 mb-2 px-0.5">이런 걸 물어보세요</p>
              <div className="flex flex-col gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-[12.5px] text-gray-600 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:text-orange-600 active:scale-[0.99] transition-all"
                  >
                    <span className="text-orange-400">{q.icon}</span>
                    {q.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-gray-50 rounded-xl px-3.5 py-2 border border-gray-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                rows={1}
                className="w-full resize-none bg-transparent text-[13px] leading-relaxed focus:outline-none placeholder:text-gray-300 max-h-[100px] text-gray-700"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || sendMutation.isPending}
              className={`p-2.5 flex-shrink-0 rounded-xl transition-all ${
                inputValue.trim() && !sendMutation.isPending
                  ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-2">
            AI 응답은 부정확할 수 있습니다
          </p>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
