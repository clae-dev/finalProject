import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/logo.png';

/**
 * 로고 컴포넌트
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} clickable - 클릭 시 홈으로 이동 여부
 */
const Logo = ({ size = 'medium', clickable = true }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-20 w-20'
  };

  const handleClick = () => {
    if (clickable) {
      navigate('/');
    }
  };

  return (
    <img
      src={logoImage}
      alt="혼디 로고"
      className={`${sizeClasses[size]} ${clickable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    />
  );
};

export default Logo;