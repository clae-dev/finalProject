import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccommodationReviews, getReviewSummary, createAccommodationReview, deleteAccommodationReview } from './accommodationReviewAPI';

export const useAccommodationReviews = (accommodationNo: number | string | undefined, page = 1, size = 5) => {
  return useQuery({
    queryKey: ['accommodationReviews', accommodationNo, page, size],
    queryFn: () => getAccommodationReviews(accommodationNo!, page, size),
    enabled: !!accommodationNo,
    staleTime: 1000 * 60 * 2,
  });
};

export const useReviewSummary = (accommodationNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['reviewSummary', accommodationNo],
    queryFn: () => getReviewSummary(accommodationNo!),
    enabled: !!accommodationNo,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateAccommodationReview = (accommodationNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createAccommodationReview(accommodationNo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodationReviews', accommodationNo] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', accommodationNo] });
    },
  });
};

export const useDeleteAccommodationReview = (accommodationNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo: number | string) => deleteAccommodationReview(accommodationNo, reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodationReviews', accommodationNo] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', accommodationNo] });
    },
  });
};
