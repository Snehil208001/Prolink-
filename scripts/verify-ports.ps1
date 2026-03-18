# Verify ProLink ports - API Gateway (8080) and Kafka UI (8090)
Write-Host "`n=== ProLink Port Check ===" -ForegroundColor Cyan

$checks = @(
    @{ Port = 8080; Service = "API Gateway"; Url = "http://localhost:8080/actuator/health" },
    @{ Port = 8090; Service = "Kafka UI";    Url = "http://localhost:8090/clusters" }
)

foreach ($c in $checks) {
    $listening = netstat -ano | findstr ":$($c.Port).*LISTENING"
    if ($listening) {
        Write-Host "[OK] Port $($c.Port) - $($c.Service) is running" -ForegroundColor Green
    } else {
        Write-Host "[--] Port $($c.Port) - $($c.Service) not listening" -ForegroundColor Yellow
    }
}

# Quick API test
Write-Host "`n=== API Gateway Test ===" -ForegroundColor Cyan
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] API Gateway responds: $($r.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] API Gateway: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
