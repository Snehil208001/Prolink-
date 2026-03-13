package com.snehil.prolink.chat_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
@CompoundIndex(name = "participants_idx", def = "{'participantIds': 1}")
public class Conversation {

    @Id
    private String id;

    /** User IDs participating in this conversation (sorted for consistent lookup) */
    private List<Long> participantIds;

    /** Last message timestamp for sorting */
    private Instant lastMessageAt;

    /** Last message preview */
    private String lastMessagePreview;

    /** Unread count per user: userId -> count */
    @Builder.Default
    private java.util.Map<Long, Integer> unreadCounts = new java.util.HashMap<>();

    private Instant createdAt;
    private Instant updatedAt;

    public static Conversation create(List<Long> participantIds) {
        Instant now = Instant.now();
        return Conversation.builder()
                .participantIds(new ArrayList<>(participantIds))
                .lastMessageAt(now)
                .createdAt(now)
                .updatedAt(now)
                .unreadCounts(new java.util.HashMap<>())
                .build();
    }
}
