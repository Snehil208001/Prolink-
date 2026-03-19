# ProLink Docker Setup

## Quick Start

```bash
docker compose up -d
```

This starts all services. Access:

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Neo4j Browser**: http://localhost:7474

## Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 80 | React app (nginx) |
| api-gateway | 8080 | API Gateway |
| discovery-server | 8761 | Eureka |
| user-service | 9020 | User/auth |
| post-service | 9010 | Posts |
| connection-service | 9030 | Connections (Neo4j) |
| chat-service | 9040 | Chat |
| notification-service | 9050 | Notifications |
| postgres | 5432 | PostgreSQL |
| neo4j | 7474, 7687 | Neo4j |
| kafka | 9092 | Kafka |
| mongodb | 27017 | MongoDB |

## Build

```bash
docker compose build
```

## MongoDB Atlas

To use MongoDB Atlas instead of the local container, set:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prolink_chat
```

in the `chat-service` section of `docker-compose.yml`, or use an env file.
