package com.snehil.prolink.user_service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Requires the current user to have ADMIN role.
 * Equivalent to @HasRole("ADMIN").
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@HasRole("ADMIN")
public @interface IsAdmin {
}
