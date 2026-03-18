# ProLink Services – Startup Order & Testing

## Prerequisites

- **PostgreSQL** running on `localhost:5432` with databases: `userDb`, `postDb`, `connectionDb`, `notificationDb`
  - Create `notificationDb` if needed: `CREATE DATABASE notificationDb;`
- **MongoDB** (Atlas or local) for chat-service
- **Neo4j** running on `localhost:7690` for connection-service
- **Kafka** running locally (for post-service, connection-service, notification-service)
- **Kafka UI** (optional) – if used, run on port **8090** to avoid conflict with API Gateway (8080). Example: `java -Dserver.port=8090 -jar kafbat-ui.jar`

## Startup Order

Start services in this order (each in a separate terminal):

| # | Service           | Port | Command |
|---|-------------------|------|---------|
| 1 | discovery-server  | 8761 | `cd backend/discovery-server && mvn spring-boot:run` |
| 2 | api-gateway        | 8080 | `cd backend/api-gateway && mvn spring-boot:run` |
| 3 | user-service       | 9020 | `cd backend/user-service && mvn spring-boot:run` |
| 4 | post-service       | 9010 | `cd backend/post-service && mvn spring-boot:run` |
| 5 | connection-service | 9030 | `cd backend/connection-service && mvn spring-boot:run` |
| 6 | chat-service       | 9040 | `cd backend/chat-service && mvn spring-boot:run` |
| 7 | notification-service | 9050 | `cd backend/notification-service && mvn spring-boot:run` |

## Why This Order?

1. **discovery-server** – Eureka; all other services register here.
2. **api-gateway** – Routes traffic; depends on Eureka for service discovery.
3. **user-service** – Auth and users; gateway routes `/api/v1/users/**` here.
4. **post-service** – Posts; gateway routes `/api/v1/posts/**` here.
5. **connection-service** – Connections; gateway routes `/api/v1/connections/**` here.
6. **chat-service** – Chat; gateway routes `/api/v1/chat/**` here.
7. **notification-service** – Notifications; gateway routes `/api/v1/notifications/**` here.

## Quick Health Checks

After all services are up:

| Service           | Health URL |
|-------------------|------------|
| discovery-server  | http://localhost:8761 |
| api-gateway       | http://localhost:8080/actuator/health |
| user-service      | http://localhost:9020/users/actuator/health |
| post-service      | http://localhost:9010/posts/actuator/health |
| connection-service| http://localhost:9030/connections/actuator/health |
| chat-service      | http://localhost:9040/chat/actuator/health |
| notification-service | http://localhost:9050/notifications/actuator/health |

## Via Gateway (recommended)

- Auth: `http://localhost:8080/api/v1/users/auth/**`
- Users: `http://localhost:8080/api/v1/users/**`
- Posts: `http://localhost:8080/api/v1/posts/**`
- Connections: `http://localhost:8080/api/v1/connections/**`
- Chat: `http://localhost:8080/api/v1/chat/**`
- Notifications: `http://localhost:8080/api/v1/notifications/**`

## Run All Services (PowerShell)

From project root:

```powershell
.\scripts\start-all-services.ps1
```

Or run the script’s commands manually in separate terminals.

## Troubleshooting

### Chat-service: MongoDB Atlas SSL `internal_error`

If chat-service fails with `javax.net.ssl.SSLException: (internal_error) Received fatal alert: internal_error` when connecting to MongoDB Atlas:

1. **Use Java 21** – The project targets Java 21. Java 24 can have TLS compatibility issues with MongoDB Atlas. In IntelliJ: **File → Project Structure → Project** → set **SDK** to Java 21.
2. **Maven runs** – The chat-service `pom.xml` already includes a JVM workaround for `mvn spring-boot:run`.
3. **IntelliJ run** – Add VM option: `-Djdk.tls.client.protocols=TLSv1.2,TLSv1.3` in **Run → Edit Configurations → ChatServiceApplication → VM options**.
4. **MongoDB Atlas** – Ensure your IP is in **Network Access → IP Access List** (allow `0.0.0.0/0` if needed for testing).
