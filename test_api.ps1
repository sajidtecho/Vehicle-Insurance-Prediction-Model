# Test the prediction API endpoint
$testData = @{
    gender = 1
    age = 35
    driving_license = 1
    region_code = 28
    previously_insured = 0
    annual_premium = 30000
    policy_sales_channel = 152
    vintage = 150
    vehicle_age_lt_1_year = 0
    vehicle_age_gt_2_years = 1
    vehicle_damage_yes = 1
} | ConvertTo-Json

Write-Host "Sending test prediction request..." -ForegroundColor Yellow
Write-Host ""

$response = Invoke-RestMethod -Uri "http://127.0.0.1:5000/predict" `
    -Method Post `
    -Body $testData `
    -ContentType "application/json"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "PREDICTION RESULT" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prediction: " -NoNewline
if ($response.prediction -eq 1) {
    Write-Host "$($response.prediction_text)" -ForegroundColor Green
} else {
    Write-Host "$($response.prediction_text)" -ForegroundColor Red
}
Write-Host ""
Write-Host "Recommendation:" -ForegroundColor Yellow
Write-Host "  Title: $($response.recommendation.title)"
Write-Host "  Message: $($response.recommendation.message)"
Write-Host ""
Write-Host "  Actions:" -ForegroundColor Yellow
foreach ($action in $response.recommendation.actions) {
    Write-Host "    - $action"
}
Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
