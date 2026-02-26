import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Calendar, User, Heart, MessageCircle, Trash2, Edit3, Loader2, Send, CornerDownRight, X, ImageIcon, Flag } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useFreeBoardDetail, useDeleteFreeBoard, useCommentList, useCreateComment, useDeleteComment, useToggleLike } from '../../api/freeboard/useFreeboard';
import { useCheckReport } from '../../api/report/useReport';
import { submitReport } from '../../api/report/reportAPI';
import { AuthContext } from '../../components/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

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

  // ── 신고 관련 상태 ──
  const [showReportModal, setShowReportModal] = useState(false);   // 신고 모달 표시 여부
  const [reportType, setReportType] = useState('');                // 선택된 신고 유형 (SPAM, ABUSE 등)
  const [reportReason, setReportReason] = useState('');            // 상세 신고 사유 (선택 입력)

  /**
   * reportTarget: 현재 신고 대상 정보
   * - targetType: 'FREEBOARD'(게시글) 또는 'COMMENT'(댓글/대댓글)
   * - targetNo: 게시글 번호 또는 댓글 번호
   * 신고 버튼 클릭 시 해당 대상으로 설정된 후 모달이 열림
   */
  const [reportTarget, setReportTarget] = useState({ targetType: 'FREEBOARD', targetNo: Number(boardNo) });

  /** 게시글 레벨 중복 신고 확인 (버튼 비활성화용) */
  const { data: reportCheckData } = useCheckReport(user ? 'FREEBOARD' : null, user ? Number(boardNo) : null);
  const alreadyReported = reportCheckData?.reported === true;

  const board = data?.success ? data.data : null;
  const comments = commentData?.success ? (commentData.list || []) : [];

  const isAuthor = user && board && Number(user.memberNo) === Number(board.memberNo);
  const isAdmin = user && user.memberRole === 'A';
  const canDelete = isAuthor || isAdmin;

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

  /**
   * 신고 접수 핸들러
   * - reportTarget 상태의 targetType/targetNo를 기반으로 신고 API 호출
   * - 게시글 신고와 댓글/대댓글 신고 모두 이 핸들러를 공유
   * - 중복 신고(409) 시 별도 안내 메시지 표시
   */
  const [reportSubmitting, setReportSubmitting] = useState(false); // 신고 접수 진행 중 여부
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
      // 409 CONFLICT: 이미 신고한 대상
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('신고 접수 중 오류가 발생했습니다.');
      }
    } finally {
      setReportSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-10 h-10 text-sky-400" />
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
          <p className="text-slate-400 text-lg font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            존재하지 않는 게시글입니다.
          </p>
          <button
            onClick={() => navigate('/freeboard')}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
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
          <p className="text-slate-700 text-lg font-semibold mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>로그인이 필요합니다</p>
          <p className="text-slate-400 text-sm mb-6" style={{ fontFamily: "'Pretendard', sans-serif" }}>게시글 상세 내용은 회원만 볼 수 있습니다.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all" style={{ fontFamily: "'Pretendard', sans-serif" }}>
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

      <div className="max-w-4xl mx-auto px-5 pt-24 pb-16">
        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/freeboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            목록으로 돌아가기
          </span>
        </motion.button>

        {/* 게시글 상세 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden mb-6"
        >
          {/* 헤더 */}
          <div className="px-8 py-8 border-b border-sky-50">
            <h1
              className="text-2xl font-black text-slate-800 mb-4"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {board.boardTitle}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/30 overflow-hidden">
                  {board.memberProfile ? (
                    <img src={board.memberProfile} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = board.memberNickname?.[0] || '?'; }} />
                  ) : (
                    board.memberNickname?.[0] || '?'
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                    {board.memberNickname}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {board.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {board.readCount}
                    </span>
                  </div>
                </div>
              </div>

              {(isAuthor || isAdmin) && (
                <div className="flex items-center gap-2">
                  {isAuthor && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/freeboard/write?edit=${boardNo}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors border border-sky-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      수정
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    삭제
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div className="px-8 py-8">
            <p
              className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-6"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {board.boardContent}
            </p>

            {/* 이미지 갤러리 */}
            {imageList.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  <span className="text-sm font-bold text-slate-600">첨부 이미지 ({imageList.length})</span>
                </div>
                <div className={`grid gap-3 ${imageList.length === 1 ? 'grid-cols-1' : imageList.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {imageList.map((imgUrl, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md shadow-sky-100/30 ${imageList.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                      onClick={() => setLightboxImg(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={`이미지 ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/20 transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 좋아요 + 신고 버튼 */}
          <div className="px-8 pb-8 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
                board.isLiked
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200/50'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${board.isLiked ? 'fill-current' : ''}`} />
              좋아요 {board.likeCount}
            </motion.button>

            {/* 게시글 신고 버튼 — 로그인 상태 + 본인 게시글이 아닌 경우만 표시 */}
            {user && !isAuthor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (alreadyReported) return;
                  setReportTarget({ targetType: 'FREEBOARD', targetNo: Number(boardNo) });
                  setShowReportModal(true);
                }}
                disabled={alreadyReported}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
                  alreadyReported
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                <Flag className="w-4 h-4" />
                {alreadyReported ? '신고 완료' : '신고'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* 댓글 섹션 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-sky-50">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                댓글
              </h3>
              <span className="px-2.5 py-0.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold">
                {board.commentCount}
              </span>
            </div>
          </div>

          {/* 댓글 입력 */}
          <div className="px-8 py-4 border-b border-sky-50">
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
                maxLength={500}
                disabled={!user}
                className="flex-1 px-4 py-3 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:bg-slate-50 disabled:text-slate-300"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!user || createCommentMutation.isPending}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-200/50 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>

          {/* 댓글 리스트 */}
          <div className="px-8 py-4">
            {comments.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                첫 번째 댓글을 남겨보세요!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.commentNo}>
                    {/* 부모 댓글 */}
                    <div className="flex gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 overflow-hidden">
                        {comment.memberProfile ? (
                          <img src={comment.memberProfile} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = comment.memberNickname?.[0] || '?'; }} />
                        ) : (
                          comment.memberNickname?.[0] || '?'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-700">{comment.memberNickname}</span>
                          <span className="text-xs text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                          {comment.content}
                        </p>
                        {/* 부모 댓글 액션 버튼: 답글 / 삭제 / 신고 */}
                        <div className="flex items-center gap-3 mt-2">
                          {/* 답글 버튼 — 로그인 시 표시 */}
                          {user && (
                            <button
                              onClick={() => { setReplyTo(replyTo === comment.commentNo ? null : comment.commentNo); setReplyInput(''); }}
                              className="text-xs text-slate-400 hover:text-sky-500 font-semibold transition-colors"
                            >
                              답글
                            </button>
                          )}
                          {/* 삭제 버튼 — 본인 댓글인 경우만 표시 */}
                          {user && Number(user.memberNo) === Number(comment.memberNo) && (
                            <button
                              onClick={() => handleDeleteComment(comment.commentNo)}
                              className="text-xs text-slate-400 hover:text-red-500 font-semibold transition-colors"
                            >
                              삭제
                            </button>
                          )}
                          {/* 댓글 신고 버튼 — 로그인 + 본인 댓글이 아닌 경우만 표시 */}
                          {user && Number(user.memberNo) !== Number(comment.memberNo) && (
                            <button
                              onClick={() => {
                                setReportTarget({ targetType: 'COMMENT', targetNo: comment.commentNo });
                                setReportType('');
                                setReportReason('');
                                setShowReportModal(true);
                              }}
                              className="text-xs text-slate-400 hover:text-orange-500 font-semibold transition-colors inline-flex items-center gap-0.5"
                            >
                              <Flag className="w-3 h-3" />
                              신고
                            </button>
                          )}
                        </div>

                        {/* 답글 입력 */}
                        {replyTo === comment.commentNo && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 mt-3"
                          >
                            <CornerDownRight className="w-4 h-4 text-sky-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              placeholder="답글을 입력하세요"
                              maxLength={500}
                              className="flex-1 px-3 py-2 rounded-lg border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                              style={{ fontFamily: "'Pretendard', sans-serif" }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleReplySubmit(comment.commentNo); } }}
                            />
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleReplySubmit(comment.commentNo)}
                              className="w-9 h-9 rounded-lg bg-gradient-to-r from-sky-400 to-cyan-400 text-white flex items-center justify-center shadow-sm"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* 대댓글 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-3 space-y-3 pl-4 border-l-2 border-sky-100">
                        {comment.replies.map((reply) => (
                          <div key={reply.commentNo} className="flex gap-3">
                            <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                              {reply.memberProfile ? (
                                <img src={reply.memberProfile} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = reply.memberNickname?.[0] || '?'; }} />
                              ) : (
                                reply.memberNickname?.[0] || '?'
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-bold text-slate-600">{reply.memberNickname}</span>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                {reply.content}
                              </p>
                              {/* 대댓글 액션 버튼: 삭제 / 신고 */}
                              <div className="flex items-center gap-2 mt-1">
                                {/* 삭제 버튼 — 본인 대댓글인 경우만 표시 */}
                                {user && Number(user.memberNo) === Number(reply.memberNo) && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.commentNo)}
                                    className="text-[10px] text-slate-400 hover:text-red-500 font-semibold transition-colors"
                                  >
                                    삭제
                                  </button>
                                )}
                                {/* 대댓글 신고 버튼 — 로그인 + 본인 대댓글이 아닌 경우만 표시 */}
                                {user && Number(user.memberNo) !== Number(reply.memberNo) && (
                                  <button
                                    onClick={() => {
                                      setReportTarget({ targetType: 'COMMENT', targetNo: reply.commentNo });
                                      setReportType('');
                                      setReportReason('');
                                      setShowReportModal(true);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-orange-500 font-semibold transition-colors inline-flex items-center gap-0.5"
                                  >
                                    <Flag className="w-2.5 h-2.5" />
                                    신고
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
        </motion.div>
      </div>

      {/* 이미지 라이트박스 */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5"
            onClick={() => setLightboxImg(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightboxImg}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button className="absolute top-6 right-6 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 신고 모달 — 게시글/댓글/대댓글 공용 (reportTarget 상태에 따라 제목 동적 변경) */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-orange-500" />
                  {/* 모달 제목: reportTarget.targetType에 따라 "게시글 신고" 또는 "댓글 신고" 표시 */}
                  <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                    {reportTarget.targetType === 'COMMENT' ? '댓글 신고' : '게시글 신고'}
                  </h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { value: 'SPAM', label: '스팸/광고' },
                  { value: 'ABUSE', label: '욕설/비방' },
                  { value: 'FALSE_INFO', label: '허위정보' },
                  { value: 'ADULT', label: '성인콘텐츠' },
                  { value: 'ETC', label: '기타' },
                ].map((opt) => (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${reportType === opt.value ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                    <input type="radio" name="reportType" value={opt.value} checked={reportType === opt.value} onChange={(e) => setReportType(e.target.value)} className="accent-orange-500" />
                    <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="상세 사유를 입력해주세요 (선택)"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none mb-5"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={reportSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {reportSubmitting ? '접수 중...' : '신고 접수'}
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
