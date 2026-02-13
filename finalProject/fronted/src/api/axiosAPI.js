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

// --- 토큰 자동 갱신 메커니즘 ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const forceLogout = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
  window.location.href = "/";
};

// Response 인터셉터: 401 시 Refresh Token으로 자동 갱신
axiosApi.interceptors.response.use(
  (response) => {
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

    const refreshToken = localStorage.getItem("refreshToken");
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
      const response = await axios.post("/api/member/refresh", {
        refreshToken: refreshToken
      });

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // 새 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // 유저 정보도 갱신
        const userData = response.data.data;
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const updated = {
            ...parsed,
            memberNo: userData.memberNo,
            memberName: userData.memberName,
            memberNickname: userData.memberNickname,
            memberEmail: userData.memberEmail,
            memberProfileImg: userData.memberProfileImg || parsed.memberProfileImg
          };
          localStorage.setItem("userData", JSON.stringify(updated));
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
