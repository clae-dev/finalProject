package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 채팅 메시지 DTO
 *
 * <p>MESSAGE 테이블과 매핑되는 메시지 데이터 객체.
 * WebSocket 전송 시 수신자(targetNo) 지정 필드를 추가로 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MessageDTO {

    /** 메시지 번호 (PK) */
    private int messageNo;
    /** 메시지 내용 */
    private String messageContent;
    /** 읽음 여부 (Y/N) */
    private String readFl;
    /** 발신자 회원 번호 (FK → MEMBER) */
    private int senderNo;
    /** 채팅방 번호 (FK → CHATTING_ROOM) */
    private int chattingRoomNo;
    /** 전송 시간 */
    private String sendTime;

    /** 수신자 회원 번호 (WebSocket 전송 시 수신자 지정용, DB 컬럼 아님) */
    private int targetNo;
}
