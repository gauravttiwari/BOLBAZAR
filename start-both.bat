@echo off
echo.
echo ========================================
echo    BOLBAZAR Full Stack Starter
echo ========================================
echo.
echo Starting both Backend and Frontend servers...
echo.

start "BOLBAZAR Backend" cmd /k "cd backend && node index.js"
timeout /t 3 /nobreak > nul

start "BOLBAZAR Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting in separate windows!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
