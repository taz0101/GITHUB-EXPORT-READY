@echo off
echo.
echo ==========================================
echo  NEXUS PERROQUET BREEDING MANAGEMENT
echo  Desktop Application Builder
echo ==========================================
echo.

echo [1/5] Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python first.
    pause
    exit /b 1
)

echo [2/5] Installing dependencies...
cd frontend
call npm install

echo [3/5] Installing Electron...
call npm install electron electron-builder concurrently wait-on --save-dev

echo [4/5] Building React application...
call npm run build

echo [5/5] Building Windows executable...
call npm run electron:build-win

echo.
echo ==========================================
echo  BUILD COMPLETE!
echo ==========================================
echo.
echo Your .exe file is ready at:
echo frontend\dist\NEXUS PERROQUET Breeding Manager Setup 1.0.0.exe
echo.
echo You can now distribute this file to users!
echo.
pause