package edu.kh.project.notification.service;

import edu.kh.project.admin.mapper.AdminMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.mapper.NotificationMapper;
import edu.kh.project.websocket.handler.NotificationWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private final AdminMapper adminMapper;

    @Override
    @CacheEvict(value = "notificationCount", key = "#notification.recipientNo")
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
    @CacheEvict(value = "notificationCount", allEntries = true)
    public void notifyAllAdmins(NotificationDTO template) {
        List<Integer> adminNos = adminMapper.selectAdminMemberNos();
        if (adminNos == null || adminNos.isEmpty()) return;

        // 1. 관리자별 NotificationDTO 구성
        List<NotificationDTO> notifications = new ArrayList<>(adminNos.size());
        for (int adminNo : adminNos) {
            notifications.add(NotificationDTO.builder()
                    .recipientNo(adminNo)
                    .senderNo(template.getSenderNo())
                    .notificationType(template.getNotificationType())
                    .targetType(template.getTargetType())
                    .targetNo(template.getTargetNo())
                    .title(template.getTitle())
                    .content(template.getContent())
                    .build());
        }

        // 2. 단일 INSERT ALL로 DB 일괄 저장
        notificationMapper.insertBatch(notifications);

        // 3. WebSocket 브로드캐스트 (개별 실패가 전체를 막지 않도록 try/catch)
        for (NotificationDTO n : notifications) {
            try {
                notificationWebSocketHandler.sendToUser(n.getRecipientNo(), n);
            } catch (Exception e) {
                log.warn("알림 WebSocket push 실패 - recipientNo: {}", n.getRecipientNo(), e);
            }
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
    @Cacheable(value = "notificationCount", key = "#recipientNo")
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
    @CacheEvict(value = "notificationCount", key = "#recipientNo")
    public int deleteNotification(int notificationNo, int recipientNo) {
        return notificationMapper.deleteNotification(notificationNo, recipientNo);
    }

    @Override
    @CacheEvict(value = "notificationCount", key = "#recipientNo")
    public int deleteAllNotifications(int recipientNo) {
        return notificationMapper.deleteAllNotifications(recipientNo);
    }
}
