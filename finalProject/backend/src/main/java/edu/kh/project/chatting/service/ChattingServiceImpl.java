package edu.kh.project.chatting.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.chatting.dto.ChattingRoomDTO;
import edu.kh.project.chatting.dto.MessageDTO;
import edu.kh.project.chatting.mapper.ChattingMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 채팅 서비스 구현체
 *
 * <p>1:1 채팅방 생성, 채팅방 목록 조회, 메시지 저장,
 * 읽음 처리 등 실시간 채팅 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChattingServiceImpl implements ChattingService {

    private final ChattingMapper chattingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ChattingRoomDTO> selectRoomList(int memberNo) {
        return chattingMapper.selectRoomList(memberNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> searchTarget(String query, int memberNo) {
        return chattingMapper.searchTarget(query, memberNo);
    }

    @Override
    public int enterChatRoom(int memberNo, int targetNo) {

        // 기존 채팅방 있는지 조회
        Integer roomNo = chattingMapper.selectExistRoom(memberNo, targetNo);

        if (roomNo != null) {
            return roomNo;
        }

        // 없으면 새로 생성
        chattingMapper.insertChattingRoom(memberNo, targetNo);

        // 방금 생성된 방 번호 조회
        Integer newRoomNo = chattingMapper.selectExistRoom(memberNo, targetNo);
        if (newRoomNo == null) {
            throw new RuntimeException("채팅방 생성에 실패했습니다.");
        }
        return newRoomNo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> selectMessageList(int chattingRoomNo, Integer beforeMessageNo, int limit) {
        return chattingMapper.selectMessageList(chattingRoomNo, beforeMessageNo, limit);
    }

    @Override
    public int insertMessage(MessageDTO msg) {
        return chattingMapper.insertMessage(msg);
    }

    @Override
    public int updateReadFlag(int chattingRoomNo, int memberNo) {
        return chattingMapper.updateReadFlag(chattingRoomNo, memberNo);
    }
}
