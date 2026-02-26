import React, { useState, useCallback, useContext } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatRoomList from './ChatRoomList';
import ChatMessageArea from './ChatMessageArea';
import ChatSearchModal from './ChatSearchModal';
import { useRoomList, useMessages, useEnterRoom, useUpdateReadFlag } from '../../api/chatting/useChatting';
import useWebSocket from '../../lib/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../AuthContext';

/**
 * 플로팅 채팅 패널 (ChatBubble에서 열림)
 */
export default function ChatPanel({ isOpen, onClose, motionX, motionY }) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { data: roomData } = useRoomList(isOpen && !!user);
  const { data: messageData } = useMessages(selectedRoom?.chattingRoomNo);
  const enterRoomMutation = useEnterRoom();
  const updateReadMutation = useUpdateReadFlag();

  const rooms = roomData?.success ? (roomData.data || []) : [];
  const messages = messageData?.success ? (messageData.data || []) : [];
  const currentMemberNo = user?.memberNo;

  // WebSocket 메시지 수신
  const handleWsMessage = useCallback((msg) => {
    if (selectedRoom && msg.chattingRoomNo === selectedRoom.chattingRoomNo) {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedRoom.chattingRoomNo] });
      updateReadMutation.mutate(selectedRoom.chattingRoomNo);
    }
    queryClient.invalidateQueries({ queryKey: ['chattingRooms'] });
  }, [selectedRoom, queryClient, updateReadMutation]);

  const { sendMessage } = useWebSocket(handleWsMessage);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    if (room.notReadCount > 0) {
      updateReadMutation.mutate(room.chattingRoomNo);
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

        // 첫 메시지가 있으면 바로 전송
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

  const handleSendMessage = (text) => {
    if (!selectedRoom || !currentMemberNo) return;
    sendMessage({
      messageContent: text,
      chattingRoomNo: selectedRoom.chattingRoomNo,
      targetNo: selectedRoom.targetNo,
    });
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const handleClose = () => {
    setSelectedRoom(null);
    onClose();
  };

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
                {selectedRoom && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-900" />
                  </button>
                )}
                <h2 className="text-base font-bold text-slate-900">
                  {selectedRoom ? selectedRoom.targetNickName : '메시지'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

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
              ) : (
                <ChatRoomList
                  rooms={rooms}
                  selectedRoomNo={null}
                  onSelectRoom={handleSelectRoom}
                  onNewChat={() => setShowSearchModal(true)}
                  currentUserNickname={user?.memberNickname}
                  hideHeader={true}
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
