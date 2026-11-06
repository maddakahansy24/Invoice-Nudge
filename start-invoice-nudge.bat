@echo off
title Invoice Nudge Launcher
echo ========================================================
echo        Starting Invoice Nudge (Full-Stack MERN)
echo ========================================================
echo.

echo 1. Starting Backend API Server (Port 5000)...
start "Invoice Nudge - Backend" cmd /k "cd /d %~dp0server && node server.js"

echo Waiting 3 seconds for database and backend to initialize...
timeout /t 3 /nobreak >nul

echo 2. Starting Frontend Client (Port 5174)...
start "Invoice Nudge - Frontend" cmd /k "cd /d %~dp0client && npx vite --port 5174 --host"

echo 3. Opening Application in Browser...
timeout /t 2 /nobreak >nul
start http://localhost:5174

echo.
echo ========================================================
echo  Invoice Nudge is now running!
echo  - Frontend Web App: http://localhost:5174
echo  - REST API Backend: http://localhost:5000
echo ========================================================
echo Keep the two black command windows open while using the app.
echo To stop, simply close the command windows.
pause
