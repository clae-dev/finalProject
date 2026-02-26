package edu.kh.project.notification.service;

import edu.kh.project.notification.dto.NotificationDTO;

import java.util.List;

/**
 * 알림 서비스 인터페이스
 *
 * <p>알림 생성(WebSocket push 포함), 목록 조회, 읽음 처리,
 * 삭제 등 알림 관련 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 */
public interface NotificationService {

    /** 알림 생성 + WebSocket push */
    void createNotification(NotificationDTO notification);

    /** 알림 목록 조회 (페이징) */
    List<NotificationDTO> getNotifications(int recipientNo, int page, int size);

    /** 전체 알림 수 */
    int getNotificationCount(int recipientNo);

    /** 읽지 않은 알림 수 */
    int getUnreadCount(int recipientNo);

    /** 단건 읽음 처리 */
    int markAsRead(int notificationNo, int recipientNo);

    /** 전체 읽음 처리 */
    int markAllAsRead(int recipientNo);

    /** 알림 삭제 */
    int deleteNotification(int notificationNo, int recipientNo);

    /** 알림 전체 삭제 */
    int deleteAllNotifications(int recipientNo);
}
