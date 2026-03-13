package edu.kh.project.chatting.service;

import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.chatting.dto.GroupChatRoomDTO;
import edu.kh.project.chatting.dto.GroupMessageDTO;
import edu.kh.project.chatting.mapper.GroupChatMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 그룹 채팅 서비스 구현체
 *
 * <p>동행 신청 수락 시 그룹 채팅방을 자동 생성하고,
 * 멀티플 참여자 간 실시간 메시지 저장·조회·읽음 처리를 담당한다.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GroupChatServiceImpl implements GroupChatService {

    private final GroupChatMapper groupChatMapper;

    @Override
    public void createGroupRoom(int companionNo, String roomName, List<Integer> memberNos) {

        // 이미 해당 동행에 대한 방이 있으면 재사용
        Integer existingRoomNo = groupChatMapper.selectGroupRoomNoByCompanionNo(companionNo);
        int groupRoomNo;

        if (existingRoomNo == null) {
            GroupChatRoomDTO room = GroupChatRoomDTO.builder()
                    .companionNo(companionNo)
                    .roomName(roomName)
                    .build();
            groupChatMapper.insertGroupRoom(room);
            groupRoomNo = room.getGroupRoomNo();
            log.info("그룹 채팅방 생성 - groupRoomNo: {}, companionNo: {}", groupRoomNo, companionNo);
        } else {
            groupRoomNo = existingRoomNo;
            log.debug("그룹 채팅방 재사용 - groupRoomNo: {}, companionNo: {}", groupRoomNo, companionNo);
        }

        // 멤버 추가 (UK 충돌은 조용히 흡수)
        for (int memberNo : memberNos) {
            try {
                groupChatMapper.insertGroupMember(groupRoomNo, memberNo);
            } catch (DuplicateKeyException e) {
                log.debug("그룹 멤버 중복 무시 - groupRoomNo: {}, memberNo: {}", groupRoomNo, memberNo);
            }
        }
    }

    @Override
    public void addGroupMember(int groupRoomNo, int memberNo) {
        try {
            groupChatMapper.insertGroupMember(groupRoomNo, memberNo);
        } catch (DuplicateKeyException e) {
            log.debug("그룹 멤버 중복 무시 - groupRoomNo: {}, memberNo: {}", groupRoomNo, memberNo);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupChatRoomDTO> selectGroupRoomList(int memberNo) {
        return groupChatMapper.selectGroupRoomList(memberNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Integer> selectGroupMemberNos(int groupRoomNo) {
        return groupChatMapper.selectGroupMemberNos(groupRoomNo);
    }

    @Override
    public void insertGroupMessage(GroupMessageDTO msg) {
        groupChatMapper.insertGroupMessage(msg);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupMessageDTO> selectGroupMessageList(int groupRoomNo) {
        return groupChatMapper.selectGroupMessageList(groupRoomNo);
    }

    @Override
    public void markGroupMessagesRead(int groupRoomNo, int memberNo, int lastReadMsg) {
        groupChatMapper.upsertGroupReadMark(groupRoomNo, memberNo, lastReadMsg);
    }
}
