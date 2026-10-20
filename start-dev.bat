@echo off
echo ====================================================
echo Starting ResuMate AI Full-Stack Platform...
echo ====================================================
echo.

echo Launching FastAPI Backend on http://localhost:8000 ...
start "ResuMate AI - Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

echo Launching Vite Frontend on http://localhost:5173 ...
start "ResuMate AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo Both servers are launching!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ====================================================
