package com.snehil.prolink.chat_service.service;

import com.snehil.prolink.chat_service.config.KafkaTopicConfig;
import com.snehil.prolink.chat_service.entity.Conversation;
import com.snehil.prolink.chat_service.entity.Message;
import com.snehil.prolink.chat_service.event.ChatMessageSentEvent;
import com.snehil.prolink.chat_service.repository.ConversationRepository;
import com.snehil.prolink.chat_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final KafkaTemplate<Long, Object> kafkaTemplate;

    public Conversation getOrCreateConversation(Long userId1, Long userId2) {
        List<Long> ids = List.of(userId1, userId2).stream().sorted().collect(Collectors.toList());
        return conversationRepository
                .findConversationBetween(userId1, userId2)
                .orElseGet(() -> {
                    Conversation c = Conversation.create(ids);
                    return conversationRepository.save(c);
                });
    }

    public List<Conversation> getConversationsForUser(Long userId) {
        return conversationRepository.findByParticipantIdsContainingOrderByLastMessageAtDesc(userId);
    }

    public List<Message> getMessages(String conversationId, int limit) {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(
                conversationId, PageRequest.of(0, limit));
    }

    public Message sendMessage(String conversationId, Long senderId, String content) {
        Message msg = messageRepository.save(Message.create(conversationId, senderId, content));
        final Message savedMsg = msg;

        conversationRepository.findById(conversationId).ifPresent(conv -> {
            String safeContent = content != null ? content : "";
            String preview = safeContent.length() > 80 ? safeContent.substring(0, 80) + "..." : safeContent;
            conv.setLastMessageAt(savedMsg.getCreatedAt());
            conv.setLastMessagePreview(preview);
            conv.setUpdatedAt(savedMsg.getCreatedAt());
            // Increment unread for recipient (the other participant)
            Long recipientId = conv.getParticipantIds().stream()
                    .filter(id -> !id.equals(senderId))
                    .findFirst()
                    .orElse(null);
            if (recipientId != null) {
                var counts = conv.getUnreadCounts();
                if (counts == null) {
                    counts = new java.util.HashMap<>();
                    conv.setUnreadCounts(counts);
                }
                counts.merge(recipientId, 1, Integer::sum);
            }
            conversationRepository.save(conv);
            publishChatMessageSent(conversationId, senderId, recipientId, safeContent);
        });

        return msg;
    }

    private void publishChatMessageSent(String conversationId, Long senderId, Long recipientId, String content) {
        if (recipientId == null) return;
        try {
            String preview = content != null && content.length() > 50 ? content.substring(0, 50) + "..." : content;
            ChatMessageSentEvent event = ChatMessageSentEvent.builder()
                    .conversationId(conversationId)
                    .senderId(senderId)
                    .recipientId(recipientId)
                    .contentPreview(preview != null ? preview : "")
                    .build();
            kafkaTemplate.send(KafkaTopicConfig.CHAT_MESSAGE_SENT_TOPIC, recipientId, event);
        } catch (Exception e) {
            log.warn("Failed to publish chat message sent event: {}", e.getMessage());
        }
    }

    public void markAsRead(String conversationId, Long userId) {
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            var counts = conv.getUnreadCounts();
            if (counts == null) {
                counts = new java.util.HashMap<>();
                conv.setUnreadCounts(counts);
            }
            counts.put(userId, 0);
            conversationRepository.save(conv);
        });
    }
}
