package com.snehil.prolink.chat_service;

import com.snehil.prolink.chat_service.repository.ConversationRepository;
import com.snehil.prolink.chat_service.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class ChatServiceApplicationTests {

	@MockBean
	ConversationRepository conversationRepository;

	@MockBean
	MessageRepository messageRepository;

	@Test
	void contextLoads() {
	}
}
