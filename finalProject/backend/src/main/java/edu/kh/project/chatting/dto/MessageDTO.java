package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MessageDTO {

    private int messageNo;
    private String messageContent;
    private String readFl;
    private int senderNo;
    private int chattingRoomNo;
    private String sendTime;

    // WebSocket 전송 시 수신자 지정용 (DB 컬럼 아님)
    private int targetNo;
}
