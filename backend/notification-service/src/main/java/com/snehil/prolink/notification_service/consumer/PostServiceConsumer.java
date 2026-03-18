package com.snehil.prolink.notification_service.consumer;

import com.snehil.prolink.notification_service.clients.ConnectionClient;
import com.snehil.prolink.notification_service.dto.PersonDto;
import com.snehil.prolink.notification_service.entity.Notification;
import com.snehil.prolink.notification_service.repository.NotificationRepository;
import com.snehil.prolink.post.event.PostCreatedEvent;
import com.snehil.prolink.post.event.PostLikedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostServiceConsumer {

    private final ConnectionClient connectionClient;
    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "post-created-topic")
    public void handlePostCreated(PostCreatedEvent postCreatedEvent) {
        log.info("Sending notification: handlePostCreated");
        Long creatorId = postCreatedEvent.getCreatorId();
        if (creatorId == null) {
            log.warn("Skipping post-created notification: creatorId is null");
            return;
        }
        List<PersonDto> connections = connectionClient.getFirstConnection(creatorId);

        for (PersonDto connection: connections) {
            sendNotification(connection.getUserId(), "Your connection " + postCreatedEvent.getCreatorId() + " has created a post. Check it out!");
        }
    }

    @KafkaListener(topics = "post-liked-topic")
    public void handlePostLiked(PostLikedEvent postLikedEvent) {
        log.info("Sending notification: handlePostLiked: {}",postLikedEvent);
        Long likedBy = postLikedEvent.getLikedByUserId();
        String message = likedBy != null
                ? String.format("Your post %d has been liked by user %d", postLikedEvent.getPostId(), likedBy)
                : String.format("Your post %d has been liked", postLikedEvent.getPostId());

        sendNotification(postLikedEvent.getCreatorId(),message);
    }

    public void sendNotification(Long userId, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUserId(userId);

        notificationRepository.save(notification);
    }


}
