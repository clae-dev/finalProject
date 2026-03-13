import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReviewList,
  getReviewDetail,
  createReview,
  deleteReview,
  getRecentReviews,
} from './reviewAPI';

/**
 * 후기 목록 조회 훅
 */
export const useReviews = (page = 1, size = 9, search = '', sort = 'latest') => {
  return useQuery({
    queryKey: ['reviews', page, size, search, sort],
    queryFn: () => getReviewList(page, size, search, sort),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 후기 상세 조회 훅
 */
export const useReviewDetail = (reviewNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['review', reviewNo],
    queryFn: () => getReviewDetail(reviewNo!),
    enabled: !!reviewNo,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 후기 작성 훅
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['recentReviews'] });
    },
  });
};

/**
 * 후기 삭제 훅
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo: number | string) => deleteReview(reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['recentReviews'] });
    },
  });
};

/**
 * 메인페이지용 최신 후기 훅
 */
export const useRecentReviews = (limit = 9) => {
  return useQuery({
    queryKey: ['recentReviews', limit],
    queryFn: () => getRecentReviews(limit),
    staleTime: 1000 * 60 * 5,
  });
};
