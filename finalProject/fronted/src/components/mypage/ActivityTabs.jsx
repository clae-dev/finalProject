import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare, Heart, Inbox, MessageCircle, ThumbsUp, Star, Bookmark, Building2, Users, Calendar } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useMyActivity } from '../../api/member/useMember';
import { useMyWishlists } from '../../api/wishlist/useWishlist';

const tabs = [
  { key: 'posts', label: '내 글', icon: FileText },
  { key: 'reviews', label: '내 후기', icon: MessageSquare },
  { key: 'companions', label: '내 동행', icon: Users },
  { key: 'likes', label: '좋아요', icon: Heart },
  { key: 'wishlists', label: '저장한 목록', icon: Bookmark },
];

const emptyMessages = {
  posts: '아직 작성한 글이 없어요',
  reviews: '아직 작성한 후기가 없어요',
  companions: '아직 작성한 동행 글이 없어요',
  likes: '좋아요한 글이 없어요',
  wishlists: '저장한 항목이 없어요',
};

const tabContentVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function ActivityTabs() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data: activityResponse, isLoading } = useMyActivity(user?.memberNo);
  const activityData = activityResponse?.data || { posts: [], reviews: [], likes: [] };

  const { data: wishlistResponse, isLoading: wishlistLoading } = useMyWishlists(!!user);
  const wishlistData = wishlistResponse?.data || { accommodations: [], companions: [], reviews: [] };

  const [activeTab, setActiveTab] = useState('posts');
  const [wishlistSubTab, setWishlistSubTab] = useState('accommodations');

  const items = (activeTab === 'wishlists') ? [] : (activityData[activeTab] || []);

  const handleItemClick = (item) => {
    if (activeTab === 'posts' || activeTab === 'likes') {
      navigate(`/freeboard/${item.boardNo}`);
    } else if (activeTab === 'reviews') {
      navigate(`/review/${item.reviewNo}`);
    } else if (activeTab === 'companions') {
      navigate(`/companions/${item.companionNo}`);
    }
  };

  const wishlistItems = wishlistData[wishlistSubTab] || [];
  const handleWishlistItemClick = (item) => {
    if (wishlistSubTab === 'accommodations') navigate(`/accommodations/${item.accommodationNo}`);
    else if (wishlistSubTab === 'companions') navigate(`/companions/${item.companionNo}`);
    else if (wishlistSubTab === 'reviews') navigate(`/reviews/${item.reviewNo}`);
  };

  return (
    <section className="py-12 px-5">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-800 font-gmarket"
          >
            내 활동
          </h2>
          <p className="text-slate-500 mt-2 font-pretendard">
            작성한 글과 활동 내역을 확인하세요
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-lg shadow-sky-200/50'
                    : 'bg-white text-slate-500 hover:text-sky-600 hover:bg-sky-50 border border-sky-100'
                }`}
                className="font-pretendard"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* 저장한 목록 탭 */}
            {activeTab === 'wishlists' ? (
              <div>
                {/* 서브탭: 숙소 / 동행 / 후기 */}
                <div className="flex gap-2 mb-4">
                  {[
                    { key: 'accommodations', label: '숙소', icon: Building2 },
                    { key: 'companions', label: '동행', icon: Users },
                    { key: 'reviews', label: '후기', icon: Star },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setWishlistSubTab(key)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        wishlistSubTab === key
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-200/50'
                          : 'bg-white text-slate-500 hover:text-rose-500 hover:bg-rose-50 border border-rose-100'
                      }`}
                      className="font-pretendard"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      <span className="ml-0.5 text-xs opacity-70">
                        {(wishlistData[key] || []).length}
                      </span>
                    </button>
                  ))}
                </div>

                {wishlistLoading ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-lg shadow-sky-100 border border-sky-50 text-center">
                    <div className="w-10 h-10 border-4 border-rose-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-pretendard">로딩 중...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-lg shadow-sky-100 border border-sky-50 text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Bookmark className="w-10 h-10 text-rose-300" />
                    </div>
                    <p className="text-lg text-slate-400 font-medium font-pretendard">
                      저장한 항목이 없어요
                    </p>
                    <p className="text-sm text-slate-300 mt-2">♡ 버튼으로 마음에 드는 항목을 저장해보세요</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={item.accommodationNo || item.companionNo || item.reviewNo || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        onClick={() => handleWishlistItemClick(item)}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-md shadow-sky-100 border border-sky-50 hover:shadow-lg hover:shadow-rose-100 transition-shadow cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* 썸네일 */}
                            {(item.thumbnailUrl || item.imageUrl) && (
                              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                  src={item.thumbnailUrl || item.imageUrl}
                                  alt=""
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-base font-semibold text-slate-700 truncate group-hover:text-rose-500 transition-colors font-pretendard"
                              >
                                {item.name || item.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {item.region && (
                                  <span className="text-xs text-slate-400">{item.region}</span>
                                )}
                                {item.rating && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
                                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                                  </span>
                                )}
                                {item.accommodationType && (
                                  <span className="px-2 py-0.5 bg-sky-50 text-sky-500 rounded-full text-xs font-medium">{item.accommodationType}</span>
                                )}
                                {item.travelDate && (
                                  <span className="text-xs text-slate-400">{item.travelDate}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 flex-shrink-0 ml-3" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-lg shadow-sky-100 border border-sky-50 text-center">
                <div className="w-10 h-10 border-4 border-sky-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-pretendard">로딩 중...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-lg shadow-sky-100 border border-sky-50 text-center">
                <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Inbox className="w-10 h-10 text-sky-300" />
                </div>
                <p
                  className="text-lg text-slate-400 font-medium font-pretendard"
                >
                  {emptyMessages[activeTab]}
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  활동을 시작하면 여기에 표시돼요
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.boardNo || item.reviewNo || item.companionNo || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    onClick={() => handleItemClick(item)}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-md shadow-sky-100 border border-sky-50
                               hover:shadow-lg hover:shadow-sky-200 transition-shadow cursor-pointer group"
                  >
                    {/* 동행 탭 전용 레이아웃 */}
                    {activeTab === 'companions' ? (
                      <div className="flex items-center gap-4">
                        {/* 썸네일 */}
                        {item.imageUrl && (
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-base font-semibold text-slate-700 truncate group-hover:text-sky-600 transition-colors font-pretendard"
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs text-slate-400">{item.createdAt}</span>
                            {item.travelDate && (
                              <span className="inline-flex items-center gap-1 text-xs text-sky-500">
                                <Calendar className="w-3 h-3" /> {item.travelDate}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Users className="w-3 h-3" /> {item.currentMembers}/{item.maxMembers}명
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === 'Y'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-red-50 text-red-500 border border-red-200'
                            }`}>
                              {item.status === 'Y' ? '모집중' : '마감'}
                            </span>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-base font-semibold text-slate-700 truncate group-hover:text-sky-600 transition-colors font-pretendard"
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-slate-400">{item.createdAt}</span>

                            {/* 자유게시판 글: 댓글 수, 좋아요 수 */}
                            {activeTab === 'posts' && (
                              <>
                                {item.commentCount > 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                    <MessageCircle className="w-3 h-3" /> {item.commentCount}
                                  </span>
                                )}
                                {item.likeCount > 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                                    <ThumbsUp className="w-3 h-3" /> {item.likeCount}
                                  </span>
                                )}
                              </>
                            )}

                            {/* 후기: 별점, 동행 제목 */}
                            {activeTab === 'reviews' && (
                              <>
                                {item.rating && (
                                  <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                                  </span>
                                )}
                                {item.companionTitle && (
                                  <span className="px-2.5 py-0.5 bg-sky-50 text-sky-500 rounded-full text-xs font-semibold truncate max-w-[160px]">
                                    {item.companionTitle}
                                  </span>
                                )}
                              </>
                            )}

                            {/* 좋아요: 작성자 */}
                            {activeTab === 'likes' && item.authorNickname && (
                              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-500 rounded-full text-xs font-semibold">
                                {item.authorNickname}
                              </span>
                            )}
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
