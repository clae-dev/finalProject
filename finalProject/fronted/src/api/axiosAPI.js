import axios from "axios";

/**
 * Axios 인스턴스 생성
 * - 학원 패턴 기반
 * - Spring Boot 서버와 통신
 */
export const axiosApi = axios.create({
  baseURL: ""
});

// Request 인터셉터: JWT 토큰 자동 추가
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 401 에러 처리
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);