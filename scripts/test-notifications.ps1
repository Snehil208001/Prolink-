# Test ProLink Notifications Flow
# Requires: API Gateway (8080), User Service, Notification Service, Frontend (5173)

$baseUrl = "http://localhost:8080/api/v1"
$ErrorActionPreference = "Stop"

Write-Host "`n=== ProLink Notifications Test ===" -ForegroundColor Cyan

# 1. Check gateway
Write-Host "`n1. Checking API Gateway..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/users/auth/login" -Method POST -ContentType "application/json" `
        -Body '{"email":"test@test.com","password":"test123"}' -UseBasicParsing -TimeoutSec 5
    Write-Host "   Gateway: OK" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   Gateway: OK (reachable)" -ForegroundColor Green
    } else {
        Write-Host "   Gateway: FAIL - $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 2. Signup then Login
$testEmail = "test-notif-$(Get-Random -Maximum 99999)@prolink.test"
$testPass = "TestPass123!"
Write-Host "`n2. Signing up test user ($testEmail)..." -ForegroundColor Yellow
try {
    $signupBody = @{name="Test User"; email=$testEmail; password=$testPass} | ConvertTo-Json
    $null = Invoke-RestMethod -Uri "$baseUrl/users/auth/signup" -Method POST -ContentType "application/json" `
        -Body $signupBody -TimeoutSec 5
    Write-Host "   Signup: OK" -ForegroundColor Green
} catch {
    Write-Host "   Signup: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n3. Logging in..." -ForegroundColor Yellow
$loginBody = @{email=$testEmail; password=$testPass} | ConvertTo-Json
try {
    $loginResp = Invoke-RestMethod -Uri "$baseUrl/users/auth/login" -Method POST -ContentType "application/json" `
        -Body $loginBody -TimeoutSec 5
    $token = if ($loginResp -is [string]) { $loginResp } else { $loginResp.token }
    Write-Host "   Login: OK (got token)" -ForegroundColor Green
} catch {
    Write-Host "   Login: FAIL - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Ensure user-service is running and DB has users." -ForegroundColor Gray
    exit 1
}

# 4. Fetch notifications
Write-Host "`n4. Fetching notifications..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
try {
    $notifs = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method GET -Headers $headers -TimeoutSec 5
    Write-Host "   Notifications: OK" -ForegroundColor Green
    $count = if ($notifs -is [array]) { $notifs.Count } else { 0 }
    Write-Host "   Count: $count" -ForegroundColor Gray
} catch {
    Write-Host "   Notifications: FAIL - $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $body = $reader.ReadToEnd()
        Write-Host "   Response: $body" -ForegroundColor Gray
    }
    exit 1
}

# 4. Fetch unread count
Write-Host "`n4. Fetching unread count..." -ForegroundColor Yellow
try {
    $count = Invoke-RestMethod -Uri "$baseUrl/notifications/unread-count" -Method GET -Headers $headers -TimeoutSec 5
    Write-Host "   Unread count: $count" -ForegroundColor Green
} catch {
    Write-Host "   Unread count: FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Check frontend
Write-Host "`n6. Checking frontend..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Frontend: OK ($($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   Frontend: FAIL - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "Open http://localhost:5173 and log in to view notifications." -ForegroundColor Gray
