@echo off
echo Starting Patient Dashboard Backend Server...
echo.

cd %~dp0

echo Activating virtual environment...
if not exist ..\.venv (
    echo Virtual environment not found. Please create it first:
    echo python -m venv ..\.venv
    exit /b 1
)
call ..\.venv\Scripts\activate

echo Installing requirements...
pip install -r requirements.txt

echo Starting backend server...
uvicorn app:app --reload

echo.
echo Backend server stopped.
