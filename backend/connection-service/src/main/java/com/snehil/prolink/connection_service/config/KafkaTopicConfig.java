package com.snehil.prolink.connection_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    public static final String CONNECTION_REQUEST_SENT_TOPIC = "connection-request-sent-topic";
    public static final String CONNECTION_REQUEST_ACCEPTED_TOPIC = "connection-request-accepted-topic";
    public static final String CONNECTION_REQUEST_REJECTED_TOPIC = "connection-request-rejected-topic";

    @Bean
    public NewTopic connectionRequestSentTopic() {
        return new NewTopic(CONNECTION_REQUEST_SENT_TOPIC, 3, (short) 1);
    }

    @Bean
    public NewTopic connectionRequestAcceptedTopic() {
        return new NewTopic(CONNECTION_REQUEST_ACCEPTED_TOPIC, 3, (short) 1);
    }

    @Bean
    public NewTopic connectionRequestRejectedTopic() {
        return new NewTopic(CONNECTION_REQUEST_REJECTED_TOPIC, 3, (short) 1);
    }
}
