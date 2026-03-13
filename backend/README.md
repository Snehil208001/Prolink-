# ProLink Backend Services

Microservices for the ProLink platform.

## Services

| Service | Port | Description |
|---------|------|-------------|
| discovery-server | 8761 | Eureka service discovery |
| api-gateway | 8080 | API Gateway (routes, auth) |
| user-service | 9010 | Users, auth, profiles |
| post-service | 9020 | Posts, comments, likes |
| connection-service | 9030 | Connections, Neo4j graph |
| chat-service | 9040 | Chat, WebSocket, MongoDB |

## Start Order

1. discovery-server
2. api-gateway
3. user-service
4. post-service
5. connection-service
6. chat-service

## Running Services

From project root:

```bash
# Discovery
cd backend/discovery-server/discovery-server && mvn spring-boot:run

# Gateway
cd backend/api-gateway/api-gateway && mvn spring-boot:run

# User, Post, Connection, Chat (each in separate terminal)
cd backend/user-service/user-service && mvn spring-boot:run
cd backend/post-service/post-service && mvn spring-boot:run
cd backend/connection-service/connection-service && mvn spring-boot:run
cd backend/chat-service/chat-service && mvn spring-boot:run
```

See each service's folder for setup (MongoDB for chat, Neo4j for connections).
