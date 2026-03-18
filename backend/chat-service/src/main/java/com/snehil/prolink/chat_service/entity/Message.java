package com.snehil.prolink.chat_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
@CompoundIndex(name = "conversation_created_idx", def = "{'conversationId': 1, 'createdAt': 1}")
public class Message {

    @Id
    private String id;

    private String conversationId;
    private Long senderId;
    private String content;

    @Builder.Default
    private boolean read = false;

    private Instant createdAt;

    public static Message create(String conversationId, Long senderId, String content) {
        return Message.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .content(content)
                .read(false)
                .createdAt(Instant.now())
                .build();
    }
}
