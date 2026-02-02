import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * 마이페이지 컴포넌트 (학원 패턴)
 * - 로그인한 사용자 정보 표시
 */

function MyPage() {
  const { user } = useContext(AuthContext);

  return (
    // [수정] 반응형 패딩 및 마진 적용
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* [수정] 페이지 타이틀 - 반응형 크기 */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
        마이페이지
      </h2>

      {/* [수정] 프로필 카드 - 개선된 스타일 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
        {/* 헤더 영역 */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
          {/* [추가] 프로필 아바타 */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-jeju-400 to-emerald-400
                          rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold
                          shadow-lg shadow-jeju-500/20">
            {user.memberNickname?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {user.memberNickname}
            </h3>
            <p className="text-sm text-gray-500">{user.memberEmail}</p>
          </div>
        </div>

        {/* [수정] 정보 목록 - 그리드 레이아웃으로 개선 */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">회원 번호</span>
            <span className="text-gray-800 font-medium">{user.memberNo}</span>
          </div>
          <div className="flex items-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">이름</span>
            <span className="text-gray-800 font-medium">{user.memberName}</span>
          </div>
          <div className="flex items-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">닉네임</span>
            <span className="text-gray-800 font-medium">{user.memberNickname}</span>
          </div>
          <div className="flex items-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">이메일</span>
            <span className="text-gray-800 font-medium break-all">{user.memberEmail}</span>
          </div>
        </div>
      </div>

      {/* [수정] 버튼 그룹 - 제주 컬러, 접근성 개선 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => alert('프로필 수정 기능은 준비 중입니다.')}
          className="flex-1 bg-jeju-500 hover:bg-jeju-600 text-white font-semibold
                     py-3 px-4 rounded-xl transition-all duration-200
                     hover:shadow-lg hover:shadow-jeju-500/25
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-jeju-500 focus-visible:ring-offset-2
                     active:scale-[0.98]"
        >
          프로필 수정
        </button>
        <button
          onClick={() => alert('내 활동 조회 기능은 준비 중입니다.')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold
                     py-3 px-4 rounded-xl transition-all duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                     active:scale-[0.98]"
        >
          내 활동 조회
        </button>
      </div>
    </div>
  );
}

export default MyPage;
