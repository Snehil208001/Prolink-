# Neo4j Setup for Connection Service

The First Degree endpoint requires Neo4j with connection graph data.

## 1. Install & Start Neo4j

- **Neo4j Desktop**: Download from https://neo4j.com/download/
- **Neo4j Community**: Or use Docker: `docker run -p 7687:7687 -p 7474:7474 neo4j`

## 2. Create a Database

- Default credentials: `neo4j` / `password`
- Default Bolt port: **7687** (Neo4j Community) or **7690** (Neo4j Desktop)

## 3. Configure Port

Edit `backend/connection-service/connection-service/src/main/resources/application.properties`:

```properties
# Use 7687 for Neo4j Community, 7690 for Neo4j Desktop
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=password
```

## 4. Create Sample Graph Data

Run in Neo4j Browser (http://localhost:7474):

```cypher
CREATE (p1:Person {userId: 1, name: "User 1"})
CREATE (p2:Person {userId: 2, name: "User 2"})
CREATE (p3:Person {userId: 3, name: "User 3"})
CREATE (p1)-[:CONNECTED_TO]->(p2)
CREATE (p1)-[:CONNECTED_TO]->(p3);
```

## 5. Restart Connection Service

Restart the connection-service after Neo4j is running.
