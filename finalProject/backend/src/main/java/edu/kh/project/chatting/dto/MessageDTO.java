package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 채팅 메시지 DTO
 * - MESSAGE 테이블과 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MessageDTO {

    private int messageNo;         // 메시지 번호 (PK)
    private String messageContent; // 메시지 내용
    private String readFl;         // 읽음 여부 (Y/N)
    private int senderNo;          // 발신자 회원 번호 (FK)
    private int chattingRoomNo;    // 채팅방 번호 (FK)
    private String sendTime;       // 전송 시간

    // WebSocket 전송 시 수신자 지정용 (DB 컬럼 아님)
    private int targetNo;          // 수신자 회원 번호
}
