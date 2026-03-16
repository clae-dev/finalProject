import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Eye, Calendar, Heart, MessageCircle,
  Trash2, Edit3, Loader2, Send, CornerDownRight,
  X, ImageIcon, Flag,
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import {
  useFreeBoardDetail, useDeleteFreeBoard, useCommentList,
  useCreateComment, useDeleteComment, useToggleLike,
} from '../../api/freeboard/useFreeboard';
import { useCheckReport } from '../../api/report/useReport';
import { submitReport } from '../../api/report/reportAPI';
import { AuthContext } from '../../components/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ── 프로필 아바타 ───────────────────────────────────── */
function Avatar({ src, name, size = 'md' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs rounded-xl' : 'w-11 h-11 text-sm rounded-2xl';
  return (
    <div className={`${sz} bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 overflow-hidden`}>
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = name?.[0] || '?'; }}
        />
      ) : (
        name?.[0] || '?'
      )}
    </div>
  );
}

export default function FreeboardDetail() {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const { data, isLoading } = useFreeBoardDetail(boardNo);
  const { data: commentData } = useCommentList(boardNo);
  const deleteMutation = useDeleteFreeBoard();
  const likeMutation = useToggleLike(boardNo);
  const createCommentMutation = useCreateComment(boardNo);
  const deleteCommentMutation = useDeleteComment(boardNo);

  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportTarget, setReportTarget] = useState({ targetType: 'FREEBOARD', targetNo: Number(boardNo) });
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const { data: reportCheckData } = useCheckReport(user ? 'FREEBOARD' : null, user ? Number(boardNo) : null);
  const alreadyReported = reportCheckData?.reported === true;

  const board = data?.success ? data.data : null;
  const comments = commentData?.success ? (commentData.list || []) : [];

  const isAuthor = user && board && Number(user.memberNo) === Number(board.memberNo);
  const isAdmin = user && user.memberRole === 'A';

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const r = await deleteMutation.mutateAsync(Number(boardNo));
      if (r.success) { alert('삭제되었습니다.'); navigate('/freeboard'); }
      else alert(r.message);
    } catch { alert('삭제 중 오류가 발생했습니다.'); }
  };

  const handleLike = async () => {
    if (!user) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
    try { await likeMutation.mutateAsync(); } catch { alert('좋아요 처리 중 오류가 발생했습니다.'); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
    if (!commentInput.trim()) return;
    try {
      const r = await createCommentMutation.mutateAsync({ content: commentInput });
      if (r.success) setCommentInput('');
    } catch { alert('댓글 작성 중 오류가 발생했습니다.'); }
  };

  const handleReplySubmit = async (parentCommentNo) => {
    if (!user) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
    if (!replyInput.trim()) return;
    try {
      const r = await createCommentMutation.mutateAsync({ content: replyInput, parentCommentNo });
      if (r.success) { setReplyInput(''); setReplyTo(null); }
    } catch { alert('답글 작성 중 오류가 발생했습니다.'); }
  };

  const handleDeleteComment = async (commentNo) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try { await deleteCommentMutation.mutateAsync(commentNo); } catch { alert('댓글 삭제 중 오류가 발생했습니다.'); }
  };

  const handleReportSubmit = async () => {
    if (!reportType) { alert('신고 유형을 선택해주세요.'); return; }
    setReportSubmitting(true);
    try {
      const r = await submitReport(reportTarget.targetType, reportTarget.targetNo, reportType, reportReason);
      if (r.success) {
        alert('신고가 접수되었습니다.');
        setShowReportModal(false);
        setReportType('');
        setReportReason('');
      } else {
        alert(r.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || '신고 접수 중 오류가 발생했습니다.');
    } finally {
      setReportSubmitting(false);
    }
  };

  /* ── 로딩 / 에러 상태 ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-9 h-9 text-sky-400" />
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-slate-400 text-lg font-medium font-pretendard">
            존재하지 않는 게시글입니다.
          </p>
          <button
            onClick={() => navigate('/freeboard')}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-xl shadow-md font-pretendard"
          >
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-sky-500" />
          </div>
          <p className="text-slate-700 text-lg font-semibold mb-2 font-pretendard">로그인이 필요합니다</p>
          <p className="text-slate-400 text-sm mb-6 font-pretendard">게시글 상세 내용은 회원만 볼 수 있습니다.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all font-pretendard"
          >
            로그인하러 가기
          </button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  const imageList = board.imageList || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      <div className="max-w-3xl mx-auto px-5 pt-24 pb-20">

        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/freeboard')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-sky-600 transition-colors mb-6 group font-pretendard"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">목록으로</span>
        </motion.button>

        {/* ── 게시글 카드 ── */}
        <motion.article
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-4"
        >
          {/* 게시글 헤더 */}
          <div className="px-7 pt-8 pb-6 border-b border-slate-100">
            <h1
              className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-5 font-pretendard"
            >
              {board.boardTitle}
            </h1>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3">
                <Avatar src={board.memberProfile} name={board.memberNickname} />
                <div>
                  <p className="text-sm font-bold text-slate-800 font-pretendard">
                    {board.memberNickname}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {board.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      조회 {board.readCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* 수정 / 삭제 */}
              {(isAuthor || isAdmin) && (
                <div className="flex items-center gap-2">
                  {isAuthor && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(`/freeboard/write?edit=${boardNo}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-600 rounded-xl text-xs font-semibold hover:bg-sky-100 transition-colors border border-sky-100 font-pretendard"
                    >
                      <Edit3 className="w-3 h-3" />
                      수정
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100 font-pretendard"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div className="px-7 py-7">
            <p
              className="text-[15px] text-slate-700 leading-8 whitespace-pre-wrap font-pretendard"
            >
              {board.boardContent}
            </p>

            {/* 이미지 갤러리 */}
            {imageList.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-500">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  첨부 이미지 {imageList.length}장
                </div>
                <div
                  className={`grid gap-2 ${
                    imageList.length === 1 ? 'grid-cols-1' :
                    imageList.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3'
                  }`}
                >
                  {imageList.map((imgUrl, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-xl overflow-hidden cursor-pointer group border border-slate-100 ${
                        imageList.length === 1 ? 'aspect-video' : 'aspect-square'
                      }`}
                      onClick={() => setLightboxImg(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={`이미지 ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 좋아요 + 신고 */}
          <div className="px-7 pb-7 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                board.isLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200/50'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'
              }`}
              className="font-pretendard"
            >
              <Heart className={`w-4 h-4 ${board.isLiked ? 'fill-current' : ''}`} />
              좋아요 {board.likeCount > 0 && <span className="font-black">{board.likeCount}</span>}
            </motion.button>

            {user && !isAuthor && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (alreadyReported) return;
                  setReportTarget({ targetType: 'FREEBOARD', targetNo: Number(boardNo) });
                  setShowReportModal(true);
                }}
                disabled={alreadyReported}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  alreadyReported
                    ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                    : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50'
                }`}
                className="font-pretendard"
              >
                <Flag className="w-3.5 h-3.5" />
                {alreadyReported ? '신고 완료' : '신고'}
              </motion.button>
            )}
          </div>
        </motion.article>

        {/* ── 댓글 섹션 ── */}
        <motion.section
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* 댓글 헤더 */}
          <div className="flex items-center gap-2 px-7 py-5 border-b border-slate-100">
            <MessageCircle className="w-4 h-4 text-sky-500" />
            <h3 className="text-base font-black text-slate-800 font-pretendard">
              댓글
            </h3>
            <span className="px-2 py-0.5 bg-sky-100 text-sky-600 rounded-full text-xs font-black">
              {board.commentCount}
            </span>
          </div>

          {/* 댓글 입력 */}
          <div className="px-7 py-4 border-b border-slate-100 bg-slate-50/50">
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2.5">
              {user && <Avatar src={user.memberProfileImg} name={user.memberNickname} size="sm" />}
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={user ? '댓글을 입력하세요…' : '로그인 후 댓글을 작성할 수 있습니다'}
                maxLength={500}
                disabled={!user}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 disabled:bg-slate-50 disabled:text-slate-300 transition-all font-pretendard"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!user || createCommentMutation.isPending}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-sm disabled:opacity-40 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>

          {/* 댓글 리스트 */}
          <div className="px-7 py-5">
            {comments.length === 0 ? (
              <div className="text-center py-10">
                <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-pretendard">
                  첫 번째 댓글을 남겨보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.commentNo}>
                    {/* 부모 댓글 */}
                    <div className="flex gap-3">
                      <Avatar src={comment.memberProfile} name={comment.memberNickname} size="sm" />
                      <div className="flex-1 min-w-0 bg-slate-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 font-pretendard">
                              {comment.memberNickname}
                            </span>
                            <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-pretendard">
                          {comment.content}
                        </p>

                        {/* 액션 버튼 */}
                        <div className="flex items-center gap-3 mt-2">
                          {user && (
                            <button
                              onClick={() => { setReplyTo(replyTo === comment.commentNo ? null : comment.commentNo); setReplyInput(''); }}
                              className="text-[11px] text-slate-400 hover:text-sky-500 font-semibold transition-colors font-pretendard"
                            >
                              답글
                            </button>
                          )}
                          {user && Number(user.memberNo) === Number(comment.memberNo) && (
                            <button
                              onClick={() => handleDeleteComment(comment.commentNo)}
                              className="text-[11px] text-slate-400 hover:text-red-500 font-semibold transition-colors font-pretendard"
                            >
                              삭제
                            </button>
                          )}
                          {user && Number(user.memberNo) !== Number(comment.memberNo) && (
                            <button
                              onClick={() => {
                                setReportTarget({ targetType: 'COMMENT', targetNo: comment.commentNo });
                                setReportType(''); setReportReason('');
                                setShowReportModal(true);
                              }}
                              className="text-[11px] text-slate-400 hover:text-orange-500 font-semibold transition-colors inline-flex items-center gap-0.5 font-pretendard"
                            >
                              <Flag className="w-2.5 h-2.5" />신고
                            </button>
                          )}
                        </div>

                        {/* 답글 입력 */}
                        {replyTo === comment.commentNo && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200"
                          >
                            <CornerDownRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              placeholder="답글을 입력하세요…"
                              maxLength={500}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all font-pretendard"
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleReplySubmit(comment.commentNo); } }}
                            />
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleReplySubmit(comment.commentNo)}
                              className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-sm flex-shrink-0"
                            >
                              <Send className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* 대댓글 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 mt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.commentNo} className="flex gap-2.5">
                            <div className="flex items-start gap-1 flex-shrink-0">
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-300 mt-2.5" />
                              <Avatar src={reply.memberProfile} name={reply.memberNickname} size="sm" />
                            </div>
                            <div className="flex-1 min-w-0 bg-sky-50/60 rounded-2xl px-4 py-2.5 border border-sky-100/60">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-700 font-pretendard">
                                  {reply.memberNickname}
                                </span>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-pretendard">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                {user && Number(user.memberNo) === Number(reply.memberNo) && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.commentNo)}
                                    className="text-[10px] text-slate-400 hover:text-red-500 font-semibold transition-colors font-pretendard"
                                  >
                                    삭제
                                  </button>
                                )}
                                {user && Number(user.memberNo) !== Number(reply.memberNo) && (
                                  <button
                                    onClick={() => {
                                      setReportTarget({ targetType: 'COMMENT', targetNo: reply.commentNo });
                                      setReportType(''); setReportReason('');
                                      setShowReportModal(true);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-orange-500 font-semibold transition-colors inline-flex items-center gap-0.5 font-pretendard"
                                  >
                                    <Flag className="w-2.5 h-2.5" />신고
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* 이미지 라이트박스 */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-5"
            onClick={() => setLightboxImg(null)}
          >
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              src={lightboxImg}
              alt=""
              className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 신고 모달 */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Flag className="w-4 h-4 text-orange-500" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 font-pretendard">
                    {reportTarget.targetType === 'COMMENT' ? '댓글 신고' : '게시글 신고'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { value: 'SPAM', label: '스팸/광고' },
                  { value: 'ABUSE', label: '욕설/비방' },
                  { value: 'FALSE_INFO', label: '허위정보' },
                  { value: 'ADULT', label: '성인콘텐츠' },
                  { value: 'ETC', label: '기타' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border text-sm font-semibold ${
                      reportType === opt.value
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                    className="font-pretendard"
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={opt.value}
                      checked={reportType === opt.value}
                      onChange={(e) => setReportType(e.target.value)}
                      className="accent-orange-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="상세 사유 (선택)"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none mb-4 font-pretendard"
              />

              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors font-pretendard"
                >
                  취소
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={reportSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-md shadow-orange-200/50 hover:shadow-lg transition-all disabled:opacity-50 font-pretendard"
                >
                  {reportSubmitting ? '접수 중…' : '신고 접수'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
