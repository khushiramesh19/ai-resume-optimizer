Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Starting ResuMate AI Full-Stack Platform... " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan

# Launch Backend
Write-Host "Launching Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --port 8000"

# Launch Frontend
Write-Host "Launching Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both servers launched in background terminals." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend Docs: http://localhost:8000/docs" -ForegroundColor White
