package com.snehil.prolink.user_service.controller;

import com.snehil.prolink.user_service.dto.UserDto;
import com.snehil.prolink.user_service.service.JwtService;
import com.snehil.prolink.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/network")
@RequiredArgsConstructor
public class NetworkController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/discover")
    public ResponseEntity<List<UserDto>> discoverUsers(
            @RequestHeader(value = "X-User-Id", required = false) Long userIdFromHeader,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = userIdFromHeader;
        if (currentUserId == null && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            currentUserId = jwtService.getUserIdFromToken(token);
        }
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<UserDto> users = userService.getUsersForDiscovery(currentUserId);
        return ResponseEntity.ok(users);
    }
}
