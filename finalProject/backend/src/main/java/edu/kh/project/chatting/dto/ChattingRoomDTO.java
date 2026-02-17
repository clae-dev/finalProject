package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 채팅방 DTO
 *
 * <p>CHATTING_ROOM 테이블과 매핑되는 채팅방 데이터 객체.
 * 마지막 메시지, 상대방 정보, 읽지 않은 메시지 수를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChattingRoomDTO {

    /** 채팅방 번호 (PK) */
    private int chattingRoomNo;
    /** 마지막 메시지 내용 */
    private String lastMessage;
    /** 마지막 메시지 전송 시간 */
    private String sendTime;
    /** 상대방 회원 번호 */
    private int targetNo;
    /** 상대방 닉네임 */
    private String targetNickName;
    /** 상대방 프로필 이미지 */
    private String targetProfile;
    /** 읽지 않은 메시지 수 */
    private int notReadCount;
}
