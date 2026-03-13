@echo off
REM Run chat-service tests with reduced memory
set MAVEN_OPTS=-Xmx512m -XX:MaxMetaspaceSize=192m
cd chat-service
call mvn test
cd ..
