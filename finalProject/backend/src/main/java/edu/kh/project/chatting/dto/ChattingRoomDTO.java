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
public class ChattingRoomDTO {

    private int chattingRoomNo;
    private String lastMessage;
    private String sendTime;
    private int targetNo;
    private String targetNickName;
    private String targetProfile;
    private int notReadCount;
}
