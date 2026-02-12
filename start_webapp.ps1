# Quick Start Script for Web Application
# Run this script to install Flask and start the server

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  VEHICLE INSURANCE PREDICTION - WEB APP SETUP" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan

# Check if Flask is installed
Write-Host "`nChecking Flask installation..." -ForegroundColor Yellow
try {
    python -c "import flask" 2>$null
    Write-Host "✓ Flask is already installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Flask not found. Installing..." -ForegroundColor Red
    pip install flask
    Write-Host "✓ Flask installed successfully" -ForegroundColor Green
}

# Verify model exists
Write-Host "`nVerifying trained model..." -ForegroundColor Yellow
$modelPath = "artifact\02_10_2026_14_49_37\model_trainer\trained_model\model.pkl"
if (Test-Path $modelPath) {
    Write-Host "✓ Model found at $modelPath" -ForegroundColor Green
    $modelSize = (Get-Item $modelPath).Length / 1MB
    Write-Host "  Size: $([math]::Round($modelSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "✗ Model not found at $modelPath" -ForegroundColor Red
    Write-Host "  Please train the model first using: python demo.py" -ForegroundColor Yellow
    exit 1
}

# Display server info
Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "  STARTING WEB SERVER" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "`nServer will be available at:" -ForegroundColor Yellow
Write-Host "  • Local:   http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "  • Network: http://0.0.0.0:5000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan

# Start Flask app
python app.py
