# ProLink

**Connect. Collaborate. Converse.**

A professional social networking platform inspired by LinkedIn, built with a microservices architecture. Create posts, build your network, and chat in real time.

## Features

- **Feed** – Create posts, like, comment, and repost
- **Network** – Connect with professionals, send/accept connection requests
- **Messaging** – Real-time chat with WebSocket, unread badges, browser notifications
- **Profile** – Showcase your experience, skills, and connections
- **Auth** – Sign up, sign in with JWT

## Tech Stack

**Frontend:** React, Vite, Ant Design, React Router  
**Backend:** Spring Boot, Eureka, API Gateway, JWT  
**Services:** User, Post, Connection (Neo4j), Chat (MongoDB, WebSocket)

## Project Structure

```
ProLinkApp/
├── frontend/     # React SPA
├── backend/      # Microservices
│   ├── api-gateway/
│   ├── discovery-server/
│   ├── user-service/
│   ├── post-service/
│   ├── connection-service/
│   └── chat-service/
└── docs/
```

## Quick Start

### Prerequisites

- Node.js 18+
- Java 17+
- Maven
- PostgreSQL (user-service, post-service)
- Neo4j (connection-service)
- MongoDB Atlas (chat-service)

### 1. Backend

Start services in order:

```bash
cd backend/discovery-server/discovery-server && mvn spring-boot:run
cd backend/api-gateway/api-gateway && mvn spring-boot:run
cd backend/user-service/user-service && mvn spring-boot:run
cd backend/post-service/post-service && mvn spring-boot:run
cd backend/connection-service/connection-service && mvn spring-boot:run
cd backend/chat-service/chat-service && mvn spring-boot:run
```

See `backend/README.md` and each service folder for configuration (DB, Neo4j, MongoDB).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. Test

```bash
# API tests (requires backend running)
.\test-api.ps1
```

## API

- **Gateway:** http://localhost:8080
- **Base path:** `/api/v1`
- **Auth:** JWT via `Authorization: Bearer <token>`

See `FRONTEND_API_REFERENCE.md` for endpoints.

## License

MIT
