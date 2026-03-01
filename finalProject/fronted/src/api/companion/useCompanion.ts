import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCompanionList,
  getCompanionDetail,
  createCompanion,
  updateCompanion,
  deleteCompanion,
  joinCompanion,
  cancelJoin,
  updateJoinStatus,
} from './companionAPI';

/**
 * 동행 목록 조회 훅
 */
export const useCompanions = (page = 1, size = 9, tag: string | null = null) => {
  return useQuery({
    queryKey: ['companions', page, size, tag],
    queryFn: () => getCompanionList(page, size, tag),
  });
};

/**
 * 동행 상세 조회 훅
 */
export const useCompanionDetail = (companionNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['companion', companionNo],
    queryFn: () => getCompanionDetail(companionNo!),
    enabled: !!companionNo,
  });
};

/**
 * 동행 작성 훅
 */
export const useCreateCompanion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createCompanion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
    },
  });
};

/**
 * 동행 수정 훅
 */
export const useUpdateCompanion = (companionNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => updateCompanion(companionNo, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companion', companionNo] });
      queryClient.invalidateQueries({ queryKey: ['companion', String(companionNo)] });
      queryClient.invalidateQueries({ queryKey: ['companion', Number(companionNo)] });
      queryClient.invalidateQueries({ queryKey: ['companions'] });
    },
  });
};

/**
 * 동행 삭제 훅
 */
export const useDeleteCompanion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companionNo: number | string) => deleteCompanion(companionNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
    },
  });
};

/**
 * 참여 신청 훅
 */
export const useJoinCompanion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companionNo: number | string) => joinCompanion(companionNo),
    onSuccess: (_, companionNo) => {
      queryClient.invalidateQueries({ queryKey: ['companion', companionNo] });
    },
  });
};

/**
 * 참여 취소 훅
 */
export const useCancelJoin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companionNo: number | string) => cancelJoin(companionNo),
    onSuccess: (_, companionNo) => {
      queryClient.invalidateQueries({ queryKey: ['companion', companionNo] });
    },
  });
};

/**
 * 승인/거절 훅
 */
export const useUpdateJoinStatus = (companionNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ joinNo, status }: { joinNo: number | string; status: 'A' | 'R' }) =>
      updateJoinStatus(joinNo, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companion', companionNo] });
    },
  });
};
