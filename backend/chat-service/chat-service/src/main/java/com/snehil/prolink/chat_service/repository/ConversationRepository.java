package com.snehil.prolink.chat_service.repository;

import com.snehil.prolink.chat_service.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    /** Find 1:1 conversation between these two participants */
    @Query("{ 'participantIds': { $all: [?0, ?1] }, $expr: { $eq: [ { $size: '$participantIds' }, 2 ] } }")
    Optional<Conversation> findConversationBetween(Long userId1, Long userId2);

    /** Find all conversations for a user, ordered by last message */
    List<Conversation> findByParticipantIdsContainingOrderByLastMessageAtDesc(Long userId);
}
