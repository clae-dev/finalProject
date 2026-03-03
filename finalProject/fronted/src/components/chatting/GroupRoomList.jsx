import React from 'react';
import { Users, User } from 'lucide-react';

/**
 * 그룹 채팅방 목록
 */
export default function GroupRoomList({ rooms, selectedRoomNo, onSelectRoom }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-slate-900" />
        </div>
        <p className="text-base font-semibold text-slate-900 mb-1">그룹 채팅</p>
        <p className="text-sm text-slate-500">동행 신청이 승인되면 자동으로 생성됩니다</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.map((room) => {
        const isSelected = selectedRoomNo === room.groupRoomNo;
        const hasUnread = room.unreadCount > 0;
        const members = room.members || [];

        return (
          <div
            key={room.groupRoomNo}
            onClick={() => onSelectRoom(room)}
            className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-colors ${
              isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            {/* 멤버 겹침 아바타 */}
            <div className="relative flex-shrink-0 w-14 h-14">
              {members.slice(0, 4).map((member, idx) => {
                const positions = [
                  { top: '0px', left: '0px' },
                  { top: '0px', left: '20px' },
                  { top: '20px', left: '0px' },
                  { top: '20px', left: '20px' },
                ];
                const pos = positions[idx] || { top: '0px', left: '0px' };
                return (
                  <div
                    key={member.memberNo}
                    className="absolute w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                );
              })}
              {members.length === 0 && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center border border-slate-200">
                  <Users className="w-7 h-7 text-violet-400" />
                </div>
              )}
            </div>

            {/* 대화 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-sm truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-normal text-slate-900'}`}>
                  {room.roomName}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {room.memberCount > 0 && `${room.memberCount}명`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                  {room.lastMessage || '그룹 채팅을 시작해보세요'}
                </p>
                {room.lastSendTime && (
                  <>
                    <span className="text-slate-300 flex-shrink-0">·</span>
                    <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                      {room.lastSendTime}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 미읽음 dot */}
            {hasUnread && (
              <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
