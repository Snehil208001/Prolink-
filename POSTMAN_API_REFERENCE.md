# ProLink API – Postman Reference

**Base URL:** `http://localhost:8080/api/v1`

**Auth:** For protected endpoints, add header: `Authorization: Bearer <token>`

---

## Swagger UI

| Service | Swagger URL (via Gateway) |
|---------|---------------------------|
| User Service | http://localhost:8080/api/v1/users/swagger-ui.html |
| Post Service | http://localhost:8080/api/v1/posts/swagger-ui.html |
| Connection Service | http://localhost:8080/api/v1/connections/swagger-ui.html |

Use **Authorize** in Swagger UI to add your JWT (from Login) for protected endpoints.

---

## 1. Auth (no token)

### Signup
- **URL:** `POST http://localhost:8080/api/v1/users/auth/signup`
- **Body (raw JSON):**
```json
{
  "name": "TestUser",
  "email": "test@mail.com",
  "password": "pass123"
}
```

### Login
- **URL:** `POST http://localhost:8080/api/v1/users/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "snehil123@gmail.com",
  "password": "pass"
}
```
→ Copy the JWT from the response for protected endpoints.

---

## 2. User (auth required)

### Get Profile
- **URL:** `GET http://localhost:8080/api/v1/users/profile`
- **Body:** None

### Admin – Get All Users
- **URL:** `GET http://localhost:8080/api/v1/users/admin/users`
- **Body:** None

---

## 3. Posts (auth required)

### Create Post
- **URL:** `POST http://localhost:8080/api/v1/posts/core`
- **Body (raw JSON):**
```json
{
  "content": "My first post!"
}
```

### Get Post
- **URL:** `GET http://localhost:8080/api/v1/posts/core/1`
- **Body:** None

### Get All Posts of User
- **URL:** `GET http://localhost:8080/api/v1/posts/core/users/1/allPosts`
- **Body:** None

### Repost (with optional quote)
- **URL:** `POST http://localhost:8080/api/v1/posts/core/repost`
- **Body (raw JSON):**
```json
{
  "originalPostId": 1,
  "quoteText": "Great post! Here's my take..."
}
```
Omit `quoteText` or set to `null` for a simple repost.

### Simple Repost (no body)
- **URL:** `POST http://localhost:8080/api/v1/posts/core/repost/1`
- **Body:** None

---

## 4. Likes (auth required)

### Like Post
- **URL:** `POST http://localhost:8080/api/v1/posts/likes/1`
- **Body:** None

### Unlike Post
- **URL:** `DELETE http://localhost:8080/api/v1/posts/likes/1`
- **Body:** None

---

## 5. Comments (auth required)

### Create Comment (top-level)
- **URL:** `POST http://localhost:8080/api/v1/posts/comments/posts/1`
- **Body (raw JSON):**
```json
{
  "content": "Nice post!",
  "parentId": null
}
```

### Create Reply (nested comment)
- **URL:** `POST http://localhost:8080/api/v1/posts/comments/posts/1`
- **Body (raw JSON):**
```json
{
  "content": "I agree with you!",
  "parentId": 5
}
```
`parentId` = ID of the comment you're replying to.

### Get Comments for Post
- **URL:** `GET http://localhost:8080/api/v1/posts/comments/posts/1`
- **Body:** None

### Get Single Comment
- **URL:** `GET http://localhost:8080/api/v1/posts/comments/1`
- **Body:** None

### Delete Comment
- **URL:** `DELETE http://localhost:8080/api/v1/posts/comments/1`
- **Body:** None

---

## 6. Connections (auth required)

### First Degree Connections
- **URL:** `GET http://localhost:8080/api/v1/connections/core/1/first-degree`
- **Body:** None

---

## Postman Setup

1. Create environment variable `baseUrl` = `http://localhost:8080/api/v1`
2. Login → copy JWT
3. Create header `Authorization` = `Bearer {{token}}` (or paste JWT)
4. Use `{{baseUrl}}/users/auth/login` etc. for URLs
