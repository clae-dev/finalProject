package edu.kh.project.notification.service;

import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.mapper.NotificationMapper;
import edu.kh.project.websocket.handler.NotificationWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 알림 서비스 구현체
 *
 * <p>알림 생성, 목록 조회, 읽음 처리, 삭제 및
 * WebSocket을 통한 실시간 알림 전송을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationMapper notificationMapper;
    private final NotificationWebSocketHandler notificationWebSocketHandler;

    @Override
    public void createNotification(NotificationDTO notification) {
        // DB 저장
        notificationMapper.insert(notification);

        // WebSocket push (sender 정보 포함해서 전송)
        try {
            notificationWebSocketHandler.sendToUser(
                notification.getRecipientNo(), notification
            );
        } catch (Exception e) {
            log.warn("알림 WebSocket push 실패 (DB 저장은 완료) - recipientNo: {}",
                notification.getRecipientNo(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotifications(int recipientNo, int page, int size) {
        int offset = (page - 1) * size;
        return notificationMapper.selectList(recipientNo, offset, size);
    }

    @Override
    @Transactional(readOnly = true)
    public int getNotificationCount(int recipientNo) {
        return notificationMapper.selectCount(recipientNo);
    }

    @Override
    @Transactional(readOnly = true)
    public int getUnreadCount(int recipientNo) {
        return notificationMapper.selectUnreadCount(recipientNo);
    }

    @Override
    public int markAsRead(int notificationNo, int recipientNo) {
        return notificationMapper.updateReadFlag(notificationNo, recipientNo);
    }

    @Override
    public int markAllAsRead(int recipientNo) {
        return notificationMapper.updateAllReadFlag(recipientNo);
    }

    @Override
    public int deleteNotification(int notificationNo, int recipientNo) {
        return notificationMapper.deleteNotification(notificationNo, recipientNo);
    }

    @Override
    public int deleteAllNotifications(int recipientNo) {
        return notificationMapper.deleteAllNotifications(recipientNo);
    }
}
