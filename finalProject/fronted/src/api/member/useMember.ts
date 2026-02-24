import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMember, getMyActivity, updateMember, withdrawMember, resetPassword } from './memberAPI';
import type { Member } from '../../types';

/**
 * 회원 상세 조회 훅
 * @param memberNo - 회원 번호
 */
export const useMember = (memberNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['member', memberNo],
    queryFn: () => getMember(memberNo!),
    enabled: !!memberNo,
  });
};

/**
 * 회원 활동 내역 조회 훅
 * @param memberNo - 회원 번호
 */
export const useMyActivity = (memberNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['myActivity', memberNo],
    queryFn: () => getMyActivity(memberNo!),
    enabled: !!memberNo,
  });
};

/**
 * 회원 정보 수정 훅
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberNo, data }: { memberNo: number | string; data: Partial<Member> }) =>
      updateMember(memberNo, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberNo] });
    },
  });
};

/**
 * 회원 탈퇴 훅
 */
export const useWithdrawMember = () => {
  return useMutation({
    mutationFn: ({ memberNo, memberPw }: { memberNo: number | string; memberPw: string }) =>
      withdrawMember(memberNo, memberPw),
  });
};

/**
 * 비밀번호 변경 훅
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { memberNo: number | string; currentPassword: string; newPassword: string }) =>
      resetPassword(data),
  });
};
