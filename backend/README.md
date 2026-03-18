# ProLink Backend Services

Microservices for the ProLink platform.

## Services

| Service | Port | Description |
|---------|------|-------------|
| discovery-server | 8761 | Eureka service discovery |
| api-gateway | 8080 | API Gateway (routes, auth) |
| user-service | 9020 | Users, auth, profiles |
| post-service | 9010 | Posts, comments, likes |
| connection-service | 9030 | Connections, Neo4j graph |
| chat-service | 9040 | Chat, WebSocket, MongoDB |
| notification-service | 9050 | Notifications, Kafka |

## Start Order

1. discovery-server
2. api-gateway
3. user-service
4. post-service
5. connection-service
6. chat-service
7. notification-service

## Running Services

From project root:

```powershell
.\scripts\start-all-services.ps1
```

Or manually (each in a separate terminal):

```powershell
cd backend/discovery-server; mvn spring-boot:run
cd backend/api-gateway; mvn spring-boot:run
cd backend/user-service; mvn spring-boot:run
cd backend/post-service; mvn spring-boot:run
cd backend/connection-service; mvn spring-boot:run
cd backend/chat-service; mvn spring-boot:run
cd backend/notification-service; mvn spring-boot:run
```

## Test All Services

```powershell
.\scripts\test-services-health.ps1
```

See `RUN_SERVICES.md` for prerequisites (PostgreSQL, MongoDB, Neo4j, Kafka) and health URLs.
