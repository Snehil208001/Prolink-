# ProLink API Test Results

**Last Updated:** 2026-03-13  
**Gateway Base URL:** `http://localhost:8080/api/v1`  
**Test Script:** `.\test-api.ps1`

---

## Quick Summary

| Endpoint | Valid | Validation | Status |
|----------|-------|------------|--------|
| Signup | ✅ 201 | ✅ 400 | Pass |
| Login | ✅ 200 | ✅ 400 | Pass |
| Create Post | ✅ 201 | ✅ 400 | Pass |
| Get Profile | ✅ 200 | - | Pass |
| Get Post | ✅ 200 | - | Pass |
| Like Post | ✅ 204 | ✅ 400 (duplicate) | Pass |
| Unlike Post | ✅ 204 | ✅ 400 (double unlike) | Pass |
| First Degree | ✅ 200 | - | Pass |

*Requires Neo4j on port 7690 with graph data.*

---

## 1. User Service - Signup

**Endpoint:** `POST /api/v1/users/auth/signup`  
**Required fields:** `name`, `email`, `password`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid signup | `{"name":"TestUser","email":"test@mail.com","password":"pass123"}` | 201 | 201 | ✅ Pass |
| Empty body | `{}` | 400 | 400 | ✅ Pass |

---

## 2. User Service - Login

**Endpoint:** `POST /api/v1/users/auth/login`  
**Required fields:** `email`, `password`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid login | `{"email":"test@mail.com","password":"pass123"}` | 200 | 200 | ✅ Pass |
| Empty body | `{}` | 400 | 400 | ✅ Pass |

---

## 3. User Service - Get Profile

**Endpoint:** `GET /api/v1/users/profile`  
**Auth:** Required (Bearer token). Returns current user's profile from X-User-Id header.

| Test Case | Expected | Result |
|-----------|----------|--------|
| With valid JWT | 200 + UserDto | ✅ Pass |

---

## 4. Post Service - Create Post

**Endpoint:** `POST /api/v1/posts/core`  
**Required fields:** `content`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid post | `{"content":"Test post"}` | 201 | 201 | ✅ Pass |
| Empty body | `{}` | 400 | 400 | ✅ Pass |

---

## 5. Post Service - Get Post

**Endpoint:** `GET /api/v1/posts/core/{postId}`

| Test Case | URL | Expected | Actual | Result |
|-----------|-----|----------|--------|--------|
| Valid ID | `/posts/core/1` | 200 | 200 | ✅ Pass |

---

## 6. Post Service - Like / Unlike

**Endpoints:**
- Like: `POST /api/v1/posts/likes/{postId}`
- Unlike: `DELETE /api/v1/posts/likes/{postId}`

| Test Case | Method | URL | Expected | Actual | Result |
|-----------|--------|-----|----------|--------|--------|
| Like post | POST | `/posts/likes/1` | 204 | 204 | ✅ Pass |
| Unlike post | DELETE | `/posts/likes/1` | 204 | 204 | ✅ Pass |
| Duplicate like | POST | `/posts/likes/1` (already liked) | 400 | 400 | ✅ Pass |
| Double unlike | DELETE | `/posts/likes/1` (not liked) | 400 | 400 | ✅ Pass |

---

## 7. Connection Service - First Degree

**Endpoint:** `GET /api/v1/connections/core/{userId}/first-degree`

| Test Case | URL | Expected | Actual | Result |
|-----------|-----|----------|--------|--------|
| User with connections | `/connections/core/1/first-degree` | 200 | 200 | ✅ Pass |

**Note:** Requires Neo4j running on port 7690 with Person nodes and CONNECTED_TO relationships.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-13 | Initial comprehensive test results; added Like/Unlike tests |
| 2026-03-13 | Added validation tests (400 for empty body); fixed Signup, Login, Create Post |

---

## Run Tests

```powershell
.\test-api.ps1
```

**Test credentials:** `snehil123@gmail.com` / `pass`

The script logs in first, gets a JWT, then tests all endpoints with the token in the `Authorization: Bearer <token>` header.

### Postman Setup

1. **Login** – `POST http://localhost:8080/api/v1/users/auth/login`  
   Body: `{"email":"snehil123@gmail.com","password":"pass"}`  
   Copy the JWT from the response.

2. **Protected endpoints** – Add header: `Authorization: Bearer <paste_jwt_here>`

   **Get Profile:** `GET http://localhost:8080/api/v1/users/profile`

See [BUG_REPORT.md](BUG_REPORT.md) for known issues and bug tracking.
