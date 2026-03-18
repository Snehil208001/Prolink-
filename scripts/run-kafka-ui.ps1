# Run Kafbat UI on port 8090 (avoids conflict with API Gateway on 8080)
# Usage: .\scripts\run-kafka-ui.ps1 [path-to-kafbat-ui.jar]
# If no path given, looks for kafbat-ui*.jar in current dir or common locations

$jar = $args[0]
if (-not $jar) {
    $candidates = @(
        "C:\kafka_2.13-4.2.0\api-v1.4.2.jar",
        ".\api-v1.4.2.jar",
        ".\kafbat-ui*.jar",
        "$env:USERPROFILE\kafbat-ui*.jar",
        "C:\kafbat-ui*.jar"
    )
    foreach ($c in $candidates) {
        $found = Get-ChildItem -Path $c -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) { $jar = $found.FullName; break }
    }
}
if (-not $jar -or -not (Test-Path $jar)) {
    Write-Host "Kafbat UI jar not found. Download from https://github.com/kafbat/ui/releases" -ForegroundColor Yellow
    Write-Host "Then run: .\scripts\run-kafka-ui.ps1 C:\path\to\kafbat-ui.jar" -ForegroundColor Yellow
    exit 1
}

$env:SERVER_PORT = "8090"
Write-Host "Starting Kafbat UI on port 8090..." -ForegroundColor Cyan
java -Dserver.port=8090 -jar $jar
