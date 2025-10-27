@echo off
echo ========================================
echo   Starting WaifUwU Application
echo ========================================
echo.
echo Starting Backend Server...
start "WaifUwU Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "WaifUwU Frontend" cmd /k "cd react && npm run dev"

echo.
echo ========================================
echo   Application Starting!
echo ========================================
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
