import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * 마이페이지 컴포넌트 (수정 버전)
 */

function MyPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
        마이페이지
      </h2>

      {/* 프로필 카드 */}
      <div className="card-gradient p-5 sm:p-6 mb-6 page-enter">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
          {/* 프로필 아바타 */}
          <div className="avatar-gradient w-14 h-14 sm:w-16 sm:h-16 rounded-full
                          flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
            {user.memberNickname?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {user.memberNickname}
            </h3>
            <p className="text-sm text-gray-500">{user.memberEmail}</p>
          </div>
        </div>

        {/* 정보 목록 */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center py-3 px-4 rounded-xl
                          transition-all duration-200
                          hover:bg-blue-50 hover:shadow-sm hover:-translate-x-1 
                          cursor-default">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">회원 번호</span>
            <span className="text-gray-800 font-medium">#{user.memberNo}</span>
          </div>
          
          <div className="flex items-center py-3 px-4 rounded-xl
                          transition-all duration-200
                          hover:bg-blue-50 hover:shadow-sm hover:-translate-x-1
                          cursor-default">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">이름</span>
            <span className="text-gray-800 font-medium">{user.memberName}</span>
          </div>
          
          <div className="flex items-center py-3 px-4 rounded-xl
                          transition-all duration-200
                          hover:bg-blue-50 hover:shadow-sm hover:-translate-x-1
                          cursor-default">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">닉네임</span>
            <span className="text-gray-800 font-medium">{user.memberNickname}</span>
          </div>
          
          <div className="flex items-center py-3 px-4 rounded-xl
                          transition-all duration-200
                          hover:bg-blue-50 hover:shadow-sm hover:-translate-x-1
                          cursor-default">
            <span className="w-24 sm:w-28 text-sm text-gray-500 font-medium">이메일</span>
            <span className="text-gray-800 font-medium break-all">{user.memberEmail}</span>
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => alert('프로필 수정 기능은 준비 중입니다.')}
          className="flex-1 btn-primary"
        >
          프로필 수정
        </button>
        
        <button
          onClick={() => alert('비밀번호 변경 기능은 준비 중입니다.')}
          className="flex-1 btn-secondary"
        >
          비밀번호 변경
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="card p-4 text-center hover-lift cursor-default">
          <div className="text-2xl font-bold text-jeju-600 mb-1">0</div>
          <div className="text-sm text-gray-600">작성 글</div>
        </div>
        
        <div className="card p-4 text-center hover-lift cursor-default">
          <div className="text-2xl font-bold text-emerald-600 mb-1">0</div>
          <div className="text-sm text-gray-600">작성 후기</div>
        </div>
      </div>

      {/* 활동 배지 */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">활동 배지</h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge-jeju">🌊 신규 혼행러</span>
          <span className="badge-emerald">✨ 제주 탐험가</span>
        </div>
      </div>
    </div>
  );
}

export default MyPage;