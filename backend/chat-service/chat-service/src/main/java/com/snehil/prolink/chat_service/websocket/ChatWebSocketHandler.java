package com.snehil.prolink.chat_service.websocket;

import com.snehil.prolink.chat_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket handler for real-time chat.
 * Clients connect to /chat/ws, subscribe to /topic/conversations/{conversationId}, and send to /app/chat/{conversationId}.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{conversationId}")
    public void sendMessage(
            @DestinationVariable String conversationId,
            @Payload Map<String, Object> payload) {

        Object senderIdObj = payload.get("senderId");
        Object contentObj = payload.get("content");
        if (senderIdObj == null || contentObj == null) return;

        Long senderId = senderIdObj instanceof Number n ? n.longValue() : Long.parseLong(senderIdObj.toString());
        String content = contentObj.toString();

        var msg = chatService.sendMessage(conversationId, senderId, content);

        var response = Map.of(
                "id", msg.getId(),
                "conversationId", msg.getConversationId(),
                "senderId", msg.getSenderId(),
                "content", msg.getContent(),
                "createdAt", msg.getCreatedAt().toString()
        );

        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, response);
    }
}
