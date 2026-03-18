package com.snehil.prolink.chat_service.controller;

import com.snehil.prolink.chat_service.dto.ConversationDto;
import com.snehil.prolink.chat_service.dto.MessageDto;
import com.snehil.prolink.chat_service.entity.Conversation;
import com.snehil.prolink.chat_service.entity.Message;
import com.snehil.prolink.chat_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(@RequestHeader("X-User-Id") Long userId) {
        List<Conversation> convs = chatService.getConversationsForUser(userId);
        List<ConversationDto> dtos = convs.stream()
                .map(c -> toDto(c, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "50") int limit) {
        List<Message> msgs = chatService.getMessages(conversationId, limit);
        List<MessageDto> dtos = msgs.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> getOrCreateConversation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam Long otherUserId) {
        Conversation c = chatService.getOrCreateConversation(userId, otherUserId);
        return ResponseEntity.ok(toDto(c, userId));
    }

    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") Long userId) {
        chatService.markAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable String conversationId,
            @RequestHeader("X-User-Id") Long senderId,
            @RequestBody SendMessageRequest request) {
        Message msg = chatService.sendMessage(conversationId, senderId, request.getContent());
        return ResponseEntity.ok(toDto(msg));
    }

    private ConversationDto toDto(Conversation c, Long currentUserId) {
        var participantIds = c.getParticipantIds();
        Long other = (participantIds != null)
                ? participantIds.stream().filter(id -> !id.equals(currentUserId)).findFirst().orElse(null)
                : null;
        var unreadCounts = c.getUnreadCounts();
        int unread = (unreadCounts != null) ? unreadCounts.getOrDefault(currentUserId, 0) : 0;
        return ConversationDto.builder()
                .id(c.getId())
                .participantIds(c.getParticipantIds())
                .otherUserId(other)
                .lastMessagePreview(c.getLastMessagePreview())
                .lastMessageAt(c.getLastMessageAt())
                .unreadCount(unread)
                .build();
    }

    private MessageDto toDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .content(m.getContent())
                .read(m.isRead())
                .createdAt(m.getCreatedAt())
                .build();
    }

    @lombok.Data
    public static class SendMessageRequest {
        private String content;
    }
}
