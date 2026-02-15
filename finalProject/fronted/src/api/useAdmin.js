import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboard,
  getMembers,
  updateMemberStatus,
  getAdminCompanions,
  deleteAdminCompanion,
  getAdminReviews,
  deleteAdminReview,
  getAdminAccommodations,
  updateAccommodationStatus,
} from './adminAPI';

/** 대시보드 통계 */
export const useDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getDashboard,
  });
};

/** 회원 목록 */
export const useAdminMembers = (page = 1, size = 10, search = '', searchType = '') => {
  return useQuery({
    queryKey: ['admin', 'members', page, size, search, searchType],
    queryFn: () => getMembers(page, size, search, searchType),
  });
};

/** 회원 상태 변경 */
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberNo, status }) => updateMemberStatus(memberNo, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

/** 동행 목록 (관리자) */
export const useAdminCompanions = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'companions', page, size, search],
    queryFn: () => getAdminCompanions(page, size, search),
  });
};

/** 동행 삭제 (관리자) */
export const useDeleteAdminCompanion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companionNo) => deleteAdminCompanion(companionNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

/** 후기 목록 (관리자) */
export const useAdminReviews = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'reviews', page, size, search],
    queryFn: () => getAdminReviews(page, size, search),
  });
};

/** 후기 삭제 (관리자) */
export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo) => deleteAdminReview(reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

/** 숙소 목록 (관리자) */
export const useAdminAccommodations = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'accommodations', page, size, search],
    queryFn: () => getAdminAccommodations(page, size, search),
  });
};

/** 숙소 상태 변경 */
export const useUpdateAccommodationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accommodationNo, status }) => updateAccommodationStatus(accommodationNo, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};
