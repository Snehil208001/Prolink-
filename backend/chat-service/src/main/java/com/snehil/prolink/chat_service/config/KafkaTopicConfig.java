package com.snehil.prolink.chat_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    public static final String CHAT_MESSAGE_SENT_TOPIC = "chat-message-sent-topic";

    @Bean
    public NewTopic chatMessageSentTopic() {
        return new NewTopic(CHAT_MESSAGE_SENT_TOPIC, 3, (short) 1);
    }
}
