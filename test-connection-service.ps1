# Connection Service API Test Script
# Tests via API Gateway (localhost:8080) with JWT and direct service (localhost:9030) with X-User-Id
# Prerequisites: Discovery, Gateway, User-Service, Connection-Service, PostgreSQL, Neo4j
# Credentials: snehil123@gmail.com / pass
# Gateway sets X-User-Id from JWT for all downstream services (connection, post, user)

$gatewayBase = "http://localhost:8080/api/v1"
$connectionDirect = "http://localhost:9030/connections"

$results = @()

function Test-Endpoint {
    param($Name, $Method, $Uri, $Body, $ExpectedStatus, $Headers = @{}, [switch]$Direct)
    $fullUri = if ($Direct) { $Uri } else { "$gatewayBase/connections$Uri" }
    try {
        $params = @{
            Uri = $fullUri
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
            UseBasicParsing = $true
        }
        if ($Body) { $params.Body = $Body }
        if ($Headers.Count -gt 0) { $params.Headers = $Headers }
        $r = Invoke-WebRequest @params
        $actual = $r.StatusCode
        $responseBody = $r.Content
    } catch {
        $actual = $_.Exception.Response.StatusCode.value__
        $responseBody = ""
        try {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
        } catch {}
    }
    $pass = ($actual -eq $ExpectedStatus)
    $status = if ($pass) { "PASS" } else { "FAIL" }
    Write-Host "$Name : Expected $ExpectedStatus, Got $actual - $status"
    return @{ Name = $Name; Expected = $ExpectedStatus; Actual = $actual; Pass = $pass; Response = $responseBody }
}

Write-Host "`n=== Connection Service API Tests ===`n"

# Step 1: Login
Write-Host "--- Login ---"
$loginBody = '{"email":"snehil123@gmail.com","password":"pass"}'
try {
    $loginResp = Invoke-RestMethod -Uri "$gatewayBase/users/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = if ($loginResp -is [string]) { $loginResp.Trim('"') } else { $loginResp.ToString() }
    $authHeaders = @{ "Authorization" = "Bearer $token" }
    Write-Host "Login : 200 - JWT obtained" -ForegroundColor Green
} catch {
    Write-Host "Login FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $authHeaders = @{}
}

# Direct service header (X-User-Id for when bypassing gateway)
$directHeaders = @{ "X-User-Id" = "1" }

Write-Host "`n--- 1. Ping (no auth, direct) ---"
$r = Test-Endpoint -Name "Ping" -Method GET -Uri "http://localhost:9030/connections/ping" -ExpectedStatus 200 -Direct
$results += $r

Write-Host "`n--- 2. Connection Actions ---"
Write-Host "    (Testing via Gateway with JWT and Direct with X-User-Id)" -ForegroundColor Gray

# Use gateway for auth endpoints; fallback: direct with X-User-Id from JWT
# Extract userId from JWT (base64 payload) - simplified: use 1 as default for direct tests
$directAuthHeaders = @{ "X-User-Id" = "1" }

# Test via direct service (localhost:9030) with X-User-Id - connection-service works when header is passed
# Gateway may return 500 if X-User-Id is not forwarded correctly to connection-service

# Get received requests
$r = Test-Endpoint -Name "Get Received Requests" -Method GET -Uri "http://localhost:9030/connections/requests/received" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
$results += $r

# Get sent requests
$r = Test-Endpoint -Name "Get Sent Requests" -Method GET -Uri "http://localhost:9030/connections/requests/sent" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
$results += $r

# Send connection request (to user 2) - 200 new, 400 if already sent/connected
$r = Test-Endpoint -Name "Send Request (to user 2)" -Method POST -Uri "http://localhost:9030/connections/request/2" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
if (-not $r.Pass -and $r.Actual -eq 400) { $r.Pass = $true; $r.Name = "Send Request (to user 2) [400=already exists]" }
$results += $r

# Send request to self (should fail 400)
$r = Test-Endpoint -Name "Send Request to self (validation)" -Method POST -Uri "http://localhost:9030/connections/request/1" -ExpectedStatus 400 -Headers $directAuthHeaders -Direct
$results += $r

# Get sent again (should show the request we sent)
$r = Test-Endpoint -Name "Get Sent Requests (after send)" -Method GET -Uri "http://localhost:9030/connections/requests/sent" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
$results += $r

# First degree connections
$r = Test-Endpoint -Name "First Degree Connections" -Method GET -Uri "http://localhost:9030/connections/core/1/first-degree" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
$results += $r

# Accept request (200 if user 1 is receiver, 400 if not - both valid)
$r = Test-Endpoint -Name "Accept Request (id=1)" -Method POST -Uri "http://localhost:9030/connections/accept/1" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
if (-not $r.Pass -and $r.Actual -eq 400) { $r.Pass = $true; $r.Name = "Accept Request (id=1) [400=not receiver]" }
$results += $r

# Reject request (200 if user 1 is receiver, 400 if not - both valid)
$r = Test-Endpoint -Name "Reject Request (id=2)" -Method POST -Uri "http://localhost:9030/connections/reject/2" -ExpectedStatus 200 -Headers $directAuthHeaders -Direct
if (-not $r.Pass -and $r.Actual -eq 400) { $r.Pass = $true; $r.Name = "Reject Request (id=2) [400=not receiver]" }
$results += $r

# Remove connection (204 if connected, 400 if not - both valid)
$r = Test-Endpoint -Name "Remove Connection (user 2)" -Method DELETE -Uri "http://localhost:9030/connections/remove/2" -ExpectedStatus 204 -Headers $directAuthHeaders -Direct
if (-not $r.Pass -and $r.Actual -eq 400) { $r.Pass = $true; $r.Name = "Remove Connection (user 2) [400=no connection]" }
$results += $r

# No auth - should get 401
Write-Host "`n--- 3. Validation (no auth) ---"
$r = Test-Endpoint -Name "Send Request without auth" -Method POST -Uri "/request/2" -ExpectedStatus 401
$results += $r

# Gateway tests - X-User-Id from JWT (gateway forwards to connection-service)
Write-Host "`n--- 4. Gateway Tests (X-User-Id from JWT) ---"
if ($authHeaders.Count -gt 0) {
    $r = Test-Endpoint -Name "[Gateway] Get Received Requests" -Method GET -Uri "/requests/received" -ExpectedStatus 200 -Headers $authHeaders
    $results += $r
    $r = Test-Endpoint -Name "[Gateway] Get Sent Requests" -Method GET -Uri "/requests/sent" -ExpectedStatus 200 -Headers $authHeaders
    $results += $r
    $r = Test-Endpoint -Name "[Gateway] Ping" -Method GET -Uri "/ping" -ExpectedStatus 200 -Headers $authHeaders
    $results += $r
    # Send request via gateway - 200 or 400 (already exists)
    $r = Test-Endpoint -Name "[Gateway] Send Request (to user 2)" -Method POST -Uri "/request/2" -ExpectedStatus 200 -Headers $authHeaders
    if (-not $r.Pass -and $r.Actual -eq 400) { $r.Pass = $true; $r.Name = "[Gateway] Send Request (to user 2) [400=already exists]" }
    $results += $r
} else {
    Write-Host "Skipping gateway tests - no JWT (login failed)" -ForegroundColor Yellow
}

$passed = ($results | Where-Object { $_.Pass }).Count
$total = $results.Count
Write-Host "`n=== Summary: $passed / $total passed ===" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host "Credentials: snehil123@gmail.com / pass"

# Export results for report
$results | ConvertTo-Json -Depth 3 | Out-File -FilePath "connection-test-results.json" -Encoding utf8
