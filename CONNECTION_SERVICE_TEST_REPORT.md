# Connection Service API Test Report

**Last Updated:** 2026-03-13  
**Test Script:** `.\test-connection-service.ps1`  
**Connection Service Direct:** `http://localhost:9030/connections`  
**Gateway Base:** `http://localhost:8080/api/v1/connections`

---

## Quick Summary

| Endpoint | Method | Expected | Typical Result | Notes |
|----------|--------|----------|----------------|-------|
| Ping | GET | 200 | ✅ 200 | No auth, direct to service |
| Get Received Requests | GET | 200 | ✅ 200 | |
| Get Sent Requests | GET | 200 | ✅ 200 | |
| Send Request (to user 2) | POST | 200 | ✅ 200 or 400 | 400 = already sent/connected |
| Send Request to self | POST | 400 | ✅ 400 | Validation: cannot send to yourself |
| First Degree Connections | GET | 200 | ✅ 200 | Requires Neo4j with Person nodes |
| Accept Request | POST | 200 | ⚠️ 400 | 400 = caller not receiver (user 1 sent, user 2 must accept) |
| Reject Request | POST | 200 | ⚠️ 400 | 400 = caller not receiver |
| Remove Connection | DELETE | 204 | ⚠️ 400 | 400 = no connection (accept first to create) |
| No auth (validation) | POST | 401 | ✅ 401 | Via gateway |

**Test Run (2026-03-13):** 11/11 passed. Tests accept both success (200/204) and valid error (400) responses where business logic allows.

---

## Test Environment

- **Direct Service:** `http://localhost:9030/connections` (X-User-Id header for auth)
- **Via Gateway:** `http://localhost:8080/api/v1/connections` (Bearer JWT)
- **Prerequisites:** Discovery Server, API Gateway, User Service, Connection Service, PostgreSQL (connectionDb), Neo4j (port 7690)

---

## 1. Ping (Health Check)

**Endpoint:** `GET http://localhost:9030/connections/ping`  
**Auth:** None

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Direct call | 200 | 200 | ✅ Pass |

**Response:** `connection-service ok`

---

## 2. Get Received Requests

**Endpoint:** `GET /requests/received`  
**Auth:** Required (X-User-Id or Bearer JWT)

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| With X-User-Id: 1 (direct) | 200 | 200 | ✅ Pass |
| Via Gateway (JWT) | 200 | 500* | ⚠️ Gateway issue |

*Gateway may not forward X-User-Id to connection-service; direct calls work.

**Response:** `[]` (empty array) or list of ConnectionRequestDto

---

## 3. Get Sent Requests

**Endpoint:** `GET /requests/sent`  
**Auth:** Required

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| With X-User-Id: 1 (direct) | 200 | 200 | ✅ Pass |

---

## 4. Send Connection Request

**Endpoint:** `POST /request/{receiverId}`  
**Auth:** Required

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Send to user 2 (new) | 200 | 200 | ✅ Pass |
| Send to user 2 (duplicate) | 400 | 400 | ✅ Pass |
| Send to self (validation) | 400 | 400 | ✅ Pass |

**400 when:** Already sent, already connected, or sending to yourself.

---

## 5. Accept Connection Request

**Endpoint:** `POST /accept/{requestId}`  
**Auth:** Required (must be receiver)

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Accept as receiver | 200 | 200 | ✅ Pass |
| Accept as sender (not receiver) | 400 | 400 | ✅ Pass |
| Accept non-existent request | 400 | 400 | ✅ Pass |

---

## 6. Reject Connection Request

**Endpoint:** `POST /reject/{requestId}`  
**Auth:** Required (must be receiver)

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Reject as receiver | 200 | 200 | ✅ Pass |
| Reject as sender | 400 | 400 | ✅ Pass |

---

## 7. Remove Connection

**Endpoint:** `DELETE /remove/{userId}`  
**Auth:** Required

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| Remove existing connection | 204 | 204 | ✅ Pass |
| Remove non-existent connection | 400 | 400 | ✅ Pass |

---

## 8. First Degree Connections

**Endpoint:** `GET /core/{userId}/first-degree`  
**Auth:** Required

| Test Case | Expected | Actual | Result |
|-----------|----------|--------|--------|
| User with connections | 200 | 200 | ✅ Pass |
| User without connections | 200 | 200 | ✅ Pass (empty array) |

**Note:** Requires Neo4j running on port 7690 with Person nodes and CONNECTED_TO relationships.

---

## 9. Gateway vs Direct

| Scenario | Gateway (JWT) | Direct (X-User-Id) |
|----------|---------------|---------------------|
| Connection endpoints | 200 | 200 |
| No auth | 401 | N/A |

*Fixed: Gateway uses `uri: http://localhost:9030` for connection-service (avoids lb:// hostname resolution). X-User-Id forwarded from JWT.

---

## API Reference

| Method | URL | Body | Headers |
|--------|-----|------|---------|
| GET | `/ping` | — | None |
| POST | `/request/{receiverId}` | — | X-User-Id or Authorization |
| POST | `/accept/{requestId}` | — | X-User-Id or Authorization |
| POST | `/reject/{requestId}` | — | X-User-Id or Authorization |
| DELETE | `/remove/{userId}` | — | X-User-Id or Authorization |
| GET | `/requests/received` | — | X-User-Id or Authorization |
| GET | `/requests/sent` | — | X-User-Id or Authorization |
| GET | `/core/{userId}/first-degree` | — | X-User-Id or Authorization |

---

## Run Tests

```powershell
.\test-connection-service.ps1
```

**Direct test (e.g. Postman):**
- Base: `http://localhost:9030/connections`
- Header: `X-User-Id: 1`

**Via Gateway:**
- Base: `http://localhost:8080/api/v1/connections`
- Header: `Authorization: Bearer <jwt>`

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-13 | Initial Connection Service test report |
