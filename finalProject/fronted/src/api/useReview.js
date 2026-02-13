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
export const useReviews = (page = 1, size = 9) => {
  return useQuery({
    queryKey: ['reviews', page, size],
    queryFn: () => getReviewList(page, size),
  });
};

/**
 * 후기 상세 조회 훅
 */
export const useReviewDetail = (reviewNo) => {
  return useQuery({
    queryKey: ['review', reviewNo],
    queryFn: () => getReviewDetail(reviewNo),
    enabled: !!reviewNo,
  });
};

/**
 * 후기 작성 훅
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createReview(data),
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
    mutationFn: (reviewNo) => deleteReview(reviewNo),
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
  });
};
