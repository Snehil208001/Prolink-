# ProLink

<p align="center">
  <strong>Connect. Collaborate. Converse.</strong>
</p>

<p align="center">
  A full-stack professional networking platform inspired by LinkedIn — built with microservices, event-driven architecture, and real-time messaging.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat&logo=springboot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Neo4j-5-008CC1?style=flat&logo=neo4j" alt="Neo4j" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Kafka-Apache-231F20?style=flat&logo=apachekafka" alt="Kafka" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker" alt="Docker" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api">API</a>
</p>

---

## Features

| Area | Capabilities |
|------|--------------|
| **Feed** | Create posts, like, comment, repost — with infinite scroll and optimistic updates |
| **Network** | Connect with professionals; send/accept connection requests; graph-based recommendations (Neo4j) |
| **Messaging** | Real-time chat over WebSocket (STOMP); unread badges; browser notifications |
| **Profile** | Showcase experience, skills, and connection count |
| **Auth** | JWT-based authentication with secure session handling |

---

## Architecture

ProLink follows a **microservices architecture** with service discovery, API gateway, and event-driven communication.

```
                          ┌─────────────────┐
                          │  React SPA      │
                          │  (Vite, Ant D)  │
                          └────────┬────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway (Spring Cloud)                               │
│                    Routing • JWT Auth • Load Balancing • CORS                      │
└──────────────────────────────────────────────────────────────────────────────────┘
     │              │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  User   │   │  Post   │   │Connection│   │  Chat   │   │ Notif.  │   │ Eureka  │
│ Service │   │ Service │   │ Service  │   │ Service │   │ Service │   │Discovery│
│(Postgres)│   │(Postgres│   │(Neo4j + │   │(MongoDB)│   │(Postgres│   │         │
│         │   │ +Kafka) │   │ Postgres│   │+WebSocket│   │ +Kafka) │   │         │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Apache Kafka   │
                          │  Event Stream   │
                          └─────────────────┘
```

**Key design decisions:**

- **API Gateway** — Centralized routing, load balancing, JWT validation
- **Eureka** — Service discovery for dynamic scaling
- **Kafka** — Event streaming for post-created, post-liked, connection events
- **Neo4j** — Graph database for connection network and recommendations
- **MongoDB** — Document store for chat conversations

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 8, Ant Design 6, TanStack Query, Axios, React Router 7 |
| **Backend** | Spring Boot 3.5, Java 21, Spring Cloud Gateway, Eureka |
| **Databases** | PostgreSQL (user, post, connection, notification), Neo4j (graph), MongoDB (chat) |
| **Messaging** | Apache Kafka (event streaming), WebSocket/STOMP (real-time chat) |
| **Infrastructure** | Docker, Docker Compose, AWS (EC2, EFS, Transfer Family) |

---

## Project Structure

```
ProLinkApp/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── api/                # Axios client, API modules
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/          # Auth, notifications
│   │   └── pages/              # Feed, Profile, Network, Chat
│   └── Dockerfile
│
├── backend/
│   ├── api-gateway/            # Spring Cloud Gateway, JWT filter
│   ├── discovery-server/       # Eureka
│   ├── user-service/           # Auth, profiles (PostgreSQL)
│   ├── post-service/           # Posts, likes, comments (PostgreSQL, Kafka)
│   ├── connection-service/     # Connections, graph (Neo4j, PostgreSQL, Kafka)
│   ├── notification-service/   # Notifications (PostgreSQL, Kafka)
│   └── chat-service/           # Real-time chat (MongoDB, Kafka)
│
├── docker-compose.yml          # Full stack orchestration
├── model/                      # Architecture, environments, decisions
├── operations/                 # Runbooks, onboarding, sanity checks
└── DOCKER.md                   # Docker setup guide
```

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services (PostgreSQL, Neo4j, Kafka, MongoDB, microservices, frontend)
docker compose up -d

# Access
# Frontend:    http://localhost
# API Gateway: http://localhost:8080
# Eureka:      http://localhost:8761
```

### Option 2: Local Development

**Prerequisites:** Node.js 20+, Java 21, Maven, PostgreSQL, Neo4j, Kafka, MongoDB

1. **Discovery & Gateway**
   ```bash
   cd backend/discovery-server && mvn spring-boot:run
   cd backend/api-gateway && mvn spring-boot:run
   ```

2. **Microservices** (in separate terminals)
   ```bash
   cd backend/user-service && mvn spring-boot:run
   cd backend/post-service && mvn spring-boot:run
   cd backend/connection-service && mvn spring-boot:run
   cd backend/notification-service && mvn spring-boot:run
   cd backend/chat-service && mvn spring-boot:run
   ```

3. **Frontend**
   ```bash
   cd frontend && npm install && npm run dev
   ```

4. Open **http://localhost:5173**

---

## API

| Base | URL |
|------|-----|
| Gateway | `http://localhost:8080` |
| API prefix | `/api/v1` |
| Auth | `Authorization: Bearer <token>` |

| Service | Path | Description |
|---------|------|-------------|
| User | `/api/v1/users` | Auth, profiles |
| Post | `/api/v1/posts` | CRUD, likes, comments |
| Connection | `/api/v1/connections` | Send/accept, recommendations |
| Chat | `/api/v1/chat` | Conversations, messages |
| Notification | `/api/v1/notifications` | Activity notifications |

Swagger UI is available at each service's `/swagger-ui.html` (routed via gateway).

---

## License

MIT
