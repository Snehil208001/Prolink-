# ProLink API Test Results

**Test Date:** 2026-03-11  
**Direct URLs:** User (9020), Post (9010), Connection via Gateway (8080)

---

## 1. User Service - Signup

**Endpoint:** `POST http://localhost:9020/users/auth/signup`  
**Required fields:** `name`, `email`, `password`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid signup | `{"name":"TestUser","email":"testapi2@mail.com","password":"pass123"}` | 201 | 201 + UserDto | ✅ Pass |
| Empty body (missing all) | `{}` | 400 | 500 | ❌ Fail - no validation |

---

## 2. User Service - Login

**Endpoint:** `POST http://localhost:9020/users/auth/login`  
**Required fields:** `email`, `password`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid login | `{"email":"testapi2@mail.com","password":"pass123"}` | 200 | 200 + JWT token | ✅ Pass |
| Empty body | `{}` | 400 | 404 | ⚠️ Returns 404 (null email) |

---

## 3. Post Service - Create Post

**Endpoint:** `POST http://localhost:9010/posts/core`  
**Required fields:** `content`

| Test Case | Request Body | Expected | Actual | Result |
|-----------|--------------|----------|--------|--------|
| Valid post | `{"content":"Test post"}` | 201 | 201 + PostDto | ✅ Pass |
| Empty body (missing content) | `{}` | 400 | 500 | ❌ Fail - no validation |

---

## 4. Post Service - Get Post

**Endpoint:** `GET http://localhost:9010/posts/core/{postId}`

| Test Case | URL | Expected | Actual | Result |
|-----------|-----|----------|--------|--------|
| Valid ID | `/posts/core/12` | 200 | 200 + post | ✅ Pass |

---

## 5. Connection Service - First Degree

**Endpoint:** `GET http://localhost:8080/api/v1/connections/core/{userId}/first-degree`

| Test Case | URL | Expected | Actual | Result |
|-----------|-----|----------|--------|--------|
| User with connections | `/api/v1/connections/core/4/first-degree` | 200 | 200 + [User 5, User 6] | ✅ Pass |

---

## Summary

| Endpoint | Valid Request | Missing Required Fields |
|----------|---------------|-------------------------|
| Signup | ✅ 201 | ❌ 500 (should be 400) |
| Login | ✅ 200 | ⚠️ 404 (null email) |
| Create Post | ✅ 201 | ❌ 500 (should be 400) |
| Get Post | ✅ 200 | - |
| First Degree | ✅ 200 | - |

**Required field validation:** Signup and Create Post return **500** instead of **400** when required fields are missing. Add `@Valid` and `@NotBlank`/`@NotNull` to DTOs to return proper 400 Bad Request.
