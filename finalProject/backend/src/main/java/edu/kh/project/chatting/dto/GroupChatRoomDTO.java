package edu.kh.project.chatting.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 그룹 채팅방 DTO
 *
 * <p>GROUP_CHAT_ROOM 테이블과 매핑되는 그룹 채팅방 데이터 객체.
 * 마지막 메시지, 미읽음 수, 멤버 목록을 포함한다.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GroupChatRoomDTO {

    /** 그룹 채팅방 번호 (PK) */
    private int groupRoomNo;

    /** 연결된 동행 게시글 번호 */
    private int companionNo;

    /** 채팅방 이름 (동행 제목 스냅샷) */
    private String roomName;

    /** 마지막 메시지 내용 */
    private String lastMessage;

    /** 마지막 메시지 전송 시간 */
    private String lastSendTime;

    /** 미읽음 메시지 수 */
    private int unreadCount;

    /** 멤버 수 */
    private int memberCount;

    /** 멤버 목록 */
    private List<GroupMemberDTO> members;
}
