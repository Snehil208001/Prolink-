# ProLink - Start all backend services in order
# Run from project root: .\scripts\start-all-services.ps1
# Each service runs in a new window. Wait for each to be ready before the next starts.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$root\backend")) { $root = (Get-Location).Path }

$services = @(
    @{ Name = "discovery-server";  Path = "backend\discovery-server";  Port = 8761 },
    @{ Name = "api-gateway";       Path = "backend\api-gateway";       Port = 8080 },
    @{ Name = "user-service";     Path = "backend\user-service";     Port = 9020 },
    @{ Name = "post-service";     Path = "backend\post-service";     Port = 9010 },
    @{ Name = "connection-service"; Path = "backend\connection-service"; Port = 9030 },
    @{ Name = "chat-service";     Path = "backend\chat-service";     Port = 9040 },
    @{ Name = "notification-service"; Path = "backend\notification-service"; Port = 9050 }
)

foreach ($svc in $services) {
    $fullPath = Join-Path $root $svc.Path
    if (-not (Test-Path $fullPath)) {
        Write-Warning "Skipping $($svc.Name): path not found: $fullPath"
        continue
    }
    Write-Host "Starting $($svc.Name) on port $($svc.Port)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; mvn spring-boot:run"
    Start-Sleep -Seconds 15
}

Write-Host "`nAll services launched. Check RUN_SERVICES.md for health URLs." -ForegroundColor Green
