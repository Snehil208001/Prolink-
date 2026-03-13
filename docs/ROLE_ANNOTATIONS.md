# Role-Based Access Control (Annotations + AOP)

## Overview

Custom annotations `@HasRole` and `@IsAdmin` with AOP for role-based access control. The API Gateway extracts role from JWT and adds `X-User-Role` header to requests.

## Annotations

### @HasRole("ROLE_NAME")

Requires the current user to have the specified role.

```java
@HasRole("ADMIN")
@GetMapping("/admin/users")
public ResponseEntity<List<UserDto>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}

@HasRole("USER")
@PostMapping("/something")
public ResponseEntity<?> doSomething() {
    // ...
}
```

### @IsAdmin

Requires the current user to have ADMIN role. Equivalent to `@HasRole("ADMIN")`.

```java
@IsAdmin
@GetMapping("/admin/users")
public ResponseEntity<List<UserDto>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}
```

## How It Works

1. **JWT** includes `role` claim (USER, ADMIN) when user logs in
2. **API Gateway** parses JWT and adds `X-User-Role` header to downstream requests
3. **RoleCheckAspect** (AOP) intercepts methods with `@HasRole` or `@IsAdmin`
4. Aspect reads `X-User-Role` from request header and compares with required role
5. If mismatch → returns **403 Forbidden**

## Usage in Other Services

To use in post-service, connection-service, etc.:

1. Copy `HasRole`, `IsAdmin` annotations and `RoleCheckAspect` to the service
2. Add `spring-boot-starter-aop` dependency
3. Ensure the route goes through the gateway with `AuthenticationFilter` (so `X-User-Role` is set)

## Example: Admin-Only Endpoint

**Endpoint:** `GET http://localhost:8080/api/v1/users/admin/users`

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:** 200 + list of users (if user has ADMIN role), 403 Forbidden (if not)

## Making a User Admin

Update the User entity in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@mail.com';
```

Or add a migration/seed to set the first user as ADMIN.
