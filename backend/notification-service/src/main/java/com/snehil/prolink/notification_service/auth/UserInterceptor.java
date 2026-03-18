package com.snehil.prolink.notification_service.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UserInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public UserInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String userId = request.getHeader("X-User-Id");
        if (userId != null && !userId.isBlank()) {
            try {
                UserContextHolder.setCurrentUserId(Long.parseLong(userId.trim()));
                return HandlerInterceptor.super.preHandle(request, response, handler);
            } catch (NumberFormatException ignored) {
                // Invalid userId format - try JWT fallback
            }
        }
        // Fallback: extract userId from Bearer token (when gateway doesn't forward X-User-Id)
        String authHeader = request.getHeader("Authorization");
        Long userIdFromJwt = jwtUtil.getUserIdFromToken(authHeader);
        if (userIdFromJwt != null) {
            UserContextHolder.setCurrentUserId(userIdFromJwt);
        }
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserContextHolder.clear();
    }
}
