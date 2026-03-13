import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActivityList,
  getActivityDetail,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityCommentList,
  createActivityComment,
  deleteActivityComment,
  toggleActivityLike,
} from './activityAPI';
import { getEventList, getLeisureList } from './eventAPI';

/** 게시글 목록 */
export const useActivityList = (page = 1, size = 9, search = '') => {
  return useQuery({
    queryKey: ['activities', page, size, search],
    queryFn: () => getActivityList(page, size, search),
    staleTime: 1000 * 60 * 3,
  });
};

/** 게시글 상세 */
export const useActivityDetail = (boardNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['activity', boardNo],
    queryFn: () => getActivityDetail(boardNo!),
    enabled: !!boardNo,
    staleTime: 1000 * 60 * 3,
  });
};

/** 게시글 작성 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createActivity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/** 게시글 수정 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardNo, formData }: { boardNo: number | string; formData: FormData }) =>
      updateActivity(boardNo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
};

/** 게시글 삭제 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardNo: number | string) => deleteActivity(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/** 댓글 목록 */
export const useActivityCommentList = (boardNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['activity-comments', boardNo],
    queryFn: () => getActivityCommentList(boardNo!),
    enabled: !!boardNo,
    staleTime: 1000 * 60 * 3,
  });
};

/** 댓글 작성 */
export const useCreateActivityComment = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentCommentNo }: { content: string; parentCommentNo?: number | null }) =>
      createActivityComment(boardNo, content, parentCommentNo ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['activity', String(boardNo)] });
    },
  });
};

/** 댓글 삭제 */
export const useDeleteActivityComment = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentNo: number | string) => deleteActivityComment(commentNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['activity', String(boardNo)] });
    },
  });
};

/** 좋아요 토글 */
export const useToggleActivityLike = (boardNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleActivityLike(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', String(boardNo)] });
    },
  });
};

/** 공공 행사 목록 (TourAPI) */
export const useEventList = (page = 1, size = 9) => {
  return useQuery({
    queryKey: ['events', page, size],
    queryFn: () => getEventList(page, size),
    staleTime: 30 * 60 * 1000,
  });
};

/** 공공 레포츠/액티비티 목록 (TourAPI) */
export const useLeisureList = (page = 1, size = 9) => {
  return useQuery({
    queryKey: ['leisure', page, size],
    queryFn: () => getLeisureList(page, size),
    staleTime: 30 * 60 * 1000,
  });
};
