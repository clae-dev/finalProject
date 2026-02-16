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
import { getEventList } from './eventAPI';

/** 게시글 목록 */
export const useActivityList = (page = 1, size = 9, search = '') => {
  return useQuery({
    queryKey: ['activities', page, size, search],
    queryFn: () => getActivityList(page, size, search),
  });
};

/** 게시글 상세 */
export const useActivityDetail = (boardNo) => {
  return useQuery({
    queryKey: ['activity', boardNo],
    queryFn: () => getActivityDetail(boardNo),
    enabled: !!boardNo,
  });
};

/** 게시글 작성 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => createActivity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/** 게시글 수정 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardNo, formData }) => updateActivity(boardNo, formData),
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
    mutationFn: (boardNo) => deleteActivity(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/** 댓글 목록 */
export const useActivityCommentList = (boardNo) => {
  return useQuery({
    queryKey: ['activity-comments', boardNo],
    queryFn: () => getActivityCommentList(boardNo),
    enabled: !!boardNo,
  });
};

/** 댓글 작성 */
export const useCreateActivityComment = (boardNo) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentCommentNo }) => createActivityComment(boardNo, content, parentCommentNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['activity', String(boardNo)] });
    },
  });
};

/** 댓글 삭제 */
export const useDeleteActivityComment = (boardNo) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentNo) => deleteActivityComment(commentNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-comments', boardNo] });
      queryClient.invalidateQueries({ queryKey: ['activity', String(boardNo)] });
    },
  });
};

/** 좋아요 토글 */
export const useToggleActivityLike = (boardNo) => {
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
