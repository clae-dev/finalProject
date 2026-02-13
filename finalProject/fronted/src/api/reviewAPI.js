import { axiosApi } from "./axiosAPI";

/**
 * 동행 후기 API
 */

// 목록 조회 (페이징)
export const getReviewList = async (page = 1, size = 9) => {
  const response = await axiosApi.get("/api/reviews", { params: { page, size } });
  return response.data;
};

// 상세 조회
export const getReviewDetail = async (reviewNo) => {
  const response = await axiosApi.get(`/api/reviews/${reviewNo}`);
  return response.data;
};

// 작성 (multipart/form-data)
export const createReview = async (formData) => {
  const response = await axiosApi.post("/api/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 삭제
export const deleteReview = async (reviewNo) => {
  const response = await axiosApi.delete(`/api/reviews/${reviewNo}`);
  return response.data;
};

// 메인페이지용 최신 후기
export const getRecentReviews = async (limit = 9) => {
  const response = await axiosApi.get("/api/reviews/recent", { params: { limit } });
  return response.data;
};
