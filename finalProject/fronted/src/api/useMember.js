import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMember, updateMember, withdrawMember, resetPassword } from './memberAPI';

/**
 * 회원 상세 조회 훅
 * @param {number|string} memberNo - 회원 번호
 */
export const useMember = (memberNo) => {
  return useQuery({
    queryKey: ['member', memberNo],
    queryFn: () => getMember(memberNo),
    enabled: !!memberNo,
  });
};

/**
 * 회원 정보 수정 훅
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberNo, data }) => updateMember(memberNo, data),
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
    mutationFn: ({ memberNo, memberPw }) => withdrawMember(memberNo, memberPw),
  });
};

/**
 * 비밀번호 변경 훅
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data) => resetPassword(data),
  });
};
