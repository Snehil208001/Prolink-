package com.snehil.prolink.notification_service.controller;

import com.snehil.prolink.notification_service.dto.NotificationDto;
import com.snehil.prolink.notification_service.exception.UnauthorizedException;
import com.snehil.prolink.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        List<NotificationDto> notifications = notificationService.getNotificationsForCurrentUser();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id) {
        try {
            NotificationDto dto = notificationService.markAsRead(id);
            return ResponseEntity.ok(dto);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(401).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
