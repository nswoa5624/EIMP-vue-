@echo off
title EIMP Local Test Server

cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 goto missing_node

if not exist "node_modules\vite\bin\vite.js" goto missing_packages

echo Starting EIMP local test server...
echo URL: http://127.0.0.1:5173/air.html
echo Keep this window open. Closing it will stop the server.
echo.

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:5173/air.html'"
call npm.cmd run dev -- --host 127.0.0.1 --port 5173

echo.
echo Local test server stopped.
pause
exit /b

:missing_node
echo ERROR: npm was not found. Install Node.js first.
pause
exit /b 1

:missing_packages
echo ERROR: Project packages are missing. Run npm install in this folder first.
pause
exit /b 1
