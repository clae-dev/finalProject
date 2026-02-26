import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useCheckWishlist, useToggleWishlist } from '../../api/wishlist/useWishlist';

/**
 * WishlistButton – 숙소/동행/후기 찜 버튼
 * Props:
 *   type: 'accommodation' | 'companion' | 'review'
 *   targetNo: 대상 번호
 *   className: 추가 CSS 클래스
 *   size: 'sm' | 'md' (default 'md')
 */
export default function WishlistButton({ type, targetNo, className = '', size = 'md' }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const { data: checkData } = useCheckWishlist(type, targetNo, !!user);
  const toggleMutation = useToggleWishlist(type, targetNo);

  const isWishlisted = checkData?.data?.wishlisted === true;

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleMutation.mutateAsync();
    } catch {
      // 에러 무시 (네트워크 등)
    }
  };

  const sizeClass = size === 'sm'
    ? 'w-8 h-8'
    : 'w-10 h-10';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all ${
        isWishlisted
          ? 'bg-sky-500 shadow-lg shadow-sky-200/50'
          : 'bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg'
      } ${className}`}
      title={isWishlisted ? '저장 해제' : '저장하기'}
    >
      <Bookmark
        className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} transition-colors ${
          isWishlisted ? 'fill-white text-white' : 'text-slate-600'
        }`}
      />
    </motion.button>
  );
}
