import { axiosApi } from "../core/axiosAPI";

/**
 * FAQ API
 */

// 카테고리 목록 조회
export const getFaqCategories = async () => {
  const response = await axiosApi.get("/api/faq/categories");
  return response.data;
};

// FAQ 전체 조회 (사용자용)
export const getFaqList = async (category = null, search = '') => {
  const params = {};
  if (category) params.category = category;
  if (search) params.search = search;
  const response = await axiosApi.get("/api/faq", { params });
  return response.data;
};

// 조회수 증가
export const increaseFaqView = async (faqNo) => {
  const response = await axiosApi.put(`/api/faq/${faqNo}/view`);
  return response.data;
};

// 관리자 FAQ 목록
export const getAdminFaqList = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/faq", { params });
  return response.data;
};

// FAQ 등록
export const createFaq = async (faq) => {
  const response = await axiosApi.post("/api/admin/faq", faq);
  return response.data;
};

// FAQ 수정
export const updateFaq = async (faqNo, faq) => {
  const response = await axiosApi.put(`/api/admin/faq/${faqNo}`, faq);
  return response.data;
};

// FAQ 삭제
export const deleteFaq = async (faqNo) => {
  const response = await axiosApi.delete(`/api/admin/faq/${faqNo}`);
  return response.data;
};
