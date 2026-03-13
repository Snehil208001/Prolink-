package com.snehil.prolink.user_service.aspect;

import com.snehil.prolink.user_service.annotation.HasRole;
import com.snehil.prolink.user_service.annotation.IsAdmin;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

/**
 * AOP Aspect that checks if the current user has the required role before allowing method execution.
 * Reads X-User-Role from request header (set by API Gateway from JWT).
 */
@Aspect
@Component
public class RoleCheckAspect {

    private static final Logger log = LoggerFactory.getLogger(RoleCheckAspect.class);
    private static final String USER_ROLE_HEADER = "X-User-Role";

    @Around("@annotation(hasRole) || @annotation(isAdmin)")
    public Object checkRole(ProceedingJoinPoint joinPoint, HasRole hasRole, IsAdmin isAdmin) throws Throwable {
        String requiredRole = hasRole != null ? hasRole.value() : "ADMIN";
        String userRole = getUserRoleFromRequest();

        if (userRole == null || userRole.isBlank()) {
            log.warn("Role check failed: X-User-Role header not found. Endpoint requires role: {}", requiredRole);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied. Authentication required.");
        }

        if (!requiredRole.equalsIgnoreCase(userRole)) {
            log.warn("Role check failed: User has role {} but endpoint requires {}", userRole, requiredRole);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied. Required role: " + requiredRole);
        }

        log.debug("Role check passed: User has required role {}", requiredRole);
        return joinPoint.proceed();
    }

    private String getUserRoleFromRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader(USER_ROLE_HEADER);
    }
}
