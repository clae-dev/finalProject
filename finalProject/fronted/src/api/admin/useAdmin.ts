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
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAdminReports,
  getAdminReportDetail,
  updateReportStatus,
  getPendingReportCount,
  getAdminVerifications,
  approveVerification,
  rejectVerification,
  getAdminAccommodationReviews,
  deleteAdminAccommodationReview,
  approveAccommodationReview,
  rejectAccommodationReview,
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
    mutationFn: ({ memberNo, status }: { memberNo: number | string; status: string }) =>
      updateMemberStatus(memberNo, status),
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
    mutationFn: (companionNo: number | string) => deleteAdminCompanion(companionNo),
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
    mutationFn: (reviewNo: number | string) => deleteAdminReview(reviewNo),
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
    mutationFn: ({ accommodationNo, status }: { accommodationNo: number | string; status: string }) =>
      updateAccommodationStatus(accommodationNo, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

/** 숙소 추가 */
export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createAccommodation(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['accommodation'] });
    },
  });
};

/** 숙소 수정 */
export const useUpdateAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accommodationNo, formData }: { accommodationNo: number | string; formData: FormData }) =>
      updateAccommodation(accommodationNo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['accommodation'] });
    },
  });
};

/** 숙소 삭제 */
export const useDeleteAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accommodationNo: number | string) => deleteAccommodation(accommodationNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['accommodation'] });
    },
  });
};

/** 신고 목록 (관리자) */
export const useAdminReports = (page = 1, size = 10, status = '', targetType = '') => {
  return useQuery({
    queryKey: ['admin', 'reports', page, size, status, targetType],
    queryFn: () => getAdminReports(page, size, status, targetType),
  });
};

/** 신고 상세 (관리자) */
export const useAdminReportDetail = (reportNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['admin', 'reports', reportNo],
    queryFn: () => getAdminReportDetail(reportNo!),
    enabled: !!reportNo,
  });
};

/** 신고 상태 변경 (관리자) */
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportNo, status, result }: { reportNo: number | string; status: string; result: string }) =>
      updateReportStatus(reportNo, status, result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

/** 대기중 신고 건수 */
export const usePendingReportCount = () => {
  return useQuery({
    queryKey: ['admin', 'reports', 'pendingCount'],
    queryFn: getPendingReportCount,
  });
};

/** 인증 요청 목록 (관리자) */
export const useAdminVerifications = (page = 1, size = 10, status = '') => {
  return useQuery({
    queryKey: ['admin', 'verifications', page, size, status],
    queryFn: () => getAdminVerifications(page, size, status),
  });
};

/** 인증 승인 */
export const useApproveVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (verificationNo: number | string) => approveVerification(verificationNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
    },
  });
};

/** 인증 거부 */
export const useRejectVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ verificationNo, adminComment }: { verificationNo: number | string; adminComment: string }) =>
      rejectVerification(verificationNo, adminComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
    },
  });
};

/** 숙소 후기 목록 (관리자) */
export const useAdminAccommodationReviews = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'accommodationReviews', page, size, search],
    queryFn: () => getAdminAccommodationReviews(page, size, search),
  });
};

/** 숙소 후기 삭제 (관리자) */
export const useDeleteAdminAccommodationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo: number | string) => deleteAdminAccommodationReview(reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accommodationReviews'] });
    },
  });
};

/** 숙소 후기 승인 (관리자) */
export const useApproveAccommodationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo: number | string) => approveAccommodationReview(reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accommodationReviews'] });
    },
  });
};

/** 숙소 후기 거부 (관리자) */
export const useRejectAccommodationReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewNo: number | string) => rejectAccommodationReview(reviewNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accommodationReviews'] });
    },
  });
};
