# JWT in HttpOnly Cookie (Security Improvement)

## Current Risk

The app stores the JWT in `localStorage`, which is accessible to JavaScript. If an XSS (Cross-Site Scripting) vulnerability exists, a malicious script can steal the token.

## Recommended Fix: HttpOnly Cookie

Store the JWT in an **HttpOnly, Secure** cookie. This makes it inaccessible to JavaScript and protects against XSS token theft.

### Backend Changes (Spring Boot user-service)

1. **Login endpoint** – Set cookie in response:

```java
@PostMapping("/login")
public ResponseEntity<String> login(@RequestBody LoginRequestDto dto) {
    String token = authService.login(dto);
    ResponseCookie cookie = ResponseCookie.from("prolink-token", token)
        .httpOnly(true)
        .secure(true)  // use true in production (HTTPS)
        .sameSite("Strict")
        .path("/")
        .maxAge(Duration.ofDays(7))
        .build();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(token);  // or return empty body
}
```

2. **Auth filter** – Read token from cookie when `Authorization` header is missing:

```java
String token = request.getHeader("Authorization");
if (token == null && request.getCookies() != null) {
    for (Cookie c : request.getCookies()) {
        if ("prolink-token".equals(c.getName())) {
            token = "Bearer " + c.getValue();
            break;
        }
    }
}
```

3. **Logout** – Clear the cookie:

```java
ResponseCookie cookie = ResponseCookie.from("prolink-token", "")
    .httpOnly(true)
    .secure(true)
    .path("/")
    .maxAge(0)
    .build();
return ResponseEntity.ok()
    .header(HttpHeaders.SET_COOKIE, cookie.toString())
    .build();
```

### Frontend Changes

1. **Remove** `localStorage.setItem('prolink-token', ...)` and `localStorage.getItem('prolink-token')`
2. **Add** `credentials: 'include'` to all API requests (Axios: `withCredentials: true` – already set)
3. **AuthContext** – On login, the backend sets the cookie; no need to store token in frontend
4. **Logout** – Call backend logout endpoint to clear cookie, or navigate away

### API Gateway

Ensure the gateway forwards the `Cookie` header to downstream services when proxying requests.
