package com.snehil.prolink.connection_service.service;

import com.snehil.prolink.connection_service.auth.UserContextHolder;
import com.snehil.prolink.connection_service.dto.ConnectionRequestDto;
import com.snehil.prolink.connection_service.dto.ConnectedUserDto;
import com.snehil.prolink.connection_service.entity.ConnectionRequest;
import com.snehil.prolink.connection_service.exception.ConnectionRequestException;
import com.snehil.prolink.connection_service.repository.ConnectionRequestRepository;
import com.snehil.prolink.connection_service.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionRequestService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final PersonRepository personRepository;

    @Transactional(transactionManager = "transactionManager")
    public ConnectionRequestDto sendRequest(Long receiverId) {
        Long senderId = UserContextHolder.getCurrentUserId();
        if (senderId == null) {
            throw new ConnectionRequestException("User must be authenticated to send connection request");
        }
        if (senderId.equals(receiverId)) {
            throw new ConnectionRequestException("Cannot send connection request to yourself");
        }
        if (connectionRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, ConnectionRequest.ConnectionRequestStatus.PENDING)
                || connectionRequestRepository.existsBySenderIdAndReceiverIdAndStatus(receiverId, senderId, ConnectionRequest.ConnectionRequestStatus.PENDING)) {
            throw new ConnectionRequestException("Connection request already exists (sent or received)");
        }
        // Best-effort check: skip if Neo4j unavailable or Person nodes don't exist
        if (connectionExists(senderId, receiverId)) {
            throw new ConnectionRequestException("Already connected");
        }

        ConnectionRequest request = new ConnectionRequest();
        request.setSenderId(senderId);
        request.setReceiverId(receiverId);
        request.setStatus(ConnectionRequest.ConnectionRequestStatus.PENDING);
        request = connectionRequestRepository.save(request);
        log.info("Connection request sent from {} to {}", senderId, receiverId);
        return toDto(request);
    }

    @Transactional(transactionManager = "transactionManager")
    public ConnectionRequestDto acceptRequest(Long requestId) {
        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            throw new ConnectionRequestException("User must be authenticated to accept connection request");
        }

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ConnectionRequestException("Connection request not found"));
        if (!request.getReceiverId().equals(currentUserId)) {
            throw new ConnectionRequestException("Only the receiver can accept this request");
        }
        if (request.getStatus() != ConnectionRequest.ConnectionRequestStatus.PENDING) {
            throw new ConnectionRequestException("Request is no longer pending");
        }

        request.setStatus(ConnectionRequest.ConnectionRequestStatus.ACCEPTED);
        connectionRequestRepository.save(request);
        personRepository.createConnection(request.getSenderId(), request.getReceiverId());
        log.info("Connection request {} accepted, connection created between {} and {}", requestId, request.getSenderId(), request.getReceiverId());
        return toDto(request);
    }

    @Transactional(transactionManager = "transactionManager")
    public ConnectionRequestDto rejectRequest(Long requestId) {
        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            throw new ConnectionRequestException("User must be authenticated to reject connection request");
        }

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ConnectionRequestException("Connection request not found"));
        if (!request.getReceiverId().equals(currentUserId)) {
            throw new ConnectionRequestException("Only the receiver can reject this request");
        }
        if (request.getStatus() != ConnectionRequest.ConnectionRequestStatus.PENDING) {
            throw new ConnectionRequestException("Request is no longer pending");
        }

        request.setStatus(ConnectionRequest.ConnectionRequestStatus.REJECTED);
        connectionRequestRepository.save(request);
        log.info("Connection request {} rejected", requestId);
        return toDto(request);
    }

    @Transactional(transactionManager = "transactionManager")
    public void removeConnection(Long otherUserId) {
        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            throw new ConnectionRequestException("User must be authenticated to remove connection");
        }
        if (currentUserId.equals(otherUserId)) {
            throw new ConnectionRequestException("Cannot remove connection with yourself");
        }
        if (!connectionExists(currentUserId, otherUserId)) {
            throw new ConnectionRequestException("No connection exists between users");
        }

        personRepository.deleteConnection(currentUserId, otherUserId);
        log.info("Connection removed between {} and {}", currentUserId, otherUserId);
    }

    public List<ConnectionRequestDto> getReceivedRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            throw new ConnectionRequestException("User must be authenticated");
        }
        return connectionRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(userId, ConnectionRequest.ConnectionRequestStatus.PENDING)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ConnectionRequestDto> getSentRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            throw new ConnectionRequestException("User must be authenticated");
        }
        return connectionRequestRepository.findBySenderIdAndStatusOrderByCreatedAtDesc(userId, ConnectionRequest.ConnectionRequestStatus.PENDING)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get connected user IDs from PostgreSQL (source of truth).
     * Returns users who have ACCEPTED connection with the given userId.
     */
    public List<ConnectedUserDto> getConnections(Long userId) {
        return connectionRequestRepository.findAcceptedConnectionsByUserId(userId)
                .stream()
                .map(r -> r.getSenderId().equals(userId) ? r.getReceiverId() : r.getSenderId())
                .map(ConnectedUserDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Checks if a connection exists in Neo4j. Returns false if Person nodes don't exist
     * or query returns no rows (empty list avoids exceptions).
     */
    private boolean connectionExists(Long userId1, Long userId2) {
        try {
            var result = personRepository.countConnection(userId1, userId2);
            return !result.isEmpty() && result.get(0) != null && result.get(0) > 0;
        } catch (Exception e) {
            log.debug("Could not check Neo4j connection (nodes may not exist): {}", e.getMessage());
            return false;
        }
    }

    private ConnectionRequestDto toDto(ConnectionRequest request) {
        return ConnectionRequestDto.builder()
                .id(request.getId())
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
