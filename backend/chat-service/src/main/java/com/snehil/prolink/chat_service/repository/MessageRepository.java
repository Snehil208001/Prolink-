package com.snehil.prolink.chat_service.repository;

import com.snehil.prolink.chat_service.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);
}
