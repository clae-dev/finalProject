import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function OAuthCallback() {
  const { handleSocialLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    // URL 경로에서 provider 추출: /oauth/{provider}/callback
    const pathParts = location.pathname.split('/');
    const provider = pathParts[2]; // ['', 'oauth', 'kakao', 'callback']

    if (!code) {
      setError('인가 코드를 찾을 수 없습니다.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const processLogin = async () => {
      try {
        await handleSocialLogin(provider, code);
        navigate('/');
      } catch (err) {
        console.error('소셜 로그인 처리 실패:', err);
        setError(err.response?.data?.message || err.message || '소셜 로그인에 실패했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processLogin();
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
