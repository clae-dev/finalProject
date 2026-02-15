import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFaqCategories,
  getFaqList,
  increaseFaqView,
  getAdminFaqList,
  createFaq,
  updateFaq,
  deleteFaq,
} from './faqAPI';

/** 카테고리 목록 */
export const useFaqCategories = () => {
  return useQuery({
    queryKey: ['faq', 'categories'],
    queryFn: getFaqCategories,
  });
};

/** FAQ 목록 (사용자용) */
export const useFaqList = (category = null, search = '') => {
  return useQuery({
    queryKey: ['faq', 'list', category, search],
    queryFn: () => getFaqList(category, search),
  });
};

/** 조회수 증가 */
export const useIncreaseFaqView = () => {
  return useMutation({
    mutationFn: (faqNo) => increaseFaqView(faqNo),
  });
};

/** 관리자 FAQ 목록 */
export const useAdminFaqList = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'faq', page, size, search],
    queryFn: () => getAdminFaqList(page, size, search),
  });
};

/** FAQ 등록 */
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faq) => createFaq(faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });
};

/** FAQ 수정 */
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ faqNo, ...faq }) => updateFaq(faqNo, faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });
};

/** FAQ 삭제 */
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faqNo) => deleteFaq(faqNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });
};
