import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CalendarDays, MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Loader2, ImageIcon } from 'lucide-react';
import { useEventList, useLeisureList } from '../../api/activity/useActivity';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const s = String(dateStr);
  if (s.length !== 8) return s;
  return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
};

const EventCard = React.memo(function EventCard({ item, type, index }) {
  const isEvent = type === 'event';

  return (
    <motion.div
      className="flex-shrink-0 w-[300px] group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div className="relative bg-white rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100/80 overflow-hidden hover:shadow-2xl hover:shadow-orange-200/40 hover:-translate-y-2 transition-all duration-500">
        {/* 이미지 */}
        <div className="relative h-[200px] overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-orange-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* 뱃지 */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-[11px] font-bold rounded-full backdrop-blur-md shadow-lg ${
                isEvent
                  ? 'bg-gradient-to-r from-orange-500/90 to-amber-500/90'
                  : 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90'
              }`}
              className="font-pretendard"
            >
              {isEvent ? '축제' : '액티비티'}
            </span>
          </div>

          {/* 날짜 (이벤트만) */}
          {isEvent && item.startDate && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
                <CalendarDays className="w-3 h-3 text-amber-300" />
                <span
                  className="text-[11px] text-white/90 font-medium font-pretendard"
                >
                  {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="p-5">
          <h3
            className="font-bold text-slate-800 text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 font-pretendard"
          >
            {item.title}
          </h3>

          {item.addr && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
              <p
                className="text-[13px] text-slate-400 line-clamp-1 font-pretendard"
              >
                {item.addr}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

function CTASection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '100px' });

  const { data: eventData, isLoading: eventLoading } = useEventList(1, 12);
  const { data: leisureData, isLoading: leisureLoading } = useLeisureList(1, 12);

  const eventList = eventData?.success ? (eventData.list || []) : [];
  const leisureList = leisureData?.success ? (leisureData.list || []) : [];

  // 이벤트와 액티비티를 번갈아 섞기
  const allItems = useMemo(() => {
    const items = [];
    const maxLen = Math.max(eventList.length, leisureList.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < eventList.length) items.push({ ...eventList[i], _type: 'event' });
      if (i < leisureList.length) items.push({ ...leisureList[i], _type: 'leisure' });
    }
    return items;
  }, [eventList, leisureList]);

  const isLoading = eventLoading && leisureLoading;

  // 스크롤 상태 추적
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setScrollX(el.scrollLeft);
    setMaxScroll(el.scrollWidth - el.clientWidth);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, allItems.length]);

  // 자동 스크롤
  useEffect(() => {
    if (allItems.length === 0 || isPaused) {
      clearInterval(autoScrollRef.current);
      return;
    }

    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const cardWidth = 316; // 300 + gap
      const nextScroll = el.scrollLeft + cardWidth;

      if (nextScroll >= el.scrollWidth - el.clientWidth) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(autoScrollRef.current);
  }, [allItems.length, isPaused]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 316;
    const amount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const canScrollLeft = scrollX > 10;
  const canScrollRight = scrollX < maxScroll - 10;

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* ── 히어로 배너 ── */}
      <div className="relative h-[340px] md:h-[380px] overflow-hidden">
        {/* 배경 이미지 */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 10, ease: 'easeOut' }}
        >
          <img
            src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1600&q=80"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* 오버레이 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-amber-500/60 to-orange-600/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* 떠다니는 컨페티 */}
        {[
          { emoji: '🎉', left: '8%', top: '20%', delay: 0, size: 'text-3xl', dur: 5 },
          { emoji: '🎪', left: '85%', top: '15%', delay: 0.5, size: 'text-4xl', dur: 6 },
          { emoji: '🎊', left: '75%', top: '60%', delay: 1, size: 'text-2xl', dur: 5.5 },
          { emoji: '🎈', left: '15%', top: '65%', delay: 1.5, size: 'text-3xl', dur: 7 },
          { emoji: '🎶', left: '50%', top: '12%', delay: 0.8, size: 'text-2xl', dur: 6 },
          { emoji: '✨', left: '30%', top: '75%', delay: 2, size: 'text-xl', dur: 4.5 },
          { emoji: '🎭', left: '92%', top: '45%', delay: 0.3, size: 'text-2xl', dur: 5 },
          { emoji: '🎵', left: '60%', top: '70%', delay: 1.2, size: 'text-xl', dur: 6.5 },
        ].map((item, i) => (
          <motion.span
            key={i}
            className={`absolute ${item.size} pointer-events-none select-none`}
            style={{ left: item.left, top: item.top }}
            animate={isInView ? { y: [0, -12, 0], rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] } : { y: 0, rotate: 0, scale: 1 }}
            transition={{
              delay: item.delay,
              duration: item.dur,
              repeat: isInView ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {item.emoji}
          </motion.span>
        ))}

        {/* 빛나는 파티클 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={isInView ? { opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -30, -60] } : { opacity: 0, scale: 0, y: 0 }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: isInView ? Infinity : 0,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* 텍스트 콘텐츠 */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-5 border border-white/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span
                className="text-xs font-bold text-white tracking-wider font-pretendard"
              >
                FESTIVAL & ACTIVITY
              </span>
            </motion.div>

            <h2
              className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg font-gmarket"
            >
              제주의 즐길거리
            </h2>
            <p
              className="text-lg md:text-xl text-white/85 font-medium drop-shadow max-w-lg font-pretendard"
            >
              지금 제주에서 펼쳐지는 축제와 액티비티를 만나보세요
            </p>
          </motion.div>
        </div>

        {/* 하단 물결 연결 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px]">
            <path fill="#fffbeb" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* ── 카드 영역 ── */}
      <div className="relative pt-6 pb-20">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50/30 to-sky-50" />

        <div className="relative max-w-7xl mx-auto">
          {/* 네비게이션 + 더보기 */}
          <div className="px-6 mb-8 flex items-center justify-end gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-white text-slate-600 shadow-md shadow-slate-200/50 hover:shadow-lg hover:bg-orange-50 hover:text-orange-500 active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? 'bg-white text-slate-600 shadow-md shadow-slate-200/50 hover:shadow-lg hover:bg-orange-50 hover:text-orange-500 active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/activities')}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300 font-pretendard"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        {/* 카드 슬라이드 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-10 h-10 text-orange-400" />
            </motion.div>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-20 px-6">
            <CalendarDays className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <p
              className="text-slate-400 text-lg font-medium font-pretendard"
            >
              등록된 축제 및 액티비티가 없습니다
            </p>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 좌측 그라데이션 페이드 */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-50 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* 우측 그라데이션 페이드 */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-sky-50 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {allItems.map((item, index) => (
                <EventCard
                  key={`${item._type}-${item.contentId || index}`}
                  item={item}
                  type={item._type}
                  index={index}
                />
              ))}
            </div>

            {/* 스크롤 프로그레스 바 */}
            {maxScroll > 0 && (
              <div className="mt-6 px-6">
                <div className="max-w-xs mx-auto h-1 bg-slate-200/60 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                    style={{ width: `${Math.max(10, (scrollX / maxScroll) * 100)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

          {/* 모바일 더보기 버튼 */}
          <div className="md:hidden flex justify-center mt-8 px-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/activities')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 font-pretendard"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* scrollbar-hide CSS */}
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}

export default React.memo(CTASection);
