package com.snehil.prolink.connection_service.config;

import org.neo4j.driver.Driver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.neo4j.core.DatabaseSelectionProvider;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.mapping.Neo4jMappingContext;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;

/**
 * Explicit Neo4j transaction manager and template required when using both JPA and Neo4j.
 * JPA creates a TransactionManager first, so Neo4j's is skipped by auto-config,
 * leaving Neo4jTemplate with a null transactionTemplate.
 */
@Configuration
public class Neo4jTransactionConfig {

    @Bean("neo4jTransactionManager")
    public Neo4jTransactionManager neo4jTransactionManager(
            Driver driver,
            DatabaseSelectionProvider databaseSelectionProvider) {
        return new Neo4jTransactionManager(driver, databaseSelectionProvider);
    }

    @Bean
    @Primary
    public Neo4jTemplate neo4jTemplate(
            Neo4jClient neo4jClient,
            Neo4jMappingContext neo4jMappingContext,
            Neo4jTransactionManager neo4jTransactionManager) {
        return new Neo4jTemplate(neo4jClient, neo4jMappingContext, neo4jTransactionManager);
    }
}
