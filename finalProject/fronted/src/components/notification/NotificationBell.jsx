import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, Users, UserCheck, MessageCircle, HelpCircle } from 'lucide-react';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../../api/notification/useNotification';
import useNotificationSocket from '../../lib/useNotificationSocket';

const NOTIFICATION_ICONS = {
  COMPANION_JOIN: <Users className="w-4 h-4 text-amber-600" />,
  COMPANION_ACCEPTED: <UserCheck className="w-4 h-4 text-emerald-600" />,
  CHAT_MESSAGE: <MessageCircle className="w-4 h-4 text-sky-600" />,
  INQUIRY_ANSWERED: <HelpCircle className="w-4 h-4 text-violet-600" />,
};

const NOTIFICATION_COLORS = {
  COMPANION_JOIN: 'bg-amber-50 border-amber-200',
  COMPANION_ACCEPTED: 'bg-emerald-50 border-emerald-200',
  CHAT_MESSAGE: 'bg-sky-50 border-sky-200',
  INQUIRY_ANSWERED: 'bg-violet-50 border-violet-200',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr.replace(' ', 'T'));
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return dateStr;
}

export default function NotificationBell({ onOpenChat }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const { data: notifData } = useNotifications(1, 20);
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const unreadCount = unreadData?.count || 0;
  const notifications = notifData?.list || [];

  // WebSocket 연결 (실시간 알림 수신)
  const handleNotification = useCallback(() => {
    // 캐시 무효화는 useNotificationSocket 내부에서 처리됨
  }, []);
  useNotificationSocket(handleNotification);

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleNotifClick = (notif) => {
    // 읽음 처리
    if (notif.readFl === 'N') {
      markAsRead.mutate(notif.notificationNo);
    }
    // 해당 페이지로 이동
    if (notif.targetType === 'CHAT') {
      onOpenChat?.();
    } else if (notif.targetType === 'COMPANION' && notif.targetNo) {
      navigate(`/companions/${notif.targetNo}`);
    } else if (notif.targetType === 'INQUIRY') {
      navigate('/inquiry');
    }
    setOpen(false);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllAsRead.mutate();
  };

  const handleDelete = (e, notificationNo) => {
    e.stopPropagation();
    deleteNotification.mutate(notificationNo);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* 벨 아이콘 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-300/50 hover:scale-110 active:scale-95 transition-all duration-300"
        title="알림"
      >
        <Bell className="w-5 h-5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 패널 */}
      <div
        className={`absolute top-full right-0 mt-2 w-[360px] transition-all duration-200 z-50 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-100/60 shadow-xl shadow-amber-100/30 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3
              className="text-sm font-bold text-slate-700"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              알림
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-medium text-amber-500">
                  {unreadCount}개 읽지않음
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                모두 읽음
              </button>
            )}
          </div>

          {/* 알림 목록 */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p
                  className="text-sm text-slate-400"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  알림이 없습니다
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.notificationNo}
                  onClick={() => handleNotifClick(notif)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors duration-150 border-b border-slate-50 last:border-0 ${
                    notif.readFl === 'N' ? 'bg-amber-50/40' : ''
                  }`}
                >
                  {/* 아이콘 */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                      NOTIFICATION_COLORS[notif.notificationType] || 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {NOTIFICATION_ICONS[notif.notificationType] || <Bell className="w-4 h-4 text-slate-400" />}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        notif.readFl === 'N' ? 'font-semibold text-slate-800' : 'text-slate-600'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {notif.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {notif.senderNickname && (
                        <span
                          className="text-[11px] text-slate-400"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {notif.senderNickname}
                        </span>
                      )}
                      <span
                        className="text-[11px] text-slate-300"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* 액션 */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {notif.readFl === 'N' && (
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notif.notificationNo)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
