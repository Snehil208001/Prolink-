# Running ProLink Services

## Start order

1. **Discovery Server (Eureka)** – port 8761  
2. **API Gateway** – port 8080  
3. **User Service** – port 9010  
4. **Post Service** – port 9020  
5. **Connection Service** – port 9030  
6. **Chat Service** – port 9040  

## Chat Service

### 1. Set MongoDB password

Edit `backend/chat-service/src/main/resources/application.properties` and replace `YOUR_PASSWORD` with your MongoDB Atlas password.

Or set the environment variable:

```bash
set MONGODB_URI=mongodb+srv://snehil7542:YOUR_PASSWORD@prolink.cngjpxa.mongodb.net/prolink_chat?retryWrites=true&w=majority&appName=ProLink
```

### 2. Run chat service

```bash
cd backend/chat-service
mvn spring-boot:run
```

### 3. Run tests

```bash
cd backend/chat-service
mvn test
```

If you see memory errors, try:

```bash
set MAVEN_OPTS=-Xmx512m -XX:MaxMetaspaceSize=192m
mvn test
```
