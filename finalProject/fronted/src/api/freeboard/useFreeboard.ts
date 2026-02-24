import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFreeBoardList,
  getFreeBoardDetail,
  createFreeBoard,
  updateFreeBoard,
  deleteFreeBoard,
  getCommentList,
  createComment,
  deleteComment,
  toggleLike,
} from './freeboardAPI';

/** 게시글 목록 */
export const useFreeBoardList = (page = 1, size = 9, search = '') => {
  return useQuery({
    queryKey: ['freeboards', page, size, search],
    queryFn: () => getFreeBoardList(page, size, search),
  });
};

/** 게시글 상세 */
export const useFreeBoardDetail = (boardNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['freeboard', boardNo],
    queryFn: () => getFreeBoardDetail(boardNo!),
    enabled: !!boardNo,
  });
};

/** 게시글 작성 */
export const useCreateFreeBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createFreeBoard(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboards'] });
    },
  });
};

/** 게시글 수정 */
export const useUpdateFreeBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardNo, formData }: { boardNo: number | string; formData: FormData }) =>
      updateFreeBoard(boardNo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboards'] });
      queryClient.invalidateQueries({ queryKey: ['freeboard'] });
    },
  });
};

/** 게시글 삭제 */
export const useDeleteFreeBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardNo: number | string) => deleteFreeBoard(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboards'] });
    },
  });
};

/** 댓글 목록 */
export const useCommentList = (boardNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['freeboard-comments', boardNo],
    queryFn: () => getCommentList(boardNo!),
    enabled: !!boardNo,
  });
};

/** 댓글 작성 */
export const useCreateComment = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentCommentNo }: { content: string; parentCommentNo?: number | null }) =>
      createComment(boardNo, content, parentCommentNo ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboard-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['freeboard', String(boardNo)] });
    },
  });
};

/** 댓글 삭제 */
export const useDeleteComment = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentNo: number | string) => deleteComment(commentNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboard-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['freeboard', String(boardNo)] });
    },
  });
};

/** 좋아요 토글 */
export const useToggleLike = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLike(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeboard', String(boardNo)] });
    },
  });
};
