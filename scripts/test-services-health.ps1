# ProLink - Test all services are running
# Run from project root: .\scripts\test-services-health.ps1

$checks = @(
    @{ Name = "discovery-server";     Url = "http://localhost:8761";           Path = "" },
    @{ Name = "api-gateway";           Url = "http://localhost:8080/actuator/health"; Path = "" },
    @{ Name = "user-service";         Url = "http://localhost:9020/users/actuator/health"; Path = "" },
    @{ Name = "post-service";         Url = "http://localhost:9010/posts/actuator/health"; Path = "" },
    @{ Name = "connection-service";   Url = "http://localhost:9030/connections/actuator/health"; Path = "" },
    @{ Name = "chat-service";         Url = "http://localhost:9040/chat/actuator/health"; Path = "" },
    @{ Name = "notification-service"; Url = "http://localhost:9050/notifications/actuator/health"; Path = "" }
)

$ok = 0
$fail = 0

foreach ($c in $checks) {
    try {
        $r = Invoke-WebRequest -Uri $c.Url -UseBasicParsing -TimeoutSec 5
        if ($r.StatusCode -eq 200) {
            Write-Host "[OK]  $($c.Name)" -ForegroundColor Green
            $ok++
        } else {
            Write-Host "[??]  $($c.Name) - HTTP $($r.StatusCode)" -ForegroundColor Yellow
            $fail++
        }
    } catch {
        Write-Host "[FAIL] $($c.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $fail++
    }
}

Write-Host "`nResult: $ok OK, $fail failed" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
