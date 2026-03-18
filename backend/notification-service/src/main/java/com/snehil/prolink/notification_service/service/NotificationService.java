package com.snehil.prolink.notification_service.service;

import com.snehil.prolink.notification_service.auth.UserContextHolder;
import com.snehil.prolink.notification_service.dto.NotificationDto;
import com.snehil.prolink.notification_service.entity.Notification;
import com.snehil.prolink.notification_service.exception.UnauthorizedException;
import com.snehil.prolink.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDto> getNotificationsForCurrentUser() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("User must be authenticated to fetch notifications");
        }
        return notificationRepository.findByUserIdOrderByCreateAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public NotificationDto markAsRead(Long notificationId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("User must be authenticated");
        }
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("Cannot mark another user's notification as read");
        }
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return toDto(notification);
    }

    public long getUnreadCount() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return 0;
        }
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .message(n.getMessage())
                .read(n.isRead())
                .createAt(n.getCreateAt())
                .build();
    }
}
