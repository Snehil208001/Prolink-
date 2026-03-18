package com.snehil.prolink.chat_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private String id;
    private List<Long> participantIds;
    private Long otherUserId;  // For 1:1: the other participant
    private String lastMessagePreview;
    private Instant lastMessageAt;
    private int unreadCount;
}
