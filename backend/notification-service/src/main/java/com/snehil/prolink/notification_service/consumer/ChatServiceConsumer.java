package com.snehil.prolink.notification_service.consumer;

import com.snehil.prolink.chat_service.event.ChatMessageSentEvent;
import com.snehil.prolink.notification_service.entity.Notification;
import com.snehil.prolink.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatServiceConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "chat-message-sent-topic")
    public void handleChatMessageSent(ChatMessageSentEvent event) {
        log.info("Chat message sent: {}", event);
        if (event.getRecipientId() == null) {
            log.warn("Skipping: recipientId is null");
            return;
        }
        String preview = event.getContentPreview();
        String message = preview != null && !preview.isBlank()
                ? String.format("User %d sent you a message: %s", event.getSenderId(), preview)
                : String.format("User %d sent you a message", event.getSenderId());
        sendNotification(event.getRecipientId(), message);
    }

    private void sendNotification(Long userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
