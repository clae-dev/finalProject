import { axiosApi } from "../core/axiosAPI";

// 숙소 후기 목록
export const getAccommodationReviews = async (accommodationNo, page = 1, size = 5) => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}/reviews`, {
    params: { page, size }
  });
  return response.data;
};

// 숙소 후기 요약 (평균 별점 + 총 개수)
export const getReviewSummary = async (accommodationNo) => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}/reviews/summary`);
  return response.data;
};

// 숙소 후기 작성
export const createAccommodationReview = async (accommodationNo, formData) => {
  const response = await axiosApi.post(`/api/accommodations/${accommodationNo}/reviews`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 숙소 후기 삭제
export const deleteAccommodationReview = async (accommodationNo, reviewNo) => {
  const response = await axiosApi.delete(`/api/accommodations/${accommodationNo}/reviews/${reviewNo}`);
  return response.data;
};
