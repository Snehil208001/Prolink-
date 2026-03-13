package com.snehil.prolink.chat_service.service;

import com.snehil.prolink.chat_service.entity.Conversation;
import com.snehil.prolink.chat_service.entity.Message;
import com.snehil.prolink.chat_service.repository.ConversationRepository;
import com.snehil.prolink.chat_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

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
            String preview = content.length() > 80 ? content.substring(0, 80) + "..." : content;
            conv.setLastMessageAt(savedMsg.getCreatedAt());
            conv.setLastMessagePreview(preview);
            conv.setUpdatedAt(savedMsg.getCreatedAt());
            // Increment unread for recipient (the other participant)
            Long recipientId = conv.getParticipantIds().stream()
                    .filter(id -> !id.equals(senderId))
                    .findFirst()
                    .orElse(null);
            if (recipientId != null) {
                conv.getUnreadCounts().merge(recipientId, 1, Integer::sum);
            }
            conversationRepository.save(conv);
        });

        return msg;
    }

    public void markAsRead(String conversationId, Long userId) {
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            conv.getUnreadCounts().put(userId, 0);
            conversationRepository.save(conv);
        });
    }
}
