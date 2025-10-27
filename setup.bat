@echo off
echo ========================================
echo   WaifUwU Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit backend\.env with your API keys!
    pause
)
call npm install
cd ..

echo.
echo [2/4] Setting up Frontend...
cd react
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)
call npm install
cd ..

echo.
echo [3/4] Setup Complete!
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Edit backend\.env with your API keys
echo 2. Make sure MongoDB is running
echo 3. Make sure Redis is running (optional)
echo 4. Run start.bat to launch the app
echo ========================================
echo.
pause
