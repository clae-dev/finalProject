package edu.kh.project.chatting.service;

import java.util.List;
import java.util.Map;

import edu.kh.project.chatting.dto.ChattingRoomDTO;
import edu.kh.project.chatting.dto.MessageDTO;

/**
 * 채팅 서비스 인터페이스
 */
public interface ChattingService {

    /** 채팅방 목록 조회 */
    List<ChattingRoomDTO> selectRoomList(int memberNo);

    /** 대화 상대 검색 */
    List<Map<String, Object>> searchTarget(String query, int memberNo);

    /** 채팅방 입장/생성 (기존 방이 있으면 해당 방 번호 반환, 없으면 새로 생성) */
    int enterChatRoom(int memberNo, int targetNo);

    /** 메시지 목록 조회 */
    List<MessageDTO> selectMessageList(int chattingRoomNo);

    /** 메시지 저장 (WebSocket 핸들러에서 호출) */
    int insertMessage(MessageDTO msg);

    /** 읽음 처리 */
    int updateReadFlag(int chattingRoomNo, int memberNo);
}
