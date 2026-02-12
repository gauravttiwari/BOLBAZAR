@echo off
echo.
echo ========================================
echo    BOLBAZAR Frontend Server Starter
echo ========================================
echo.

cd frontend

echo [1/3] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo [3/3] Starting Next.js server on port 3000...
echo.
echo Server logs:
echo ----------------------------------------
npm run dev
