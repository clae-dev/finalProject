package edu.kh.project.notification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NotificationDTO {

    private int notificationNo;
    private int recipientNo;
    private int senderNo;
    private String notificationType;
    private String targetType;
    private int targetNo;
    private String title;
    private String content;
    private String readFl;
    private String status;
    private String createdAt;

    // JOIN 파생 필드 (sender 정보)
    private String senderNickname;
    private String senderProfileImg;
}
