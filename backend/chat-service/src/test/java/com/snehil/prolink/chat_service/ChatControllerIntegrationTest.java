package com.snehil.prolink.chat_service;

import com.snehil.prolink.chat_service.entity.Conversation;
import com.snehil.prolink.chat_service.entity.Message;
import com.snehil.prolink.chat_service.service.ChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ChatControllerIntegrationTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	ChatService chatService;

	@Test
	void getConversations_returnsEmptyList() throws Exception {
		when(chatService.getConversationsForUser(1L)).thenReturn(List.of());

		mockMvc.perform(get("/conversations").header("X-User-Id", "1"))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(0));
	}

	@Test
	void createConversation_returnsConversation() throws Exception {
		Conversation conv = Conversation.builder()
				.id("conv123")
				.participantIds(List.of(1L, 2L))
				.lastMessageAt(Instant.now())
				.createdAt(Instant.now())
				.updatedAt(Instant.now())
				.build();
		when(chatService.getOrCreateConversation(1L, 2L)).thenReturn(conv);

		mockMvc.perform(post("/conversations?otherUserId=2").header("X-User-Id", "1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value("conv123"))
				.andExpect(jsonPath("$.participantIds").isArray())
				.andExpect(jsonPath("$.otherUserId").value(2));
	}

	@Test
	void sendMessage_returnsMessage() throws Exception {
		Message msg = Message.builder()
				.id("msg1")
				.conversationId("conv123")
				.senderId(1L)
				.content("Hello!")
				.createdAt(Instant.now())
				.build();
		when(chatService.sendMessage(eq("conv123"), eq(1L), eq("Hello!"))).thenReturn(msg);

		mockMvc.perform(post("/conversations/conv123/messages")
						.header("X-User-Id", "1")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"content\":\"Hello!\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value("msg1"))
				.andExpect(jsonPath("$.content").value("Hello!"))
				.andExpect(jsonPath("$.senderId").value(1))
				.andExpect(jsonPath("$.conversationId").value("conv123"));
	}

	@Test
	void getMessages_returnsMessages() throws Exception {
		Message msg = Message.builder()
				.id("msg1")
				.conversationId("conv123")
				.senderId(1L)
				.content("Hi")
				.createdAt(Instant.now())
				.build();
		when(chatService.getMessages("conv123", 50)).thenReturn(List.of(msg));

		mockMvc.perform(get("/conversations/conv123/messages").header("X-User-Id", "1"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].content").value("Hi"));
	}
}
