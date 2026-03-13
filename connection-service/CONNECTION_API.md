# Connection Service API

## Connection Actions (PostgreSQL + Neo4j)

Connection requests are stored in PostgreSQL. Accepted connections create relationships in Neo4j.

### Endpoints (via API Gateway: `GET/POST/DELETE /api/v1/connections/...`)

| Method | Path | Description |
|-------|------|-------------|
| POST | `/request/{receiverId}` | Send connection request to user |
| POST | `/accept/{requestId}` | Accept a pending request (receiver only) |
| POST | `/reject/{requestId}` | Reject a pending request (receiver only) |
| DELETE | `/remove/{userId}` | Remove connection with user |
| GET | `/requests/received` | List pending requests received |
| GET | `/requests/sent` | List pending requests sent |

### First-Degree Connections (existing)

| Method | Path | Description |
|-------|------|-------------|
| GET | `/core/{userId}/first-degree` | Get first-degree connections from Neo4j |

### Setup

1. **PostgreSQL**: Create database `connectionDb`:
   ```sql
   CREATE DATABASE connectionDb;
   ```
   Tables (`connection_requests`) are created automatically via Hibernate `ddl-auto=update`.

2. **Neo4j**: Ensure Neo4j is running (port 7690 per `application.properties`).

3. **Authentication**: All endpoints require `X-User-Id` header (set by API Gateway from JWT).
