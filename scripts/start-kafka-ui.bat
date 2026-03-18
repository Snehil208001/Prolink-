@echo off
REM Kafka UI on port 8090 (avoids conflict with API Gateway on 8080)
cd /d C:\kafka_2.13-4.2.0
java -Dserver.port=8090 -jar api-v1.4.2.jar
pause
