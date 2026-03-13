package com.snehil.prolink.connection_service.controller;

import com.snehil.prolink.connection_service.dto.ConnectedUserDto;
import com.snehil.prolink.connection_service.entity.Person;
import com.snehil.prolink.connection_service.service.ConnectionRequestService;
import com.snehil.prolink.connection_service.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;
    private final ConnectionRequestService connectionRequestService;

    @GetMapping("/{userId}/first-degree")
    public ResponseEntity<List<Person>> getFirstConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getFirstDegreeConnections(userId));
    }

    /**
     * Get connections from PostgreSQL (source of truth).
     * Use this when Neo4j first-degree may be out of sync.
     */
    @GetMapping("/{userId}/connections")
    public ResponseEntity<List<ConnectedUserDto>> getConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionRequestService.getConnections(userId));
    }
}
