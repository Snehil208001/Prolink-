package com.snehil.prolink.api_gateway.filters;

import com.snehil.prolink.api_gateway.JwtService;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

@Slf4j
@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private static final String X_USER_ID = "X-User-Id";
    private static final String X_USER_ROLE = "X-User-Role";

    private final JwtService jwtService;

    public AuthenticationFilter(JwtService jwtService) {
        super(Config.class);
        this.jwtService = jwtService;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            log.info("Authenticating request: {}", exchange.getRequest().getURI());

            String token = null;
            final String tokenHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
                token = tokenHeader.substring(7).trim();
            }
            if (token == null || token.isEmpty()) {
                token = exchange.getRequest().getQueryParams().getFirst("token");
            }
            if (token == null || token.isEmpty()) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                log.error("Authorization token not found or invalid format");
                return exchange.getResponse().setComplete();
            }

            try {
                String userId = jwtService.getUserIdFromToken(token);
                String role = jwtService.getRoleFromToken(token);

                // Mutate request with headers - forwarded to all downstream services (connection, post, user)
                ServerHttpRequest mutatedRequest = exchange.getRequest()
                        .mutate()
                        .header(X_USER_ID, userId)
                        .header(X_USER_ROLE, role != null ? role : "USER")
                        .build();

                ServerWebExchange modifiedExchange = exchange.mutate()
                        .request(mutatedRequest)
                        .build();

                log.debug("Forwarding X-User-Id={} to downstream", userId);
                return chain.filter(modifiedExchange);
            } catch (JwtException e) {
                log.error("JWT Exception: {}", e.getLocalizedMessage());
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

        };
    }

    public static class Config {

    }
}
