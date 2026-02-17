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
    mutationFn: submitVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
    },
  });
};
