package edu.kh.project.notification.dto;

import lombok.*;

/**
 * 알림 DTO
 *
 * <p>NOTIFICATION 테이블과 매핑되는 알림 데이터 객체.
 * REST API 응답과 WebSocket 실시간 알림 전송 양쪽에서 사용한다.
 * 알림 유형(COMPANION_JOIN, COMPANION_ACCEPTED 등), 대상, 발신자 정보를 포함한다.</p>
 *
 * @author HONDI
 */
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
    /** 알림 유형 (COMPANION_JOIN, COMPANION_ACCEPTED 등) */
    private String notificationType;
    private String targetType;
    private int targetNo;
    private String title;
    private String content;
    /** 읽음 여부 (Y/N) */
    private String readFl;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    private String createdAt;

    private String senderNickname;
    private String senderProfileImg;
}
