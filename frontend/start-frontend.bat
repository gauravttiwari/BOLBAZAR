@echo off
echo ====================================
echo    Starting BolBazar Frontend
echo ====================================
echo.

REM Kill any existing node processes on port 3000
echo Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

REM Navigate to frontend directory
cd /d "%~dp0"

REM Clean .next folder
echo Cleaning .next build cache...
if exist .next (
    rmdir /s /q .next 2>nul
    echo .next folder deleted
) else (
    echo .next folder does not exist
)

echo.
echo Starting development server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
npm run dev

pause
