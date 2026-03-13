package com.snehil.prolink.user_service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Requires the current user to have the specified role.
 * Use with AOP - checks X-User-Role header (set by API Gateway from JWT).
 * User must be authenticated; gateway must add X-User-Role header.
 */
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface HasRole {
    String value();
}
