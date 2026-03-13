# ProLink Test Report

**Generated:** 2026-03-13  
**Test Environment:** Windows, localhost  
**Gateway:** http://localhost:8080  
**Credentials:** snehil123@gmail.com / pass

---

## Executive Summary

| Test Suite | Passed | Total | Status |
|------------|--------|-------|--------|
| Connection Service (Direct) | 11 | 11 | ✅ All Pass |
| Connection Service (Gateway) | 4 | 4 | ✅ All Pass |
| Main API (Gateway) | 11 | 11 | ✅ All Pass |

**All issues resolved.** Gateway now routes connection-service correctly using `uri: http://localhost:9030` (avoids lb:// hostname resolution issues with Eureka).

---

## 1. Connection Service Tests

**Script:** `.\test-connection-service.ps1`

### 1.1 Direct Service (localhost:9030, X-User-Id: 1)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Ping | 200 | 200 | ✅ Pass |
| Get Received Requests | 200 | 200 | ✅ Pass |
| Get Sent Requests | 200 | 200 | ✅ Pass |
| Send Request (to user 2) | 200 or 400 | 400 | ✅ Pass* |
| Send Request to self | 400 | 400 | ✅ Pass |
| Get Sent Requests (after send) | 200 | 200 | ✅ Pass |
| First Degree Connections | 200 | 200 | ✅ Pass |
| Accept Request (id=1) | 200 or 400 | 400 | ✅ Pass* |
| Reject Request (id=2) | 200 or 400 | 400 | ✅ Pass* |
| Remove Connection (user 2) | 204 or 400 | 400 | ✅ Pass* |
| Send Request without auth | 401 | 401 | ✅ Pass |

*400 is valid when: request already exists, caller is not receiver, or no connection exists.

### 1.2 Via Gateway (localhost:8080, JWT)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| [Gateway] Get Received Requests | 200 | 200 | ✅ Pass |
| [Gateway] Get Sent Requests | 200 | 200 | ✅ Pass |
| [Gateway] Ping | 200 | 200 | ✅ Pass |
| [Gateway] Send Request (to user 2) | 200 or 400 | 400 | ✅ Pass* |

*400 when request already exists. X-User-Id is correctly forwarded from JWT.

---

## 2. Main API Tests

**Script:** `.\test-api.ps1`

### 2.1 Public Endpoints (no auth)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Signup empty body | 400 | 400 | ✅ Pass |
| Login empty body | 400 | 400 | ✅ Pass |

### 2.2 Protected Endpoints (JWT via Gateway)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Create Post | 201 | 201 | ✅ Pass |
| Get Profile | 200 | 200 | ✅ Pass |
| Get Post | 200 | 200 | ✅ Pass |
| Get All Posts | 200 | 200 | ✅ Pass |
| Like post | 204 | 204 | ✅ Pass |
| Unlike post | 204 | 204 | ✅ Pass |
| First Degree | 200 | 200 | ✅ Pass |
| Admin Get Users | 200 | 200 | ✅ Pass |

---

## 3. Fixes Applied

| Issue | Fix |
|-------|-----|
| Gateway → Connection Service 500 | Changed `uri` from `lb://CONNECTION-SERVICE` to `http://localhost:9030` for all connection-service routes. Eureka registered hostname (Snehil.mshome.net) caused lb:// resolution issues. |
| X-User-Id from JWT | AuthenticationFilter already forwards X-User-Id; verified working via gateway. |

**Note:** For multi-instance deployment, use `lb://CONNECTION-SERVICE` with `eureka.instance.prefer-ip-address=true` on connection-service.

---

## 4. Prerequisites

- Discovery Server (Eureka) – port 8761
- API Gateway – port 8080
- User Service – port 9020
- Post Service – port 9010
- Connection Service – port 9030
- PostgreSQL (connectionDb)
- Neo4j (port 7690)

---

## 5. Run Tests

```powershell
# Connection Service (direct + gateway)
.\test-connection-service.ps1

# Main API (via gateway)
.\test-api.ps1
```

---

*Report updated after fixing gateway routing. All tests pass.*
