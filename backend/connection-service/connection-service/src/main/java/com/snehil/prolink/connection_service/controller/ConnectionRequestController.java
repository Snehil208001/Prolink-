package com.snehil.prolink.connection_service.controller;

import com.snehil.prolink.connection_service.auth.UserContextHolder;
import com.snehil.prolink.connection_service.dto.ConnectionRequestDto;
import com.snehil.prolink.connection_service.service.ConnectionRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ConnectionRequestController {

    private final ConnectionRequestService connectionRequestService;

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<ConnectionRequestDto> sendRequest(@PathVariable Long receiverId) {
        Long userId = UserContextHolder.getCurrentUserId();
        log.info("sendRequest: receiverId={}, currentUserId={}", receiverId, userId);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        ConnectionRequestDto dto = connectionRequestService.sendRequest(receiverId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<ConnectionRequestDto> acceptRequest(@PathVariable Long requestId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        ConnectionRequestDto dto = connectionRequestService.acceptRequest(requestId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<ConnectionRequestDto> rejectRequest(@PathVariable Long requestId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        ConnectionRequestDto dto = connectionRequestService.rejectRequest(requestId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/remove/{userId}")
    public ResponseEntity<Void> removeConnection(@PathVariable Long userId) {
        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        connectionRequestService.removeConnection(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/requests/received")
    public ResponseEntity<List<ConnectionRequestDto>> getReceivedRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(connectionRequestService.getReceivedRequests());
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<List<ConnectionRequestDto>> getSentRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(connectionRequestService.getSentRequests());
    }

    /** Debug: verify service is reachable. Call GET /connections/ping (no auth). */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("connection-service ok");
    }

}
