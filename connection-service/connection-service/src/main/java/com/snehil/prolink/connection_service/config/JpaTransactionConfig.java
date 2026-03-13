package com.snehil.prolink.connection_service.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;

/**
 * Explicit JPA transaction manager named "transactionManager" for Spring Data JPA.
 * Required when using both JPA and Neo4j - JPA repositories expect a bean named "transactionManager".
 */
@Configuration
public class JpaTransactionConfig {

    @Bean("transactionManager")
    @Primary
    public JpaTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
