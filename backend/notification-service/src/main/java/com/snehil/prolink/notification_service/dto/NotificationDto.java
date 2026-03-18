package com.snehil.prolink.notification_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDto {
    private Long id;
    private Long userId;
    private String message;
    private boolean read;
    private LocalDateTime createAt;
}
