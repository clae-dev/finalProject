import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, AccommodationReview, ReviewSummary, PageResponse } from "../../types";

// 숙소 후기 목록
export const getAccommodationReviews = async (
  accommodationNo: number | string,
  page = 1,
  size = 5
): Promise<ApiResponse<PageResponse<AccommodationReview>>> => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}/reviews`, {
    params: { page, size }
  });
  return response.data;
};

// 숙소 후기 요약 (평균 별점 + 총 개수)
export const getReviewSummary = async (
  accommodationNo: number | string
): Promise<ApiResponse<ReviewSummary>> => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}/reviews/summary`);
  return response.data;
};

// 숙소 후기 작성
export const createAccommodationReview = async (
  accommodationNo: number | string,
  formData: FormData
): Promise<ApiResponse<AccommodationReview>> => {
  const response = await axiosApi.post(`/api/accommodations/${accommodationNo}/reviews`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 숙소 후기 삭제
export const deleteAccommodationReview = async (
  accommodationNo: number | string,
  reviewNo: number | string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/accommodations/${accommodationNo}/reviews/${reviewNo}`);
  return response.data;
};
