import React from 'react';
import { SquarePen, User } from 'lucide-react';

/**
 * 채팅방 목록 (Instagram DM 스타일)
 */
export default function ChatRoomList({ rooms, selectedRoomNo, onSelectRoom, onNewChat, currentUserNickname, hideHeader }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 - IG 스타일 */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {currentUserNickname || '메시지'}
          </h1>
          <button
            onClick={onNewChat}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="새 메시지"
          >
            <SquarePen className="w-[22px] h-[22px] text-slate-900" />
          </button>
        </div>
      )}

      {/* 새 대화 버튼 (헤더 숨김 시) */}
      {hideHeader && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-500">메시지</span>
          <button
            onClick={onNewChat}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            title="새 메시지"
          >
            <SquarePen className="w-[18px] h-[18px] text-slate-900" />
          </button>
        </div>
      )}

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {(!rooms || rooms.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900 mb-1">내 메시지</p>
            <p className="text-sm text-slate-500 mb-5">친구에게 메시지를 보내보세요</p>
            <button
              onClick={onNewChat}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              메시지 보내기
            </button>
          </div>
        )}

        {rooms && rooms.map((room) => {
          const isSelected = selectedRoomNo === room.chattingRoomNo;
          const hasUnread = room.notReadCount > 0;

          return (
            <div
              key={room.chattingRoomNo}
              onClick={() => onSelectRoom(room)}
              className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-colors ${
                isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              {/* 프로필 아바타 */}
              <div className="relative flex-shrink-0">
                {room.targetProfile ? (
                  <img
                    src={room.targetProfile}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200">
                    <User className="w-7 h-7 text-slate-400" />
                  </div>
                )}
              </div>

              {/* 대화 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm truncate ${
                    hasUnread ? 'font-bold text-slate-900' : 'font-normal text-slate-900'
                  }`}>
                    {room.targetNickName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className={`text-sm truncate ${
                    hasUnread ? 'font-semibold text-slate-900' : 'text-slate-500'
                  }`}>
                    {room.lastMessage || '대화를 시작해보세요'}
                  </p>
                  {room.sendTime && (
                    <>
                      <span className="text-slate-300 flex-shrink-0">·</span>
                      <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                        {room.sendTime}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 안읽은 표시 - 파란 점 */}
              {hasUnread && (
                <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
