/**
 * OAuth 로그인 콜백 처리 컴포넌트 - URL 파라미터에서 토큰/유저 정보 추출 후 로그인 완료
 */
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function OAuthCallback() {
  const { handleOAuthCallback } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let timerId;
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const errorMsg = params.get('error');

    if (errorMsg) {
      setError(errorMsg);
      timerId = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timerId);
    }

    if (!accessToken) {
      setError('로그인 정보를 찾을 수 없습니다.');
      timerId = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timerId);
    }

    try {
      handleOAuthCallback({
        accessToken,
        refreshToken: params.get('refreshToken'),
        memberNo: params.get('memberNo'),
        memberName: params.get('memberName'),
        memberNickname: params.get('memberNickname'),
        memberEmail: params.get('memberEmail'),
        memberProfileImg: params.get('memberProfileImg'),
        loginType: params.get('loginType')
      });

      navigate('/');
    } catch (err) {
      console.error('OAuth 콜백 처리 실패:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
      timerId = setTimeout(() => navigate('/login'), 3000);
    }

    return () => clearTimeout(timerId);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-cyan-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <p className="text-slate-700 font-medium mb-2">로그인 실패</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <p className="text-slate-400 text-xs">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-cyan-50">
      <div className="text-center p-8">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
