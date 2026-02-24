import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';

/**
 * ShareButtons – SNS 공유 버튼 컴포넌트
 * Props:
 *   title: string       – 공유 제목
 *   description: string – 공유 설명
 *   imageUrl: string    – 썸네일 이미지 URL
 *   url: string         – 공유 URL (기본: window.location.href)
 */
export default function ShareButtons({ title = '', description = '', imageUrl = '', url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (!window.Kakao?.Share) {
      alert('카카오 SDK가 로드되지 않았습니다.');
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title || '혼디 - 제주 혼행 커뮤니티',
        description: description || '혼자 떠나는 제주 여행, 혼디와 함께!',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  // URL 복사
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: textarea
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 카카오톡 공유 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleKakaoShare}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-xs font-bold text-[#3C1E1E] transition-colors shadow-md"
        title="카카오톡으로 공유"
      >
        <KakaoIcon className="w-4 h-4" />
        카카오 공유
      </motion.button>

      {/* URL 복사 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyUrl}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-white border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sky-600'
        }`}
        title="링크 복사"
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5" /> 복사됨!</>
        ) : (
          <><Copy className="w-3.5 h-3.5" /> 링크 복사</>
        )}
      </motion.button>
    </div>
  );
}

function KakaoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.62 2 11.1c0 2.853 1.818 5.37 4.562 6.84l-.924 3.42c-.083.308.267.554.535.375l4.25-2.83c.519.067 1.047.1 1.577.1 5.523 0 10-3.62 10-8.1S17.523 3 12 3z"/>
    </svg>
  );
}
