@echo off
echo Starting Patient Dashboard Frontend...
echo.

cd %~dp0

echo Installing dependencies...
call npm install

echo Starting frontend development server...
call npm start

echo.
echo Frontend server stopped.
