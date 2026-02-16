import { axiosApi } from "../core/axiosAPI";

// 게시글 목록 (페이징 + 검색)
export const getActivityList = async (page = 1, size = 9, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/activities", { params });
  return response.data;
};

// 게시글 상세 조회
export const getActivityDetail = async (boardNo) => {
  const response = await axiosApi.get(`/api/activities/${boardNo}`);
  return response.data;
};

// 게시글 작성 (multipart/form-data)
export const createActivity = async (formData) => {
  const response = await axiosApi.post("/api/activities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 게시글 수정 (multipart/form-data)
export const updateActivity = async (boardNo, formData) => {
  const response = await axiosApi.put(`/api/activities/${boardNo}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 게시글 삭제
export const deleteActivity = async (boardNo) => {
  const response = await axiosApi.delete(`/api/activities/${boardNo}`);
  return response.data;
};

// 댓글 목록
export const getActivityCommentList = async (boardNo) => {
  const response = await axiosApi.get(`/api/activities/${boardNo}/comments`);
  return response.data;
};

// 댓글 작성
export const createActivityComment = async (boardNo, content, parentCommentNo = null) => {
  const params = new URLSearchParams();
  params.append('content', content);
  if (parentCommentNo) params.append('parentCommentNo', parentCommentNo);
  const response = await axiosApi.post(`/api/activities/${boardNo}/comments`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// 댓글 삭제
export const deleteActivityComment = async (commentNo) => {
  const response = await axiosApi.delete(`/api/activities/comments/${commentNo}`);
  return response.data;
};

// 좋아요 토글
export const toggleActivityLike = async (boardNo) => {
  const response = await axiosApi.post(`/api/activities/${boardNo}/like`);
  return response.data;
};
