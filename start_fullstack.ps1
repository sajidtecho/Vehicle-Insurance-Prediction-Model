# Full Stack Startup Script - Backend + Frontend
# This script starts both the FastAPI backend and React frontend

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  VEHICLE INSURANCE PREDICTION - FULL STACK STARTUP" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan

# Check Python
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "`n[2/5] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Verify model exists
Write-Host "`n[3/5] Verifying trained model..." -ForegroundColor Yellow
$modelPath = "artifact\02_10_2026_14_49_37\model_trainer\trained_model\model.pkl"
if (Test-Path $modelPath) {
    Write-Host "✓ Model found" -ForegroundColor Green
} else {
    Write-Host "✗ Model not found. Please run: python demo.py" -ForegroundColor Red
    exit 1
}

# Check backend dependencies
Write-Host "`n[4/5] Checking backend dependencies..." -ForegroundColor Yellow
try {
    python -c "import fastapi, uvicorn" 2>$null
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    pip install fastapi uvicorn python-multipart pyjwt bcrypt
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

# Check frontend dependencies
Write-Host "`n[5/5] Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

# Display startup info
Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "  STARTING SERVERS" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "`nBackend API:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host "=" * 80 -ForegroundColor Cyan

# Start backend in background
Write-Host "`nStarting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python backend_api.py"
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Yellow
cd frontend
npm run dev
