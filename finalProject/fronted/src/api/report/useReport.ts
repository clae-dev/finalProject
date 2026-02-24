import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReport, checkReport } from './reportAPI';

/** 중복 신고 확인 */
export const useCheckReport = (
  targetType: string | undefined,
  targetNo: number | string | undefined
) => {
  return useQuery({
    queryKey: ['report', 'check', targetType, targetNo],
    queryFn: () => checkReport(targetType!, targetNo!),
    enabled: !!targetType && !!targetNo,
  });
};

/** 신고 접수 */
export const useSubmitReport = (
  targetType: string,
  targetNo: number | string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportType, detailReason }: { reportType: string; detailReason: string }) =>
      submitReport(targetType, targetNo, reportType, detailReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'check', targetType, targetNo] });
    },
  });
};
