import { axiosApi } from "../core/axiosAPI";

// 게시글 목록 (페이징 + 검색)
export const getFreeBoardList = async (page = 1, size = 9, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/freeboards", { params });
  return response.data;
};

// 게시글 상세 조회
export const getFreeBoardDetail = async (boardNo) => {
  const response = await axiosApi.get(`/api/freeboards/${boardNo}`);
  return response.data;
};

// 게시글 작성 (multipart/form-data)
export const createFreeBoard = async (formData) => {
  const response = await axiosApi.post("/api/freeboards", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 게시글 수정 (multipart/form-data)
export const updateFreeBoard = async (boardNo, formData) => {
  const response = await axiosApi.put(`/api/freeboards/${boardNo}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 게시글 삭제
export const deleteFreeBoard = async (boardNo) => {
  const response = await axiosApi.delete(`/api/freeboards/${boardNo}`);
  return response.data;
};

// 댓글 목록
export const getCommentList = async (boardNo) => {
  const response = await axiosApi.get(`/api/freeboards/${boardNo}/comments`);
  return response.data;
};

// 댓글 작성
export const createComment = async (boardNo, content, parentCommentNo = null) => {
  const params = new URLSearchParams();
  params.append('content', content);
  if (parentCommentNo) params.append('parentCommentNo', parentCommentNo);
  const response = await axiosApi.post(`/api/freeboards/${boardNo}/comments`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentNo) => {
  const response = await axiosApi.delete(`/api/freeboards/comments/${commentNo}`);
  return response.data;
};

// 좋아요 토글
export const toggleLike = async (boardNo) => {
  const response = await axiosApi.post(`/api/freeboards/${boardNo}/like`);
  return response.data;
};
