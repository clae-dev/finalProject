package edu.kh.project.chatting.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.chatting.dto.GroupChatRoomDTO;
import edu.kh.project.chatting.dto.GroupMemberDTO;
import edu.kh.project.chatting.dto.GroupMessageDTO;

/**
 * 그룹 채팅 MyBatis Mapper
 *
 * <p>GROUP_CHAT_ROOM, GROUP_CHAT_MEMBER, GROUP_MESSAGE, GROUP_MSG_READ
 * 테이블에 대한 SQL 매핑 인터페이스.</p>
 */
@Mapper
public interface GroupChatMapper {

    /** 그룹 채팅방 생성 (selectKey로 PK 선취) */
    void insertGroupRoom(GroupChatRoomDTO room);

    /** companionNo로 이미 생성된 그룹방 번호 조회 */
    Integer selectGroupRoomNoByCompanionNo(@Param("companionNo") int companionNo);

    /** 그룹 멤버 추가 */
    void insertGroupMember(@Param("groupRoomNo") int groupRoomNo,
                           @Param("memberNo") int memberNo);

    /** 내가 속한 그룹 채팅방 목록 조회 (마지막 메시지, 미읽음 수 포함) */
    List<GroupChatRoomDTO> selectGroupRoomList(@Param("memberNo") int memberNo);

    /** 그룹 채팅방 멤버 번호 목록 (브로드캐스트용) */
    List<Integer> selectGroupMemberNos(@Param("groupRoomNo") int groupRoomNo);

    /** 그룹 채팅방 멤버 상세 목록 (MEMBER JOIN) */
    List<GroupMemberDTO> selectGroupMembers(@Param("groupRoomNo") int groupRoomNo);

    /** 그룹 메시지 저장 (selectKey로 PK 선취) */
    void insertGroupMessage(GroupMessageDTO msg);

    /** 그룹 메시지 목록 조회 (발신자 닉네임/프로필 JOIN) */
    List<GroupMessageDTO> selectGroupMessageList(@Param("groupRoomNo") int groupRoomNo);

    /** 읽음 워터마크 UPSERT (0 전달 시 현재 최신 메시지로 자동 설정) */
    void upsertGroupReadMark(@Param("groupRoomNo") int groupRoomNo,
                             @Param("memberNo") int memberNo,
                             @Param("lastReadMsg") int lastReadMsg);
}
