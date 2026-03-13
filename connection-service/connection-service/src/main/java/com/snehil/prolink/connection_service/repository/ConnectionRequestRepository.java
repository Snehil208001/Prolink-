package com.snehil.prolink.connection_service.repository;

import com.snehil.prolink.connection_service.entity.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    Optional<ConnectionRequest> findBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    List<ConnectionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    List<ConnectionRequest> findBySenderIdAndStatusOrderByCreatedAtDesc(Long senderId, ConnectionRequest.ConnectionRequestStatus status);
}
