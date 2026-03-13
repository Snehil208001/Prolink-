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

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<UserDto> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userIdFromHeader,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = userIdFromHeader;
        if (userId == null && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            userId = jwtService.getUserIdFromToken(token);
        }
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userService.getProfile(userId));
    }
}
