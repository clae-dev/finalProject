import { createContext, useState } from "react";
import { axiosApi } from "../api/axiosAPI";

/**
 * 인증 Context (학원 패턴)
 * - 로그인 상태 관리
 * - localStorage 사용
 * - globalState 객체로 전달
 */

export const AuthContext = createContext();

// 전역 상태 제공자(Provider) 정의
export const AuthProvider = ({ children }) => {
  // 로그인한 회원 정보를 기억할 상태
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 입력 핸들러
  const changeInputEmail = (e) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 핸들러
  const changeInputPw = (e) => {
    setPassword(e.target.value);
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 이벤트 막기

    try {
      // 비동기 로그인 요청
      const response = await axiosApi.post("/api/member/login", {
        memberEmail: email,
        memberPw: password
      });

      console.log("로그인 응답:", response);

      // 응답 데이터 확인
      if (!response.data.success) {
        alert(response.data.message || "이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      const loginData = response.data.data;

      // JWT 토큰 저장
      localStorage.setItem("accessToken", loginData.accessToken);
      localStorage.setItem("refreshToken", loginData.refreshToken);

      // 사용자 정보 저장
      const userData = {
        memberNo: loginData.memberNo,
        memberName: loginData.memberName,
        memberNickname: loginData.memberNickname,
        memberEmail: email
      };

      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));

      // 입력 필드 초기화
      setEmail("");
      setPassword("");

      // 1시간 후 자동 로그아웃 타이머 설정
      setTimeout(() => {
        handleLogout();
        alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
      }, 60 * 60 * 1000); // 1시간

    } catch (error) {
      console.error("로그인 실패:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setEmail("");
    setPassword("");
    // 로그인 페이지로 이동
    window.location.href = "/";
  };

  // 자식 컴포넌트에게 전달할 데이터를 하나로 묶기
  const globalState = {
    user,
    email,
    password,
    changeInputEmail,
    changeInputPw,
    handleLogin,
    handleLogout
  };

  return (
    <AuthContext.Provider value={globalState}>
      {children}
    </AuthContext.Provider>
  );
};

/*
 * localStorage vs sessionStorage
 * 
 * localStorage:
 * - 브라우저를 닫아도 데이터가 영구적으로 유지
 * - 브라우저 전역에서 사용 (모든 탭과 창에서 공유)
 * - 유효기간 만료 기능 없음 (setTimeout으로 직접 구현)
 * 
 * sessionStorage:
 * - 브라우저 탭을 닫으면 데이터 즉시 삭제
 * - 현재 탭에서만 데이터 유지
 * - 유효기간 만료 기능 없음
 */