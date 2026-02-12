@echo off
echo ====================================
echo    Starting BolBazar Backend
echo ====================================
echo.

REM Kill any existing node processes on port 5000
echo Checking for processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

REM Navigate to backend directory
cd /d "%~dp0"

echo.
echo Starting backend server...
echo API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the backend server
node index.js

pause
