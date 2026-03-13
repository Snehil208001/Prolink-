# Debugging 500 on POST /connections/request/{userId}

## Step 1: Test connection-service directly (bypass gateway)

**Restart connection-service**, then in Postman:

1. **Ping (no auth):**
   ```
   GET http://localhost:9030/connections/ping
   ```
   Expected: `200` with body `connection-service ok`

2. **Send request (with X-User-Id header):**
   ```
   POST http://localhost:9030/connections/request/3
   Header: X-User-Id: 1
   ```
   Expected: `200` with ConnectionRequestDto, or `400` with error message

- If **direct call works** → issue is in the gateway (routing, headers, auth).
- If **direct call fails** → check connection-service console logs for the full stack trace.

## Step 2: Check connection-service logs

When you make the request, look for:

- `sendRequest: receiverId=3, currentUserId=...` → request reached the controller
- `Unhandled exception: ...` → full stack trace of the error

## Step 3: If using gateway

Ensure:

1. Eureka is running (port 8761)
2. connection-service is registered (check Eureka dashboard)
3. JWT is valid and `Authorization: Bearer <token>` header is set
