# Patient Dashboard

A healthcare analytics dashboard displaying patient demographics and adverse events.

## Project Structure

- `backend/`: FastAPI backend server
- `frontend/`: React frontend application
- `healthcare_data.db`: SQLite database with patient data

## Setup Instructions

### Backend Setup

1. Create a virtual environment
   ```bash
   # Navigate to project directory
   cd patient_dashboard

   # Create virtual environment
   python -m venv .venv
   ```

2. Start the backend server using the provided script
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Run the startup script
   start-backend.bat
   ```
   This script will activate the virtual environment, install requirements, and start the server.
   The backend will be available at http://localhost:8000

### Frontend Setup

1. Start the frontend application using the provided script
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Run the startup script
   start-frontend.bat
   ```
   This script will install dependencies and start the development server.
   The frontend will be available at http://localhost:3000

## Manual Setup (Alternative)

If you prefer not to use the scripts:

### Backend Manual Setup
1. Create virtual environment: `python -m venv .venv`
2. Activate: `.venv\Scripts\activate`
3. Install: `cd backend && pip install -r requirements.txt`
4. Start server: `uvicorn app:app --reload`

### Frontend Manual Setup
1. Install dependencies: `cd frontend && npm install`
2. Start application: `npm start`

## API Endpoints

- `/patient_info/patient_demog`: Get patient demographic information
- `/patient_info/adverse_event`: Get adverse event information

## Technologies

- **Backend**: FastAPI, SQLite, Python
- **Frontend**: React, Chakra UI, Recharts
