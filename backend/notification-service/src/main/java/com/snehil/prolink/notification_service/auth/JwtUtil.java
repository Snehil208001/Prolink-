package com.snehil.prolink.notification_service.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public Long getUserIdFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        String jwt = token.substring(7).trim();
        if (jwt.isEmpty()) return null;
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();
            String sub = claims.getSubject();
            return sub != null ? Long.parseLong(sub) : null;
        } catch (Exception e) {
            return null;
        }
    }
}
