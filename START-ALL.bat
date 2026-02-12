@echo off
title BolBazar - Starting All Services
color 0A

echo.
echo ================================================
echo          BOLBAZAR E-COMMERCE PLATFORM
echo ================================================
echo.
echo Starting all services...
echo.

REM Start Backend in new window
echo [1/2] Starting Backend Server...
start "BolBazar Backend (Port 5000)" cmd /k "cd /d %~dp0backend && start-backend.bat"
timeout /t 2 /nobreak >nul

REM Start Frontend in new window  
echo [2/2] Starting Frontend Server...
start "BolBazar Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && start-frontend.bat"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo   All services started successfully!
echo ================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows have been opened.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this window...
pause >nul
