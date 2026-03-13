package edu.kh.project.chatting.service;

import java.util.List;

import edu.kh.project.chatting.dto.GroupChatRoomDTO;
import edu.kh.project.chatting.dto.GroupMessageDTO;

/**
 * 그룹 채팅 서비스 인터페이스
 */
public interface GroupChatService {

    /**
     * 그룹 채팅방 생성 (멱등 — 동행 당 1개 보장)
     *
     * <p>companionNo에 해당하는 방이 이미 있으면 새 멤버만 추가한다.
     * GROUP_CHAT_MEMBER UK 위반은 조용히 흡수한다.</p>
     *
     * @param companionNo 동행 게시글 번호
     * @param roomName    채팅방 이름 (동행 제목 스냅샷)
     * @param memberNos   초기 멤버 번호 목록
     */
    void createGroupRoom(int companionNo, String roomName, List<Integer> memberNos);

    /**
     * 그룹 채팅방 멤버 추가
     *
     * @param groupRoomNo 그룹 채팅방 번호
     * @param memberNo    추가할 회원 번호
     */
    void addGroupMember(int groupRoomNo, int memberNo);

    /**
     * 내가 속한 그룹 채팅방 목록 조회
     *
     * @param memberNo 요청 회원 번호
     * @return 그룹 채팅방 목록 (마지막 메시지, 미읽음 수, 멤버 포함)
     */
    List<GroupChatRoomDTO> selectGroupRoomList(int memberNo);

    /**
     * 그룹 채팅방 멤버 번호 목록 조회 (WebSocket 브로드캐스트용)
     *
     * @param groupRoomNo 그룹 채팅방 번호
     * @return 멤버 번호 목록
     */
    List<Integer> selectGroupMemberNos(int groupRoomNo);

    /**
     * 그룹 메시지 저장
     *
     * <p>저장 후 msg.groupMsgNo에 시퀀스 값이 채워진다.</p>
     *
     * @param msg 메시지 DTO (senderNo, groupRoomNo, msgContent 필수)
     */
    void insertGroupMessage(GroupMessageDTO msg);

    /**
     * 그룹 메시지 목록 조회
     *
     * @param groupRoomNo 그룹 채팅방 번호
     * @return 메시지 목록 (발신자 닉네임/프로필 포함)
     */
    List<GroupMessageDTO> selectGroupMessageList(int groupRoomNo);

    /**
     * 읽음 워터마크 갱신
     *
     * @param groupRoomNo  그룹 채팅방 번호
     * @param memberNo     읽은 회원 번호
     * @param lastReadMsg  마지막으로 읽은 메시지 번호 (0이면 현재 최신으로 설정)
     */
    void markGroupMessagesRead(int groupRoomNo, int memberNo, int lastReadMsg);
}
