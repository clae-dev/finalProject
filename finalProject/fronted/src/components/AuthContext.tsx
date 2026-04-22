import { createContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from "react";
import { axiosApi } from "../api/core/axiosAPI";
import { getToken, saveToken, clearAllAuth } from "../api/core/tokenStorage";
import type { Member, LoginResponse } from "../types";

/**
 * 인증 Context
 * - 로그인 상태 관리
 * - globalState 객체로 전달
 */

export interface AuthContextType {
  user: Member | null;
  setUser: React.Dispatch<React.SetStateAction<Member | null>>;
  email: string;
  password: string;
  changeInputEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeInputPw: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleOAuthCallback: (loginData: LoginResponse) => void;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 상태 제공자(Provider) 정의
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 로그인한 회원 정보를 기억할 상태
  const [user, setUser] = useState<Member | null>(() => {
    const storedUser = getToken("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ── 미활동 제한 시간 (30분) ──
  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  // 앱 시작 시 세션 유효성 체크 (미활동 타임아웃, 리프레시 토큰 부재 시 로그아웃)
  // 만료된 accessToken 갱신은 axios 응답 인터셉터(401 → refresh)에 위임하여 중복 호출 제거.
  useEffect(() => {
    const token = getToken("accessToken");
    const refreshToken = getToken("refreshToken");
    const storedUser = getToken("userData");

    // userData 자체가 없으면 로그인 상태가 아님
    if (!storedUser) return;

    // 마지막 활동 시간 체크 — 브라우저를 닫았다가 돌아온 경우 대응
    const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0", 10);
    if (lastActivity > 0 && Date.now() - lastActivity >= INACTIVITY_LIMIT) {
      clearAllAuth();
      localStorage.removeItem("lastActivity");
      setUser(null);
      alert("장시간 활동이 없어 자동 로그아웃 되었습니다.");
      return;
    }

    // accessToken도 refreshToken도 없으면 즉시 로그아웃 처리
    if (!token && !refreshToken) {
      clearAllAuth();
      setUser(null);
    }
  }, []);

  // ── 30분 미활동 자동 로그아웃 (탭이 열려 있는 동안) ──
  const CHECK_INTERVAL   = 60 * 1000;      // 1분마다 체크
  const logoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLastActivity = useCallback(() => {
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  useEffect(() => {
    if (!user) return;

    // 로그인 시점에 활동 시간 초기화
    updateLastActivity();

    const events = ["click", "keydown", "scroll", "mousemove", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateLastActivity, { passive: true }));

    logoutTimerRef.current = setInterval(() => {
      const last = parseInt(localStorage.getItem("lastActivity") || "0", 10);
      if (Date.now() - last >= INACTIVITY_LIMIT) {
        clearInterval(logoutTimerRef.current!);
        alert("장시간 활동이 없어 자동 로그아웃 되었습니다.");
        clearAllAuth();
        setUser(null);
        window.location.href = "/";
      }
    }, CHECK_INTERVAL);

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateLastActivity));
      clearInterval(logoutTimerRef.current!);
    };
  }, [user, updateLastActivity]);

  // 이메일 입력 핸들러
  const changeInputEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 핸들러
  const changeInputPw = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await axiosApi.post<{ success: boolean; message?: string; data: LoginResponse }>(
        "/api/member/login",
        { memberEmail: email, memberPw: password }
      );

      if (!response.data.success) {
        alert(response.data.message || "이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      const loginData = response.data.data;

      // JWT 토큰 저장
      saveToken("accessToken", loginData.accessToken);
      saveToken("refreshToken", loginData.refreshToken);

      // 사용자 정보 저장
      const userData: Member = {
        memberNo: loginData.memberNo,
        memberName: loginData.memberName,
        memberNickname: loginData.memberNickname,
        memberEmail: email,
        memberProfileImg: loginData.memberProfileImg || null,
        memberRole: loginData.memberRole || 'U',
        memberPhone: loginData.memberPhone || '',
        memberIntro: loginData.memberIntro || '',
        verifiedReviewer: loginData.verifiedReviewer || 'N',
        loginType: null,
      };

      setUser(userData);
      saveToken("userData", JSON.stringify(userData));

      // 입력 필드 초기화
      setEmail("");
      setPassword("");

      // 홈 페이지로 이동
      window.location.href = "/";

    } catch (error: unknown) {
      console.error("로그인 실패:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        alert(axiosError.response.data.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // OAuth 콜백 처리 함수
  const handleOAuthCallback = (loginData: LoginResponse): void => {
    // JWT 토큰 저장
    saveToken("accessToken", loginData.accessToken);
    if (loginData.refreshToken) {
      saveToken("refreshToken", loginData.refreshToken);
    }

    // 사용자 정보 저장 (loginType 포함)
    const userData: Member = {
      memberNo: loginData.memberNo,
      memberName: loginData.memberName,
      memberNickname: loginData.memberNickname,
      memberEmail: loginData.memberEmail,
      memberProfileImg: loginData.memberProfileImg || null,
      loginType: loginData.loginType || null,
      memberRole: loginData.memberRole || 'U',
      memberPhone: loginData.memberPhone || '',
      memberIntro: loginData.memberIntro || '',
      verifiedReviewer: loginData.verifiedReviewer || 'N',
    };

    setUser(userData);
    saveToken("userData", JSON.stringify(userData));

    // DB에서 최신 프로필 정보 동기화 (프로필 이미지 등 누락 방지)
    if (loginData.memberNo) {
      axiosApi.get<{ success: boolean; data: Member }>(`/api/member/${loginData.memberNo}`)
        .then(response => {
          if (response.data.success && response.data.data) {
            const member = response.data.data;
            const synced: Member = {
              ...userData,
              memberProfileImg: member.memberProfileImg || userData.memberProfileImg,
              memberNickname: member.memberNickname || userData.memberNickname,
              memberPhone: member.memberPhone || userData.memberPhone || '',
              memberIntro: member.memberIntro || userData.memberIntro || '',
            };
            setUser(synced);
            saveToken("userData", JSON.stringify(synced));
          }
        })
        .catch(() => { /* 동기화 실패 시 무시 - OAuth 데이터로 유지 */ });
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async (): Promise<void> => {
    // OAuth 로그인인 경우 해당 플랫폼 로그아웃 API 호출 (best-effort)
    const storedUser = getToken("userData");
    if (storedUser) {
      try {
        const parsedUser: Member = JSON.parse(storedUser);
        const loginType = parsedUser.loginType;
        if (loginType && ["kakao", "naver", "google"].includes(loginType)) {
          const accessToken = getToken("accessToken");
          if (accessToken) {
            await axiosApi.post(`/api/oauth/${loginType}/logout`, null, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
          }
        }
      } catch (e) {
        console.warn("OAuth 로그아웃 실패 (무시):", e);
      }
    }

    // 양쪽 Storage 모두 삭제
    clearAllAuth();
    setUser(null);
    setEmail("");
    setPassword("");
    // 홈으로 이동
    window.location.href = "/";
  };

  // 자식 컴포넌트에게 전달할 데이터를 하나로 묶기
  // 불필요한 context 소비자 리렌더 방지를 위해 useMemo로 식별성 유지
  const globalState: AuthContextType = useMemo(() => ({
    user,
    setUser,
    email,
    password,
    changeInputEmail,
    changeInputPw,
    handleLogin,
    handleOAuthCallback,
    handleLogout
  }), [user, email, password]);

  return (
    <AuthContext.Provider value={globalState}>
      {children}
    </AuthContext.Provider>
  );
};
