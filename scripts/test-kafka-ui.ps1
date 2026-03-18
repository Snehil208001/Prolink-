# Test Kafka UI at http://localhost:8090
Write-Host "`n=== Kafka UI Test (port 8090) ===" -ForegroundColor Cyan

# Check if port is listening
$listening = netstat -ano | findstr ":8090.*LISTENING"
if (-not $listening) {
    Write-Host "[FAIL] Port 8090 not listening. Start Kafka UI: .\scripts\start-kafka-ui.bat" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Port 8090 is listening" -ForegroundColor Green

# Server responds (501 is common for Kafbat UI root - it's a SPA)
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8090/" -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] Server responds: HTTP $($r.StatusCode)" -ForegroundColor Green
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 501) {
        Write-Host "[OK] Server responds: HTTP 501 (Kafbat UI may return this for script requests)" -ForegroundColor Green
    } else {
        Write-Host "[??] Server response: HTTP $code" -ForegroundColor Yellow
    }
}

Write-Host "`nOpening http://localhost:8090 in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:8090"
Write-Host "Done. Check your browser." -ForegroundColor Green
