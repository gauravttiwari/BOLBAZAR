@echo off
title BolBazar - Stopping All Services
color 0C

echo.
echo ================================================
echo          STOPPING BOLBAZAR SERVICES
echo ================================================
echo.

REM Kill all node processes
echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js processes stopped
) else (
    echo ℹ No Node.js processes were running
)

REM Kill processes on port 3000
echo.
echo Freeing port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
    echo ✓ Process %%a terminated
)

REM Kill processes on port 5000
echo.
echo Freeing port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
    echo ✓ Process %%a terminated
)

echo.
echo ================================================
echo   All services stopped successfully!
echo ================================================
echo.
pause
