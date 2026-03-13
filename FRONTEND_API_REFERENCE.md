# ProLink API Reference for Frontend

**All APIs must be called through the API Gateway.**

**Base URL:** `http://localhost:8080/api/v1`

**Auth:** For protected endpoints, add header: `Authorization: Bearer <jwt_token>`

---

## Quick Reference

| Service | Base Path | Auth |
|---------|-----------|------|
| Auth | `/users/auth` | No |
| User | `/users` | Yes (except auth) |
| Posts | `/posts` | Yes |
| Connections | `/connections` | Yes |

---

## 1. Auth (no token required)

### Signup
```
POST /api/v1/users/auth/signup
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** 201 + UserDto

### Login
```
POST /api/v1/users/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** 200 + JWT string (use as Bearer token)

---

## 2. User (auth required)

### Get Profile
```
GET /api/v1/users/profile
Authorization: Bearer <token>
```
**Response:** 200 + UserDto (id, name, email, headline, bio, location)

### Update Profile
```
PATCH /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "headline": "Software Engineer at Company",
  "bio": "About me...",
  "location": "San Francisco, CA"
}
```
**Response:** 200 + UserDto (all fields optional; only provided fields are updated)

### Admin – Get All Users
```
GET /api/v1/users/admin/users
Authorization: Bearer <token>
```
**Response:** 200 + List<UserDto> (admin role only)

### Discover Users (My Network)
```
GET /api/v1/users/network/discover
Authorization: Bearer <token>
```
**Response:** 200 + List<UserDto> (all users except current user)

---

## 3. Posts (auth required)

### Create Post
```
POST /api/v1/posts/core
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Post content here"
}
```
**Response:** 201 + PostDto

### Get Post
```
GET /api/v1/posts/core/{postId}
Authorization: Bearer <token>
```
**Response:** 200 + PostDto

### Get Feed (user + connections, newest first)
```
GET /api/v1/posts/core/feed
Authorization: Bearer <token>
```
**Response:** 200 + List<PostDto>

### Get All Posts of User
```
GET /api/v1/posts/core/users/{userId}/allPosts
Authorization: Bearer <token>
```
**Response:** 200 + List<PostDto>

### Repost (with optional quote)
```
POST /api/v1/posts/core/repost
Authorization: Bearer <token>
Content-Type: application/json

{
  "originalPostId": 1,
  "quoteText": "Optional quote text or null"
}
```
**Response:** 201 + PostDto

### Simple Repost (no body)
```
POST /api/v1/posts/core/repost/{postId}
Authorization: Bearer <token>
```
**Response:** 201 + PostDto

---

## 4. Likes (auth required)

### Like Post
```
POST /api/v1/posts/likes/{postId}
Authorization: Bearer <token>
```
**Response:** 204

### Unlike Post
```
DELETE /api/v1/posts/likes/{postId}
Authorization: Bearer <token>
```
**Response:** 204

---

## 5. Comments (auth required)

### Create Comment
```
POST /api/v1/posts/comments/posts/{postId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Comment text",
  "parentId": null
}
```
For replies: set `parentId` to the parent comment ID.

**Response:** 201 + CommentDto

### Get Comments for Post
```
GET /api/v1/posts/comments/posts/{postId}
Authorization: Bearer <token>
```
**Response:** 200 + List<CommentDto>

### Get Single Comment
```
GET /api/v1/posts/comments/{commentId}
Authorization: Bearer <token>
```
**Response:** 200 + CommentDto

### Delete Comment
```
DELETE /api/v1/posts/comments/{commentId}
Authorization: Bearer <token>
```
**Response:** 204

---

## 6. Connections (auth required)

### First Degree Connections
```
GET /api/v1/connections/core/{userId}/first-degree
GET /api/v1/connections/core/{userId}/connections
Authorization: Bearer <token>
```
**Response:** 200 + List<Person> (userId, name)

### Send Connection Request
```
POST /api/v1/connections/request/{receiverId}
Authorization: Bearer <token>
```
**Response:** 200 + ConnectionRequestDto

### Accept Connection Request
```
POST /api/v1/connections/accept/{requestId}
Authorization: Bearer <token>
```
**Response:** 200 + ConnectionRequestDto

### Reject Connection Request
```
POST /api/v1/connections/reject/{requestId}
Authorization: Bearer <token>
```
**Response:** 200 + ConnectionRequestDto

### Remove Connection
```
DELETE /api/v1/connections/remove/{userId}
Authorization: Bearer <token>
```
**Response:** 204

### Get Received Requests
```
GET /api/v1/connections/requests/received
Authorization: Bearer <token>
```
**Response:** 200 + List<ConnectionRequestDto>

### Get Sent Requests
```
GET /api/v1/connections/requests/sent
Authorization: Bearer <token>
```
**Response:** 200 + List<ConnectionRequestDto>

### Ping (health check, no auth)
```
GET /api/v1/connections/ping
```
**Response:** 200 + "connection-service ok"

---

## 7. Swagger UI (via Gateway)

| Service | URL |
|---------|-----|
| User | http://localhost:8080/api/v1/users/swagger-ui.html |
| Post | http://localhost:8080/api/v1/posts/swagger-ui.html |
| Connection | http://localhost:8080/api/v1/connections/swagger-ui.html |

---

## Frontend Setup

1. **Base URL:** `http://localhost:8080/api/v1`
2. **Login flow:** Call `POST /users/auth/login` → store JWT (localStorage/sessionStorage)
3. **Protected requests:** Add `Authorization: Bearer ${token}` header
4. **CORS:** Gateway allows origins: localhost:3000, 5173, 4200 (React, Vite, Angular dev servers)

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad request (validation, business rule) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 500 | Server error |
