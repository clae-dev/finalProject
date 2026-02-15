import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, Eye, Loader2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useFaqCategories, useFaqList, useIncreaseFaqView } from '../../api/useFaq';

const CATEGORY_TABS = [
  { code: null, label: '전체' },
  { code: 'MEMBER', label: '회원' },
  { code: 'ACCOM', label: '숙소' },
  { code: 'BOARD', label: '커뮤니티' },
  { code: 'ETC', label: '기타' },
];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [openFaqNo, setOpenFaqNo] = useState(null);

  const { data: faqData, isLoading } = useFaqList(selectedCategory, search);
  const viewMutation = useIncreaseFaqView();

  const faqList = faqData?.success ? (faqData.data || []) : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleCategoryChange = (code) => {
    setSelectedCategory(code);
    setOpenFaqNo(null);
  };

  const handleToggle = (faqNo) => {
    if (openFaqNo === faqNo) {
      setOpenFaqNo(null);
    } else {
      setOpenFaqNo(faqNo);
      viewMutation.mutate(faqNo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600">
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>FAQ</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">자주 묻는 </span>
            <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-teal-200 bg-clip-text text-transparent">질문</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-white/70 text-center"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            궁금한 점을 빠르게 찾아보세요
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* 카테고리 탭 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.code || 'all'}
              onClick={() => handleCategoryChange(tab.code)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedCategory === tab.code
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                  : 'bg-white text-slate-500 hover:text-sky-600 shadow-sm border border-sky-100'
              }`}
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* 검색바 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-4 flex items-center gap-3 mb-8"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="질문 또는 답변 키워드로 검색"
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            검색
          </button>
        </motion.form>

        {/* FAQ 아코디언 리스트 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-sky-400" />
            </motion.div>
          </div>
        ) : faqList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              등록된 FAQ가 없습니다.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {faqList.map((faq, index) => (
              <motion.div
                key={faq.faqNo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-sky-100 border border-sky-50 overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(faq.faqNo)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-sky-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-600">
                      {faq.categoryName}
                    </span>
                    <span
                      className="text-sm font-semibold text-slate-700 truncate"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Eye className="w-3.5 h-3.5" />
                      {faq.viewCount}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaqNo === faq.faqNo ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {openFaqNo === faq.faqNo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 border-t border-sky-50">
                        <p
                          className="text-sm text-slate-600 leading-relaxed pt-4 whitespace-pre-wrap"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
