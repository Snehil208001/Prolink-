package com.snehil.prolink.chat_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private String id;
    private String conversationId;
    private Long senderId;
    private String content;
    private boolean read;
    private Instant createdAt;
}
