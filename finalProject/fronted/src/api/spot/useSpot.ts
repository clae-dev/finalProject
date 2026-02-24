import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveSpots,
  getAllSpots,
  createSpot,
  updateSpot,
  deleteSpot,
  updateSpotStatus,
} from './spotAPI';

/** 활성 명소 목록 (메인페이지용) */
export const useActiveSpots = () => {
  return useQuery({
    queryKey: ['spots', 'active'],
    queryFn: getActiveSpots,
  });
};

/** 전체 명소 목록 (관리자용) */
export const useAllSpots = () => {
  return useQuery({
    queryKey: ['spots', 'all'],
    queryFn: getAllSpots,
  });
};

/** 명소 등록 */
export const useCreateSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createSpot(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};

/** 명소 수정 */
export const useUpdateSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ spotNo, formData }: { spotNo: number | string; formData: FormData }) =>
      updateSpot(spotNo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};

/** 명소 삭제 */
export const useDeleteSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (spotNo: number | string) => deleteSpot(spotNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};

/** 명소 상태 변경 */
export const useUpdateSpotStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ spotNo, status }: { spotNo: number | string; status: string }) =>
      updateSpotStatus(spotNo, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};
