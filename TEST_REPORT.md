# ProLink Test Report

**Last Run:** 2026-03-13  
**Gateway:** http://localhost:8080  
**Credentials:** snehil123@gmail.com / pass

---

## Executive Summary

| Test Suite | Passed | Total | Status |
|------------|--------|-------|--------|
| Main API (Gateway) | 9 | 12 | ⚠️ 3 Fail |
| Connection Service | 14 | 15 | ⚠️ 1 Fail |

**Failing tests:** Get Post (500), First Degree (503). See Prerequisites below.

---

## 1. Main API Tests (`.\test-api.ps1`)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Signup empty body | 400 | 400 | ✅ Pass |
| Login empty body | 400 | 400 | ✅ Pass |
| Create Post | 201 | 201 | ✅ Pass |
| Get Profile | 200 | 200 | ✅ Pass |
| Get Post | 200 | 500 | ❌ Fail |
| Get All Posts | 200 | 200 | ✅ Pass |
| Get Feed | 200 | 200 | ✅ Pass |
| Like post | 204 | 204 | ✅ Pass |
| Unlike post | 204 | 204 | ✅ Pass |
| First Degree | 200 | 503 | ❌ Fail |
| Admin Get Users | 200 | 200 | ✅ Pass |

---

## 2. Connection Service Tests (`.\test-connection-service.ps1`)

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Ping (direct) | 200 | 200 | ✅ Pass |
| Get Received Requests | 200 | 200 | ✅ Pass |
| Get Sent Requests | 200 | 200 | ✅ Pass |
| Send Request to self | 400 | 400 | ✅ Pass |
| Get Sent Requests (after) | 200 | 200 | ✅ Pass |
| First Degree Connections | 200 | 503 | ❌ Fail |
| Send Request without auth | 401 | 401 | ✅ Pass |
| [Gateway] Get Received | 200 | 200 | ✅ Pass |
| [Gateway] Get Sent | 200 | 200 | ✅ Pass |
| [Gateway] Ping | 200 | 200 | ✅ Pass |

*400 for Send/Accept/Reject/Remove is valid when business logic dictates (already exists, not receiver, etc.).*

---

## 3. Fixes Applied

| Issue | Fix |
|-------|-----|
| **Get Post 500** | PostService.getPostById called connectionClient without try-catch; when connection-service returns 503, it propagated. Wrapped in try-catch so Get Post returns 200 even when Neo4j is down. **Restart post-service** to apply. |
| **First Degree 503** | Neo4j must be running. See Prerequisites. |

---

## 4. Prerequisites (All Must Be Running)

| Service | Port | Notes |
|--------|------|-------|
| Discovery Server | 8761 | Eureka |
| API Gateway | 8080 | All requests go through here |
| User Service | 9020 | |
| Post Service | 9010 | **Restart after code fix** |
| Connection Service | 9030 | |
| PostgreSQL | 5432 | userDb, postDb, connectionDb |
| **Neo4j** | **7690** (or 7687) | **Required for First Degree** |

### Neo4j Setup (for First Degree to work)

1. Start Neo4j (Desktop or Docker: `docker run -p 7687:7687 -p 7474:7474 neo4j`)
2. Create database, credentials: neo4j / password
3. Run in Neo4j Browser (http://localhost:7474):

```cypher
CREATE (p1:Person {userId: 1, name: "User 1"})
CREATE (p2:Person {userId: 2, name: "User 2"})
CREATE (p3:Person {userId: 3, name: "User 3"})
CREATE (p1)-[:CONNECTED_TO]->(p2)
CREATE (p1)-[:CONNECTED_TO]->(p3);
```

4. Restart connection-service

---

## 5. Before Starting Frontend

1. **Restart post-service** (to apply Get Post fix)
2. **Start Neo4j** (for First Degree)
3. Run tests: `.\test-api.ps1` and `.\test-connection-service.ps1`
4. All tests should pass

---

## 6. Run Tests

```powershell
.\test-api.ps1
.\test-connection-service.ps1
```

---

## 7. Frontend Tests (Browser)

**Last Run:** 2026-03-07  
**URL:** http://localhost:5173

| Test | Result |
|------|--------|
| Auth page loads | ✅ Pass |
| Quick Test Login (dev) | ✅ Pass |
| Home Feed | ✅ Pass |
| Create Post | ✅ Pass |
| My Network (discover users) | ✅ Pass |
| Profile page | ✅ Pass |
| Navigation (Home, Network, Profile) | ✅ Pass |

**Notes:**
- Use "Quick Test Login" on Auth page (dev only) for fast testing with test2@test.com / pass123
- Vite proxy: `/api` → `http://localhost:8080` (avoids CORS in dev)
- Restart frontend after changing `vite.config.js` or `api/client.js`
