@echo off
echo.
echo ========================================
echo    BOLBAZAR System Check
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ❌ Node.js NOT found! Please install Node.js first.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo [2/5] Checking backend dependencies...
if exist "backend\node_modules\" (
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️  Backend dependencies missing
    echo    Run: cd backend ^&^& npm install
)

echo.
echo [3/5] Checking frontend dependencies...
if exist "frontend\node_modules\" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies missing
    echo    Run: cd frontend ^&^& npm install
)

echo.
echo [4/5] Checking environment files...
if exist "backend\.env" (
    echo ✅ Backend .env file exists
) else (
    echo ❌ Backend .env file missing!
    echo    Copy backend\.env.example to backend\.env
)

if exist "frontend\.env.local" (
    echo ✅ Frontend .env.local file exists
) else (
    echo ⚠️  Frontend .env.local file missing
    echo    This is optional but recommended
)

echo.
echo [5/5] Checking ports...
netstat -ano | findstr ":5000" > nul
if errorlevel 1 (
    echo ✅ Port 5000 is available (Backend)
) else (
    echo ⚠️  Port 5000 is in use
)

netstat -ano | findstr ":3000" > nul
if errorlevel 1 (
    echo ✅ Port 3000 is available (Frontend)
) else (
    echo ⚠️  Port 3000 is in use
)

echo.
echo ========================================
echo System check complete!
echo.
echo To start the project:
echo   - Run: start-both.bat
echo   - Or read: SETUP_GUIDE.md
echo ========================================
echo.
pause
