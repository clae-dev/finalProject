/**
 * 회원 인증 서류 React Query 커스텀 훅 (상태 조회, 서류 제출)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVerificationStatus, submitVerification } from './verificationAPI';
import { getToken } from '../core/tokenStorage';

export const useVerificationStatus = () => {
  return useQuery({
    queryKey: ['verificationStatus'],
    queryFn: getVerificationStatus,
    enabled: !!getToken('accessToken'),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmitVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => submitVerification(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
    },
  });
};
