import React, { useState, useCallback, useContext } from 'react';
import { X, ArrowLeft, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatRoomList from './ChatRoomList';
import ChatMessageArea from './ChatMessageArea';
import ChatSearchModal from './ChatSearchModal';
import GroupRoomList from './GroupRoomList';
import GroupMessageArea from './GroupMessageArea';
import { useRoomList, useMessages, useEnterRoom, useUpdateReadFlag } from '../../api/chatting/useChatting';
import { useGroupRoomList, useGroupMessages, useMarkGroupRead } from '../../api/chatting/useGroupChatting';
import useWebSocket from '../../lib/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../AuthContext';

/**
 * 플로팅 채팅 패널 (ChatBubble에서 열림)
 */
export default function ChatPanel({ isOpen, onClose, motionX, motionY }) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // 탭 상태: 'direct' | 'group'
  const [activeTab, setActiveTab] = useState('direct');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedGroupRoom, setSelectedGroupRoom] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // 1:1 채팅
  const { data: roomData } = useRoomList(isOpen && !!user);
  const { data: messageData } = useMessages(selectedRoom?.chattingRoomNo);
  const enterRoomMutation = useEnterRoom();
  const updateReadMutation = useUpdateReadFlag();

  // 그룹 채팅
  const { data: groupRoomData } = useGroupRoomList(isOpen && !!user);
  const { data: groupMessageData } = useGroupMessages(selectedGroupRoom?.groupRoomNo);
  const markGroupReadMutation = useMarkGroupRead();

  const rooms = roomData?.success ? (roomData.data || []) : [];
  const messages = messageData?.success ? (messageData.data || []) : [];
  const groupRooms = groupRoomData?.success ? (groupRoomData.data || []) : [];
  const groupMessages = groupMessageData?.success ? (groupMessageData.data || []) : [];
  const currentMemberNo = user?.memberNo;

  // 그룹 미읽음 총계
  const groupUnreadTotal = groupRooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);

  // WebSocket 메시지 수신
  const handleWsMessage = useCallback((msg) => {
    if (msg.isGroupMessage) {
      // 그룹 메시지
      if (selectedGroupRoom && msg.groupRoomNo === selectedGroupRoom.groupRoomNo) {
        queryClient.invalidateQueries({ queryKey: ['groupMessages', selectedGroupRoom.groupRoomNo] });
        // 마지막 읽음 처리
        if (msg.groupMsgNo) {
          markGroupReadMutation.mutate({ groupRoomNo: selectedGroupRoom.groupRoomNo, lastReadMsgNo: msg.groupMsgNo });
        }
      }
      queryClient.invalidateQueries({ queryKey: ['groupChattingRooms'] });
    } else {
      // 1:1 메시지 — 기존 로직 그대로
      if (selectedRoom && msg.chattingRoomNo === selectedRoom.chattingRoomNo) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedRoom.chattingRoomNo] });
        updateReadMutation.mutate(selectedRoom.chattingRoomNo);
      }
      queryClient.invalidateQueries({ queryKey: ['chattingRooms'] });
    }
  }, [selectedRoom, selectedGroupRoom, queryClient, updateReadMutation, markGroupReadMutation]);

  const { sendMessage } = useWebSocket(handleWsMessage);

  // 1:1 룸 선택
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setSelectedGroupRoom(null);
    if (room.notReadCount > 0) {
      updateReadMutation.mutate(room.chattingRoomNo);
    }
  };

  // 그룹 룸 선택
  const handleSelectGroupRoom = (room) => {
    setSelectedGroupRoom(room);
    setSelectedRoom(null);
    // 읽음 처리 — 현재 마지막 메시지 기준
    if (room.unreadCount > 0) {
      // 메시지 목록이 로드되면 처리하므로 groupRoomNo만 넘김 (lastReadMsgNo=0은 서버가 처리)
      markGroupReadMutation.mutate({ groupRoomNo: room.groupRoomNo, lastReadMsgNo: 0 });
    }
  };

  const handleSelectTarget = async (target, firstMessage) => {
    try {
      const result = await enterRoomMutation.mutateAsync(target.memberNo);
      if (result.success) {
        const room = {
          chattingRoomNo: result.chattingRoomNo,
          targetNo: target.memberNo,
          targetNickName: target.nickname,
          targetProfile: target.profileImage,
        };
        setSelectedRoom(room);
        setSelectedGroupRoom(null);

        if (firstMessage) {
          sendMessage({
            messageContent: firstMessage,
            chattingRoomNo: result.chattingRoomNo,
            targetNo: target.memberNo,
          });
        }
      }
    } catch (err) {
      console.error('채팅방 입장 실패:', err);
    }
  };

  // 1:1 메시지 전송
  const handleSendMessage = (text) => {
    if (!selectedRoom || !currentMemberNo) return;
    sendMessage({
      messageContent: text,
      chattingRoomNo: selectedRoom.chattingRoomNo,
      targetNo: selectedRoom.targetNo,
    });
  };

  // 그룹 메시지 전송
  const handleSendGroupMessage = (text) => {
    if (!selectedGroupRoom || !currentMemberNo) return;
    sendMessage({
      isGroupMessage: true,
      groupRoomNo: selectedGroupRoom.groupRoomNo,
      msgContent: text,
    });
  };

  const handleBack = () => {
    if (selectedRoom) {
      setSelectedRoom(null);
    } else if (selectedGroupRoom) {
      setSelectedGroupRoom(null);
    }
  };

  const handleClose = () => {
    setSelectedRoom(null);
    setSelectedGroupRoom(null);
    onClose();
  };

  // 헤더 타이틀
  const headerTitle = () => {
    if (selectedRoom) return selectedRoom.targetNickName;
    if (selectedGroupRoom) return selectedGroupRoom.roomName;
    return '메시지';
  };

  const isInRoom = !!(selectedRoom || selectedGroupRoom);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ x: motionX, y: motionY }}
            className="fixed bottom-24 right-24 max-sm:right-2 max-sm:left-2 max-sm:w-auto w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl z-[72] flex flex-col overflow-hidden border border-slate-200/60"
          >
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                {isInRoom && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-900" />
                  </button>
                )}
                <h2 className="text-base font-bold text-slate-900">
                  {headerTitle()}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            {/* 탭 바 — 룸 미선택 상태에서만 표시 */}
            {!isInRoom && (
              <div className="flex border-b border-slate-200 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('direct')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
                    activeTab === 'direct'
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  1:1 채팅
                  {activeTab === 'direct' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative flex items-center justify-center gap-1.5 ${
                    activeTab === 'group'
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  그룹 채팅
                  {groupUnreadTotal > 0 && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
                  )}
                  {activeTab === 'group' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              </div>
            )}

            {/* 패널 내용 */}
            <div className="flex-1 min-h-0">
              {selectedRoom ? (
                <ChatMessageArea
                  messages={messages}
                  currentMemberNo={currentMemberNo}
                  targetNickName={selectedRoom.targetNickName}
                  targetProfile={selectedRoom.targetProfile}
                  onSendMessage={handleSendMessage}
                  hideHeader={true}
                />
              ) : selectedGroupRoom ? (
                <GroupMessageArea
                  messages={groupMessages}
                  currentMemberNo={currentMemberNo}
                  roomName={selectedGroupRoom.roomName}
                  onSendMessage={handleSendGroupMessage}
                />
              ) : activeTab === 'direct' ? (
                <ChatRoomList
                  rooms={rooms}
                  selectedRoomNo={null}
                  onSelectRoom={handleSelectRoom}
                  onNewChat={() => setShowSearchModal(true)}
                  currentUserNickname={user?.memberNickname}
                  hideHeader={true}
                />
              ) : (
                <GroupRoomList
                  rooms={groupRooms}
                  selectedRoomNo={null}
                  onSelectRoom={handleSelectGroupRoom}
                />
              )}
            </div>

            {/* 검색 모달 */}
            {showSearchModal && (
              <ChatSearchModal
                onClose={() => setShowSearchModal(false)}
                onSelectTarget={handleSelectTarget}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
