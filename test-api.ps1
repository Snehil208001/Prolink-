# ProLink API Test Script - via localhost:8080 (API Gateway)
# Uses login: snehil123@gmail.com / pass
$base = "http://localhost:8080/api/v1"

function Test-Endpoint {
    param($Name, $Method, $Uri, $Body, $ExpectedStatus, $Headers = @{})
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
            UseBasicParsing = $true
        }
        if ($Body) { $params.Body = $Body }
        if ($Headers.Count -gt 0) { $params.Headers = $Headers }
        $r = Invoke-WebRequest @params
        $actual = $r.StatusCode
    } catch {
        $actual = $_.Exception.Response.StatusCode.value__
    }
    $pass = ($actual -eq $ExpectedStatus)
    Write-Host "$Name : Expected $ExpectedStatus, Got $actual - $(if($pass){'PASS'}else{'FAIL'})"
    return $pass
}

Write-Host "`n=== ProLink API Tests (via Gateway :8080) ===`n"

# Step 1: Login to get JWT
Write-Host "--- Login ---"
$loginBody = '{"email":"snehil123@gmail.com","password":"pass"}'
try {
    $loginResp = Invoke-RestMethod -Uri "$base/users/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = if ($loginResp -is [string]) { $loginResp.Trim('"') } else { $loginResp.ToString() }
    $authHeaders = @{ "Authorization" = "Bearer $token" }
    Write-Host "Login : 200 - JWT obtained" -ForegroundColor Green
} catch {
    Write-Host "Login FAILED - Cannot proceed with auth tests. Error: $($_.Exception.Message)" -ForegroundColor Red
    $authHeaders = @{}
}

Write-Host "`n--- Public Endpoints (no auth) ---"

# 2. Signup - empty body -> 400
Test-Endpoint -Name "Signup empty body" -Method POST -Uri "$base/users/auth/signup" -Body '{}' -ExpectedStatus 400 | Out-Null

# 3. Login - empty body -> 400
Test-Endpoint -Name "Login empty body" -Method POST -Uri "$base/users/auth/login" -Body '{}' -ExpectedStatus 400 | Out-Null

Write-Host "`n--- Protected Endpoints (with JWT) ---"

# 4. Create Post
Test-Endpoint -Name "Create Post" -Method POST -Uri "$base/posts/core" -Body '{"content":"Test post"}' -ExpectedStatus 201 -Headers $authHeaders | Out-Null

# 5. Get Profile
Test-Endpoint -Name "Get Profile" -Method GET -Uri "$base/users/profile" -ExpectedStatus 200 -Headers $authHeaders | Out-Null

# 6. Get Post
Test-Endpoint -Name "Get Post" -Method GET -Uri "$base/posts/core/1" -ExpectedStatus 200 -Headers $authHeaders | Out-Null

# 7. Get All Posts of User
Test-Endpoint -Name "Get All Posts" -Method GET -Uri "$base/posts/core/users/1/allPosts" -ExpectedStatus 200 -Headers $authHeaders | Out-Null

# 8. Like post
Test-Endpoint -Name "Like post" -Method POST -Uri "$base/posts/likes/1" -ExpectedStatus 204 -Headers $authHeaders | Out-Null

# 9. Unlike post
Test-Endpoint -Name "Unlike post" -Method DELETE -Uri "$base/posts/likes/1" -ExpectedStatus 204 -Headers $authHeaders | Out-Null

# 10. First Degree connections
Test-Endpoint -Name "First Degree" -Method GET -Uri "$base/connections/core/1/first-degree" -ExpectedStatus 200 -Headers $authHeaders | Out-Null

# 11. Admin - Get All Users (if user is ADMIN)
Test-Endpoint -Name "Admin Get Users" -Method GET -Uri "$base/users/admin/users" -ExpectedStatus 200 -Headers $authHeaders | Out-Null

Write-Host "`n=== Done ==="
Write-Host "Credentials: snehil123@gmail.com / pass"
Write-Host "Update PROLINK_API_TEST_RESULTS.md if any test fails. Report bugs in BUG_REPORT.md"
