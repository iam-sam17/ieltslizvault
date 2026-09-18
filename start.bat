@echo off
title IELTS Liz Vault - Local Server Launcher
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   🌟 IELTS Liz Vault - Local Server Launcher
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   Opening: http://localhost:8085/index.html
echo.
echo   Press CTRL+C to stop the server.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%~dp0"

:: Open default browser after a short delay
start "" timeout /t 2 /nobreak >nul && start "" "http://localhost:8085/index.html"

:: Run server with fallback
python -m http.server 8085
if %errorlevel% neq 0 (
    python3 -m http.server 8085
)

pause
