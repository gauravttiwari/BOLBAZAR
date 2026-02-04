@echo off
echo ========================================
echo   BolBazar Server Startup Script
echo ========================================
echo.

echo [1/4] Stopping existing Node processes...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo      ✓ Stopped running servers
    timeout /t 2 /nobreak >nul
) else (
    echo      ℹ No running servers found
)

echo [2/4] Cleaning frontend build cache...
cd frontend
if exist .next (
    rmdir /s /q .next 2>nul
    echo      ✓ Cleaned .next folder
) else (
    echo      ℹ .next folder already clean
)

echo [3/4] Starting Frontend Server...
start "BolBazar Frontend" cmd /k "npm run dev"
echo      ✓ Frontend starting on http://localhost:3000

cd ..
echo [4/4] Starting Backend Server...
cd backend
start "BolBazar Backend" cmd /k "node index.js"
echo      ✓ Backend starting on http://localhost:5000

cd ..
echo.
echo ========================================
echo   ✅ Both servers started!
echo ========================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause

