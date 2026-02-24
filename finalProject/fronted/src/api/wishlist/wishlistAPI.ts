import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse } from "../../types";

export type WishlistType = 'accommodation' | 'companion' | 'review';

// 위시리스트 토글 (추가/제거)
export const toggleWishlist = async (
  type: WishlistType,
  targetNo: number | string
): Promise<ApiResponse<{ wishlisted: boolean }>> => {
  const path = type === 'accommodation'
    ? `/api/accommodations/${targetNo}/wishlist`
    : type === 'companion'
    ? `/api/companions/${targetNo}/wishlist`
    : `/api/reviews/${targetNo}/wishlist`;
  const response = await axiosApi.post(path);
  return response.data;
};

// 위시리스트 여부 확인
export const checkWishlist = async (
  type: WishlistType,
  targetNo: number | string
): Promise<ApiResponse<{ wishlisted: boolean }>> => {
  const path = type === 'accommodation'
    ? `/api/accommodations/${targetNo}/wishlist/check`
    : type === 'companion'
    ? `/api/companions/${targetNo}/wishlist/check`
    : `/api/reviews/${targetNo}/wishlist/check`;
  const response = await axiosApi.get(path);
  return response.data;
};

// 내 위시리스트 목록 전체 조회 (마이페이지)
export const getMyWishlists = async (): Promise<ApiResponse<{
  accommodations: unknown[];
  companions: unknown[];
  reviews: unknown[];
}>> => {
  const response = await axiosApi.get("/api/member/wishlists");
  return response.data;
};
