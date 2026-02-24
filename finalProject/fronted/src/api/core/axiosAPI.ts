import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, saveToken, clearAllAuth } from "./tokenStorage";
import type { ApiResponse, RefreshResponse } from "../../types";

/**
 * Axios 인스턴스 생성
 * - Spring Boot 서버와 통신
 * - tokenStorage 유틸로 localStorage 자동 관리
 */
export const axiosApi: AxiosInstance = axios.create({
  baseURL: ""
});

// Request 인터셉터: JWT 토큰 자동 추가
axiosApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 토큰 자동 갱신 메커니즘 ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
};

const forceLogout = (): void => {
  clearAllAuth();
  alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
  window.location.href = "/";
};

// http:// → https:// 변환 (Mixed Content 방지)
const upgradeHttpUrls = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return data.startsWith('http://') ? data.replace('http://', 'https://') : data;
  }
  if (Array.isArray(data)) {
    return data.map(upgradeHttpUrls);
  }
  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = upgradeHttpUrls(value);
    }
    return result;
  }
  return data;
};

// Response 인터셉터: 401 시 Refresh Token으로 자동 갱신
axiosApi.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = upgradeHttpUrls(response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401이 아니거나, 이미 재시도한 요청이면 그대로 reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 → 강제 로그아웃
    if (originalRequest.url === "/api/member/refresh") {
      forceLogout();
      return Promise.reject(error);
    }

    const refreshToken = getToken("refreshToken");
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    // 이미 갱신 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosApi(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 갱신 요청은 인터셉터를 타지 않는 plain axios 사용
      const response = await axios.post<ApiResponse<RefreshResponse>>("/api/member/refresh", {
        refreshToken: refreshToken
      });

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // 새 토큰 저장
        saveToken("accessToken", accessToken);
        saveToken("refreshToken", newRefreshToken);

        // 유저 정보도 갱신
        const userData = response.data.data;
        const storedUser = getToken("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const updated = {
            ...parsed,
            memberNo: userData.memberNo ?? parsed.memberNo,
            memberName: userData.memberName ?? parsed.memberName,
            memberNickname: userData.memberNickname ?? parsed.memberNickname,
            memberEmail: userData.memberEmail ?? parsed.memberEmail,
            memberProfileImg: userData.memberProfileImg || parsed.memberProfileImg,
            memberPhone: userData.memberPhone || parsed.memberPhone || '',
            memberIntro: userData.memberIntro || parsed.memberIntro || '',
          };
          saveToken("userData", JSON.stringify(updated));
        }

        // 대기 중인 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosApi(originalRequest);
      } else {
        processQueue(new Error("토큰 갱신 실패"));
        forceLogout();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
