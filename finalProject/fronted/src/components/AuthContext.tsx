import { createContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import axios from "axios";
import { axiosApi } from "../api/core/axiosAPI";
import { getToken, saveToken, clearAllAuth } from "../api/core/tokenStorage";
import type { Member, LoginResponse, RefreshResponse } from "../types";

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

  // 앱 시작 시 토큰 유효성 검증 및 만료된 accessToken 능동적 갱신
  useEffect(() => {
    const token = getToken("accessToken");
    const refreshToken = getToken("refreshToken");
    const storedUser = getToken("userData");

    // userData 자체가 없으면 로그인 상태가 아님
    if (!storedUser) return;

    // accessToken 만료 여부 확인
    let isExpired = false;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        isExpired = payload.exp * 1000 < Date.now();
      } catch {
        isExpired = true;
      }
    } else {
      isExpired = true; // 토큰 자체가 없으면 만료 취급
    }

    if (isExpired) {
      if (!refreshToken) {
        // 리프레시 토큰도 없으면 → 완전 로그아웃
        clearAllAuth();
        setUser(null);
        return;
      }

      // 리프레시 토큰으로 능동적 갱신 시도 (plain axios로 interceptor 순환 방지)
      axios.post<{ success: boolean; data: RefreshResponse }>("/api/member/refresh", { refreshToken })
        .then((response) => {
          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            saveToken("accessToken", accessToken);
            saveToken("refreshToken", newRefreshToken);
            // userData도 갱신
            const data = response.data.data;
            const parsed = JSON.parse(storedUser);
            const updated: Member = {
              ...parsed,
              memberNo: data.memberNo ?? parsed.memberNo,
              memberName: data.memberName ?? parsed.memberName,
              memberNickname: data.memberNickname ?? parsed.memberNickname,
              memberEmail: data.memberEmail ?? parsed.memberEmail,
              memberProfileImg: data.memberProfileImg || parsed.memberProfileImg,
              memberPhone: data.memberPhone || parsed.memberPhone || '',
              memberIntro: data.memberIntro || parsed.memberIntro || '',
            };
            setUser(updated);
            saveToken("userData", JSON.stringify(updated));
          } else {
            clearAllAuth();
            setUser(null);
            alert("인증이 만료되어 자동 로그아웃 되었습니다. 다시 로그인해 주세요.");
          }
        })
        .catch(() => {
          clearAllAuth();
          setUser(null);
          alert("인증이 만료되어 자동 로그아웃 되었습니다. 다시 로그인해 주세요.");
        });
    }
  }, []);

  // ── 1시간 미활동 자동 로그아웃 ──
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1시간
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
        window.location.href = "/home";
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
      window.location.href = "/home";

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
    window.location.href = "/home";
  };

  // 자식 컴포넌트에게 전달할 데이터를 하나로 묶기
  const globalState: AuthContextType = {
    user,
    setUser,
    email,
    password,
    changeInputEmail,
    changeInputPw,
    handleLogin,
    handleOAuthCallback,
    handleLogout
  };

  return (
    <AuthContext.Provider value={globalState}>
      {children}
    </AuthContext.Provider>
  );
};
