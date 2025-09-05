# Patient Healthcare Dashboard

A professional React-based dashboard application for visualizing patient healthcare data.

## Features

- **Two Main Views**:
  - Patient Demographics
  - Adverse Events
  
- **Visual Data Representation**:
  - Interactive charts using Chart.js
  - Responsive design for all screen sizes
  
- **Theme Support**:
  - Light and dark themes
  - Automatic theme detection with user preferences
  
- **Robust Architecture**:
  - React frontend with component-based design
  - FastAPI backend with SQLite database

## Getting Started

### Running the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   uvicorn app:app --reload
   ```
   
4. The backend will be available at http://127.0.0.1:8000

### Running the React Frontend

1. Navigate to the react-frontend directory:
   ```
   cd react-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will open in your browser at http://localhost:3000

## Project Structure

```
patient_dashboard/
├── backend/
│   ├── src/
│   │   ├── api.py          # API router setup
│   │   ├── db_connections.py  # Database connection utilities
│   │   ├── main.py         # API endpoints and business logic
│   ├── app.py              # FastAPI application setup
│   └── requirements.txt    # Backend dependencies
├── react-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AdverseEvents/
│   │   │   ├── charts/     # Reusable chart components
│   │   │   ├── Header/
│   │   │   ├── PatientDemographics/
│   │   │   ├── shared/     # Shared UI components
│   │   │   └── TabNavigation/
│   │   ├── contexts/       # React context providers
│   │   ├── services/       # API service functions
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── healthcare_data.db      # SQLite database
```

## Tech Stack

- **Frontend**:
  - React
  - Chart.js / React ChartJS 2
  - Material UI Icons
  - CSS with variables for theming

- **Backend**:
  - FastAPI
  - SQLite
  - Async database access

## Available Data Visualizations

### Patient Demographics
- Gender distribution (pie chart)
- Age distribution (bar chart)
- Registration trends (line chart)
- Top cities (horizontal bar)
- Locale breakdown (bar chart)
- Average age by country (bar chart)
- Average BMI by marital status (bar chart)

### Adverse Events
- Events by type (horizontal bar)
- Events by severity (bar chart)
- Events over time (line chart)
- Events by location (horizontal bar)

# Project Description

This document provides a comprehensive overview of the Patient Dashboard project, including its architecture, ETL pipeline, database schema, backend APIs, forecasting functionality, and frontend features.

## 1. Overview

The Patient Dashboard is a full-stack application for healthcare analytics. It surfaces patient demographics, adverse events, appointment directories, and no-show forecasts to support operational decision-making.

- Backend: FastAPI (Python), SQLite database
- Frontend: React with Chakra UI
- Data: Ingested via an ETL pipeline from S3 CSVs into a local SQLite database

Project root key paths:
- `backend/`: FastAPI server and data access
- `frontend/`: React UI
- `healthcare_data.db`: SQLite database


## 2. Architecture

- The backend exposes REST endpoints for analytics and operational data.
- The ETL subsystem loads CSVs from S3 into SQLite tables.
- The frontend fetches data from the backend and renders charts and tables.

High-level flow:
1) ETL pulls CSVs from S3 and loads them into SQLite tables.
2) Backend queries SQLite with optimized, parameterized SQL and serves JSON.
3) Frontend renders dashboards, filters, and tables based on API responses.


## 3. Database Schema

The SQLite schema is defined in `backend/src/ddl.sql`. Core tables include:

- `patient_demography`
  - Columns: `PatientID`, `FirstName`, `LastName`, `Gender`, `BirthDate`, `Age`, `BloodType`, `Height_cm`, `Weight_kg`, `PhoneNumber`, `Email`, `Address`, `City`, `Country`, `Nationality`, `MaritalStatus`, `InsuranceProvider`, `InsuranceID`, `Locale`, `RegistrationDate`.

- `patient_appointments`
  - Columns: `AppointmentID`, `PatientID`, `ScheduledDateTime`, `EndDateTime`, `AppointmentType`, `Department`, `PhysicianName`, `Status`, `Location`, `RoomNumber`, `Notes`, `Created`, `LastModified`.

- `adverse_events`
  - Columns: `AdverseEventID`, `PatientID`, `EventDate`, `EventType`, `EventDescription`, `Severity`, `Location`, `ReportedBy`, `ActionTaken`, `Resolution`, `ResolutionDate`.

- `daily_patient_activity`
  - Columns: `activity_date`, `total_appointments`, `completed_appointments`, `no_show_count`, `no_show_rate`, `adverse_events_count`, `new_patients_registered`, `unique_patients_seen`.

- `no_show_forecasts` (optional for storing predictions)
  - Columns: `id` (PK), `date`, `no_show_count`.

Indexes (recommended for performance, add if needed):
- `patient_appointments(AppointmentType)`, `(Department)`, `(PhysicianName)`, `(Status)`, `(ScheduledDateTime)`, `(PatientID)`
- `patient_demography(PatientID)`, `(FirstName)`, `(LastName)`


## 4. ETL Pipeline

Location: `backend/src/ETL_Pipeline/`

Purpose: Load CSV data from S3 into local SQLite tables. Uses `boto3` for S3 and `pandas` for CSV reading/cleaning before writing to SQLite.

Configuration file (example): `backend/src/ETL_Pipeline/config.json`
- `aws_access_key_id`, `aws_secret_access_key`, `aws_region`
- `s3_bucket_name`
- `sqlite_db_path` (e.g., `../../../../healthcare_data.db` when called from pipeline modules)
- `table_to_s3key` mapping from table name to CSV path in bucket

Recommended security practice:
- Do not hardcode credentials. Prefer environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`.
- Ensure the config file is gitignored if it contains secrets.

Run options:
- Batch: `backend/run-etl.bat <table|all> [--s3-path path/in/bucket.csv] [--log-level DEBUG]`
- Python module: `python -m backend.src.ETL_Pipeline.orchestrator --config backend/src/ETL_Pipeline/config.json --table <table|all>`

Behavior:
- Downloads CSV from S3
- Reads with `pandas.read_csv`
- Cleans data minimally (trim, dtype conversions)
- Writes to SQLite with `if_exists='replace'` for idempotency


## 5. Backend APIs

Backend entrypoint: `backend/app.py`
- Health check: `GET /` -> `{ "message": "API Healthy" }`
- Routers included via `backend/src/api.py`:
  - `patient_info` (see `backend/src/main.py`)
  - `forecast` (see `backend/src/forecasting_api.py`)
  - `appointments` (see `backend/src/appointments_api.py`)

### 5.1 Patient Info
Base path: `/patient_info`

- `GET /patient_info/patient_demog`
  - Aggregates patient demographics: total counts, gender distribution, age distribution, registration trends (overall/by country/by locale), geography (top cities, locale breakdown), and cross-cutting metrics (avg age by country, avg BMI by marital status if present).

- `GET /patient_info/adverse_event`
  - Adverse events analytics: totals, average resolution time, ongoing events, distributions (by type, severity, location), and time series.

### 5.2 Forecasting

- `GET /predict`
  - Query params: `start` (YYYY-MM-DD), `end` (YYYY-MM-DD).
  - If not provided, defaults to the next 14 days (including today).
  - Logic (`backend/src/forecasting_api.py`):
    - Derives weekday averages from the last 90 days in `daily_patient_activity`.
    - Returns actuals for dates where present, otherwise a weekday-average forecast (with a minimum baseline to avoid zeros).
  - Response shape:
    - `{ "predictions": [ { "date": "YYYY-MM-DD", "no_show_count": <int>, "source": "actual|forecast", "total_appointments"?, "completed_appointments"?, "no_show_rate"? } ] }`

### 5.3 Appointments Directory

- `GET /api/v1/patients`
  - Query params:
    - `page` (int, default 1), `limit` (int, default 10, max 200)
    - `search` (string): searches full name (`patient_demography.FirstName || ' ' || LastName`) plus appointment fields
    - `sort` (string): one of whitelisted columns
    - `order` (string): `asc|desc`
    - Filters: `appointmentType`, `department`, `physicianName`, `status`
  - Response:
    - `data`: array of appointments with fields
    - `pagination`: `{ currentPage, totalPages, totalRecords }`
  - Implementation notes:
    - Safe ORDER BY whitelist prevents SQL injection.
    - Joins `patient_appointments` to `patient_demography` for name search only; returns appointment fields as requested.


## 6. Frontend

Location: `frontend/`
- UI framework: React + Chakra UI
- Routing: `frontend/src/App.js`
- Layout: `frontend/src/components/layout/*`
- Theme and styles: `frontend/src/theme.js`, `frontend/src/styles/`

Pages:
- `Dashboard`: High-level KPIs and charts
- `PatientDemographics`: Charts and breakdowns from `/patient_info/patient_demog`
- `AdverseEvents`: Analytics from `/patient_info/adverse_event`
- `Forecasting`: No-show forecast chart and table from `/predict`
- `AppointmentDirectory`: Master appointment list with search, filters, sorting, and pagination from `/api/v1/patients`

Services:
- `frontend/src/services/api.js` consolidates API calls, including `fetchAppointments`, `fetchPatientDemographics`, `fetchAdverseEvents`, and `fetchNoShowForecast`.


## 7. Security

- CORS is currently permissive in `backend/app.py` to simplify local development.
- Add authentication/authorization middleware as needed; a placeholder `get_current_user()` dependency exists in `appointments_api.py`.
- Store secrets (e.g., AWS credentials) in environment variables or secure vaults, not in source control.


## 8. Setup and Run

Backend:
- Install: `pip install -r backend/requirements.txt`
- Run: `uvicorn app:app --reload --port 9000` from the `backend/` directory

Frontend:
- Install: `npm install` from `frontend/`
- Run: `npm start`

Database:
- Ensure `healthcare_data.db` exists and contains the expected tables and columns.
- Use the ETL pipeline to load/update data from S3 as needed.


## 9. Operational Considerations

- Performance: Add indexes on frequently filtered/sorted columns and consider pagination strategies for very large datasets.
- Monitoring: Log API errors and latencies; surface metrics if needed.
- Data quality: ETL should include validations to avoid schema drift and ensure clean types.


## 10. Change Log (High-Level)

- Added Appointments Directory API `GET /api/v1/patients` and frontend page.
- Implemented forecasting API `GET /predict` with weekday-average baseline.
- Established ETL pipeline documentation and configuration.

