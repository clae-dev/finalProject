import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Loader2, Check, X, Trash2 } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/main/Footer';
import { useCompanionDetail, useJoinCompanion, useCancelJoin, useUpdateJoinStatus, useDeleteCompanion } from '../api/useCompanion';
import { AuthContext } from '../components/AuthContext';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800';

const STATUS_LABEL = { W: '대기', A: '승인', R: '거절' };
const STATUS_COLOR = {
  W: 'bg-yellow-100 text-yellow-700',
  A: 'bg-green-100 text-green-700',
  R: 'bg-red-100 text-red-700',
};

export default function CompanionDetail() {
  const { companionNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const { data, isLoading } = useCompanionDetail(companionNo);
  const joinMutation = useJoinCompanion();
  const cancelMutation = useCancelJoin();
  const updateStatusMutation = useUpdateJoinStatus(Number(companionNo));
  const deleteMutation = useDeleteCompanion();

  const companion = data?.success ? data.data : null;
  const joinList = data?.success ? (data.joinList || []) : [];

  const isAuthor = user && companion && user.memberNo === companion.memberNo;
  const myJoin = user ? joinList.find(j => j.memberNo === user.memberNo) : null;
  const hasJoined = !!myJoin && myJoin.status !== 'R';

  const tagList = companion?.tags ? companion.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const handleJoin = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const result = await joinMutation.mutateAsync(Number(companionNo));
      alert(result.message);
    } catch {
      alert('참여 신청 중 오류가 발생했습니다.');
    }
  };

  const handleCancelJoin = async () => {
    if (!window.confirm('참여를 취소하시겠습니까?')) return;
    try {
      const result = await cancelMutation.mutateAsync(Number(companionNo));
      alert(result.message);
    } catch {
      alert('참여 취소 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateStatus = async (joinNo, status) => {
    const label = status === 'A' ? '승인' : '거절';
    if (!window.confirm(`${label}하시겠습니까?`)) return;
    try {
      const result = await updateStatusMutation.mutateAsync({ joinNo, status });
      alert(result.message);
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const result = await deleteMutation.mutateAsync(Number(companionNo));
      if (result.success) {
        alert('삭제되었습니다.');
        navigate('/companions');
      } else {
        alert(result.message);
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-32">
          <h2 className="text-xl font-bold text-slate-700 mb-2">존재하지 않는 게시글입니다</h2>
          <button onClick={() => navigate('/companions')} className="mt-4 text-sky-500 hover:text-sky-600 font-semibold">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* 이미지 히어로 */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img
          src={companion.imageUrl || DEFAULT_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <button
          onClick={() => navigate('/companions')}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-5 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* 태그 */}
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tagList.map(tag => (
                <span key={tag} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-sm font-medium">
                  #{tag}
                </span>
              ))}
              {companion.status === 'C' && (
                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-sm font-bold">마감</span>
              )}
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">{companion.title}</h1>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-200">
              {companion.authorProfile ? (
                <img src={companion.authorProfile} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                companion.authorNickname?.[0] || '?'
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{companion.authorNickname}</p>
              <p className="text-sm text-slate-400">{companion.authorAgeRange} · {companion.createdAt}</p>
            </div>
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            )}
          </div>

          {/* 여행 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
              <Calendar className="w-5 h-5 text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">여행 일자</p>
                <p className="text-sm font-semibold text-slate-700">{companion.travelDate || '미정'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
              <Users className="w-5 h-5 text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">모집 현황</p>
                <p className="text-sm font-semibold text-slate-700">{companion.currentMembers}/{companion.maxMembers}명</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
              <MapPin className="w-5 h-5 text-sky-500" />
              <div>
                <p className="text-xs text-slate-400">상태</p>
                <p className="text-sm font-semibold text-slate-700">
                  {companion.status === 'Y' ? '모집중' : '마감'}
                </p>
              </div>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="mb-8">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{companion.content}</p>
          </div>

          {/* 참여 버튼 (작성자 아닌 경우) */}
          {!isAuthor && companion.status === 'Y' && (
            <div className="mb-8">
              {hasJoined ? (
                <button
                  onClick={handleCancelJoin}
                  disabled={cancelMutation.isPending}
                  className="w-full py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  {cancelMutation.isPending ? '처리 중...' : '참여 취소'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joinMutation.isPending}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-200"
                >
                  {joinMutation.isPending ? '처리 중...' : '참여 신청하기'}
                </button>
              )}
            </div>
          )}

          {/* 참여자 목록 (작성자만 관리 가능) */}
          {joinList.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                참여 신청 목록 ({joinList.length})
              </h3>
              <div className="space-y-3">
                {joinList.map(join => (
                  <div key={join.joinNo} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                        {join.memberProfile ? (
                          <img src={join.memberProfile} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          join.memberNickname?.[0] || '?'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{join.memberNickname}</p>
                        <p className="text-xs text-slate-400">{join.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[join.status] || 'bg-slate-100 text-slate-500'}`}>
                        {STATUS_LABEL[join.status] || join.status}
                      </span>
                      {isAuthor && join.status === 'W' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(join.joinNo, 'A')}
                            className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(join.joinNo, 'R')}
                            className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
