@echo off
REM Run chat-service tests with reduced memory
set MAVEN_OPTS=-Xmx512m -XX:MaxMetaspaceSize=192m
call mvn test
