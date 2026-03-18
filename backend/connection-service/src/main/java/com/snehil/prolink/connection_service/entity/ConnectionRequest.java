package com.snehil.prolink.connection_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "connection_requests", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"sender_id", "receiver_id"})
})
public class ConnectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionRequestStatus status = ConnectionRequestStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum ConnectionRequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
