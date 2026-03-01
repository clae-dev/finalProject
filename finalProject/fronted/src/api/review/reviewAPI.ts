import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Review, PageResponse } from "../../types";

/**
 * 동행 후기 API
 */

// 목록 조회 (페이징 + 검색 + 정렬)
export const getReviewList = async (
  page = 1,
  size = 9,
  search = '',
  sort = 'latest'
): Promise<ApiResponse<PageResponse<Review>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  if (sort && sort !== 'latest') params.sort = sort;
  const response = await axiosApi.get("/api/reviews", { params });
  return response.data;
};

// 상세 조회
export const getReviewDetail = async (reviewNo: number | string): Promise<ApiResponse<Review>> => {
  const response = await axiosApi.get(`/api/reviews/${reviewNo}`);
  return response.data;
};

// 작성 (multipart/form-data)
export const createReview = async (formData: FormData): Promise<ApiResponse<Review>> => {
  const response = await axiosApi.post("/api/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 삭제
export const deleteReview = async (reviewNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/reviews/${reviewNo}`);
  return response.data;
};

// 메인페이지용 최신 후기
export const getRecentReviews = async (limit = 9): Promise<ApiResponse<Review[]>> => {
  const response = await axiosApi.get("/api/reviews/recent", { params: { limit } });
  return response.data;
};
