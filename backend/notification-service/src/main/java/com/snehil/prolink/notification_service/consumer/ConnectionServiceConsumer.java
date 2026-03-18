package com.snehil.prolink.notification_service.consumer;

import com.snehil.prolink.connection_service.event.ConnectionRequestAcceptedEvent;
import com.snehil.prolink.connection_service.event.ConnectionRequestRejectedEvent;
import com.snehil.prolink.connection_service.event.ConnectionRequestSentEvent;
import com.snehil.prolink.notification_service.entity.Notification;
import com.snehil.prolink.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConnectionServiceConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "connection-request-sent-topic")
    public void handleConnectionRequestSent(ConnectionRequestSentEvent event) {
        log.info("Connection request sent: {}", event);
        if (event.getReceiverId() == null) {
            log.warn("Skipping: receiverId is null");
            return;
        }
        String message = String.format("User %d sent you a connection request", event.getSenderId());
        sendNotification(event.getReceiverId(), message);
    }

    @KafkaListener(topics = "connection-request-accepted-topic")
    public void handleConnectionRequestAccepted(ConnectionRequestAcceptedEvent event) {
        log.info("Connection request accepted: {}", event);
        if (event.getSenderId() == null) {
            log.warn("Skipping: senderId is null");
            return;
        }
        String message = String.format("User %d accepted your connection request", event.getReceiverId());
        sendNotification(event.getSenderId(), message);
    }

    @KafkaListener(topics = "connection-request-rejected-topic")
    public void handleConnectionRequestRejected(ConnectionRequestRejectedEvent event) {
        log.info("Connection request rejected: {}", event);
        if (event.getSenderId() == null) {
            log.warn("Skipping: senderId is null");
            return;
        }
        String message = String.format("User %d declined your connection request", event.getReceiverId());
        sendNotification(event.getSenderId(), message);
    }

    private void sendNotification(Long userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
