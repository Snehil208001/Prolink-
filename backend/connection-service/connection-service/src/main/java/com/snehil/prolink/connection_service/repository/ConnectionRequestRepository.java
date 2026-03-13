package com.snehil.prolink.connection_service.repository;

import com.snehil.prolink.connection_service.entity.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    Optional<ConnectionRequest> findBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    List<ConnectionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(Long receiverId, ConnectionRequest.ConnectionRequestStatus status);

    List<ConnectionRequest> findBySenderIdAndStatusOrderByCreatedAtDesc(Long senderId, ConnectionRequest.ConnectionRequestStatus status);

    @Query("SELECT r FROM ConnectionRequest r WHERE r.status = 'ACCEPTED' AND (r.senderId = :userId OR r.receiverId = :userId)")
    List<ConnectionRequest> findAcceptedConnectionsByUserId(@Param("userId") Long userId);
}
