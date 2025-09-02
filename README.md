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
