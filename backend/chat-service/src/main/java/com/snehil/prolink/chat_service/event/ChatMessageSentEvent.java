package com.snehil.prolink.chat_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageSentEvent {
    private String conversationId;
    private Long senderId;
    private Long recipientId;
    private String contentPreview;
}
