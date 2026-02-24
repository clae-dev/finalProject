import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleWishlist, checkWishlist, getMyWishlists } from './wishlistAPI';
import type { WishlistType } from './wishlistAPI';

/** 위시리스트 여부 확인 (로그인 시만) */
export const useCheckWishlist = (
  type: WishlistType,
  targetNo: number | string | undefined,
  enabled = true
) => {
  return useQuery({
    queryKey: ['wishlist', type, targetNo],
    queryFn: () => checkWishlist(type, targetNo!),
    enabled: !!targetNo && enabled,
  });
};

/** 위시리스트 토글 (추가/제거) */
export const useToggleWishlist = (type: WishlistType, targetNo: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleWishlist(type, targetNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', type, String(targetNo)] });
      queryClient.invalidateQueries({ queryKey: ['myWishlists'] });
    },
  });
};

/** 내 위시리스트 목록 (마이페이지) */
export const useMyWishlists = (enabled = true) => {
  return useQuery({
    queryKey: ['myWishlists'],
    queryFn: getMyWishlists,
    enabled,
  });
};
