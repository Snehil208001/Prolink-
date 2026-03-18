# MongoDB Atlas Setup for Chat Service

## 1. Set your connection string

Edit `backend/chat-service/src/main/resources/application.properties` and replace `YOUR_PASSWORD` with your MongoDB Atlas database user password:

```properties
spring.data.mongodb.uri=mongodb+srv://snehil7542:YOUR_ACTUAL_PASSWORD@prolink.cngjpxa.mongodb.net/prolink_chat?retryWrites=true&w=majority&appName=ProLink
```

**Or** set the `MONGODB_URI` environment variable (recommended for production):

```bash
export MONGODB_URI="mongodb+srv://snehil7542:YOUR_PASSWORD@prolink.cngjpxa.mongodb.net/prolink_chat?retryWrites=true&w=majority&appName=ProLink"
```

## 2. Run the chat service

```bash
cd backend/chat-service
mvn spring-boot:run
```

The service will:
- Connect to MongoDB Atlas
- Create `prolink_chat` database and `conversations`, `messages` collections
- Listen on port 9040
- Register with Eureka

## 3. API endpoints (via gateway at port 8080)

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/chat/conversations | List conversations (requires auth) |
| POST | /api/v1/chat/conversations?otherUserId=X | Get or create conversation |
| GET | /api/v1/chat/conversations/{id}/messages | Get messages |
| POST | /api/v1/chat/conversations/{id}/messages | Send message |

## 4. WebSocket (real-time)

Connect to: `ws://localhost:8080/api/v1/chat/ws` (through gateway)

Or directly to chat service: `ws://localhost:9040/chat/ws`

- Subscribe: `/topic/conversations/{conversationId}`
- Send: `/app/chat/{conversationId}` with payload `{ "senderId": 1, "content": "Hello" }`
