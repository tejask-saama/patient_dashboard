from fastapi import APIRouter
from src.db_connections import db
router = APIRouter()

@router.get("/patient_demog")
async def get_patient_demog():
    # Discover available columns to avoid querying non-existent fields
    col_rows = await db.read_data("PRAGMA table_info(patient_demography);")
    columns = {r["name"] for r in col_rows} if col_rows else set()

    # 1. Total Patient Count (always safe)
    total = await db.read_data(
        "SELECT COUNT(*) AS count FROM patient_demography;",
        fetch="one",
    )

    # 2. Patient Gender Distribution (requires Gender)
    if "Gender" in columns:
        genders = await db.read_data(
            """
            SELECT COALESCE(Gender, 'Unknown') AS label, COUNT(*) AS count
            FROM patient_demography
            GROUP BY Gender
            ORDER BY count DESC;
            """
        )
    else:
        genders = []

    # 3. Patient Age Distribution (requires Age)
    if "Age" in columns:
        ages = await db.read_data(
            """
            SELECT Age AS value, COUNT(*) AS count
            FROM patient_demography
            WHERE Age IS NOT NULL AND CAST(Age AS TEXT) != ''
            GROUP BY Age
            ORDER BY CAST(Age AS INTEGER);
            """
        )
    else:
        ages = []

    # 4. Patient Registration Trends (requires RegistrationDate)
    if "RegistrationDate" in columns:
        registration_trend = await db.read_data(
            """
            SELECT strftime('%Y-%m', RegistrationDate) AS period, COUNT(*) AS count
            FROM patient_demography
            WHERE RegistrationDate IS NOT NULL AND TRIM(RegistrationDate) != ''
            GROUP BY period
            ORDER BY period;
            """
        )
    else:
        registration_trend = []

    # 4a. Registration by Country (requires RegistrationDate, Country)
    if {"RegistrationDate", "Country"}.issubset(columns):
        registration_by_country = await db.read_data(
            """
            SELECT strftime('%Y-%m', RegistrationDate) AS period, COALESCE(Country, 'Unknown') AS country, COUNT(*) AS count
            FROM patient_demography
            WHERE RegistrationDate IS NOT NULL AND TRIM(RegistrationDate) != ''
            GROUP BY period, country
            ORDER BY period, count DESC;
            """
        )
    else:
        registration_by_country = []

    # 4b. Registration by Locale (requires RegistrationDate, Locale)
    if {"RegistrationDate", "Locale"}.issubset(columns):
        registration_by_locale = await db.read_data(
            """
            SELECT strftime('%Y-%m', RegistrationDate) AS period, COALESCE(Locale, 'Unknown') AS locale, COUNT(*) AS count
            FROM patient_demography
            WHERE RegistrationDate IS NOT NULL AND TRIM(RegistrationDate) != ''
            GROUP BY period, locale
            ORDER BY period, count DESC;
            """
        )
    else:
        registration_by_locale = []

    # 5. Top Cities (requires City)
    if "City" in columns:
        top_cities = await db.read_data(
            """
            SELECT COALESCE(City, 'Unknown') AS city, COUNT(*) AS count
            FROM patient_demography
            GROUP BY city
            ORDER BY count DESC
            LIMIT 10;
            """
        )
    else:
        top_cities = []

    # 6. Locale Breakdown (requires Locale)
    if "Locale" in columns:
        locale_breakdown = await db.read_data(
            """
            SELECT COALESCE(Locale, 'Unknown') AS locale, COUNT(*) AS count
            FROM patient_demography
            GROUP BY locale
            ORDER BY count DESC;
            """
        )
    else:
        locale_breakdown = []

    # 7. Average Age by Country (requires Age, Country)
    if {"Age", "Country"}.issubset(columns):
        avg_age_by_country = await db.read_data(
            """
            SELECT COALESCE(Country, 'Unknown') AS country, AVG(CAST(Age AS REAL)) AS avg_age
            FROM patient_demography
            WHERE Age IS NOT NULL AND TRIM(CAST(Age AS TEXT)) != ''
            GROUP BY country
            ORDER BY avg_age DESC;
            """
        )
    else:
        avg_age_by_country = []

    # 8. BMI by Marital Status (requires BMI, MaritalStatus)
    if {"BMI", "MaritalStatus"}.issubset(columns):
        avg_bmi_by_marital_status = await db.read_data(
            """
            SELECT COALESCE(MaritalStatus, 'Unknown') AS marital_status, AVG(CAST(BMI AS REAL)) AS avg_bmi
            FROM patient_demography
            WHERE BMI IS NOT NULL AND TRIM(CAST(BMI AS TEXT)) != ''
            GROUP BY marital_status
            ORDER BY avg_bmi DESC;
            """
        )
    else:
        avg_bmi_by_marital_status = []

    return {
        "total_patient_count": total["count"] if total else 0,
        "gender_distribution": genders,
        "age_distribution": ages,
        "registration_trends": {
            "overall": registration_trend,
            "by_country": registration_by_country,
            "by_locale": registration_by_locale,
        },
        "geography": {
            "top_cities": top_cities,
            "locale_breakdown": locale_breakdown,
        },
        "cross_cutting": {
            "avg_age_by_country": avg_age_by_country,
            "avg_bmi_by_marital_status": avg_bmi_by_marital_status,
        },
    }

@router.get("/adverse_event")
async def get_adverse_events():
    # Gather numerical KPIs
    total = await db.read_data(
        "SELECT COUNT(*) AS count FROM adverse_events;",
        fetch="one",
    )

    # Average time to resolution in days (only resolved rows with valid dates)
    avg_resolution_days = await db.read_data(
        """
        SELECT AVG(julianday(ResolutionDate) - julianday(EventDate)) AS avg_days
        FROM adverse_events
        WHERE ResolutionDate IS NOT NULL AND TRIM(ResolutionDate) != ''
          AND EventDate IS NOT NULL AND TRIM(EventDate) != ''
        """,
        fetch="one",
    )

    # Total ongoing events: Resolution marked 'Ongoing' (case-insensitive)
    # or missing ResolutionDate
    ongoing = await db.read_data(
        """
        SELECT COUNT(*) AS count
        FROM adverse_events
        WHERE (
            ResolutionDate IS NULL OR TRIM(ResolutionDate) = ''
        ) OR (
            Resolution IS NOT NULL AND LOWER(TRIM(Resolution)) = 'ongoing'
        );
        """,
        fetch="one",
    )

    # Distributions
    by_type = await db.read_data(
        """
        SELECT COALESCE(EventType, 'Unknown') AS label, COUNT(*) AS count
        FROM adverse_events
        GROUP BY EventType
        ORDER BY count DESC;
        """
    )

    by_severity = await db.read_data(
        """
        SELECT COALESCE(Severity, 'Unknown') AS label, COUNT(*) AS count
        FROM adverse_events
        GROUP BY Severity
        ORDER BY count DESC;
        """
    )

    by_location = await db.read_data(
        """
        SELECT COALESCE(Location, 'Unknown') AS label, COUNT(*) AS count
        FROM adverse_events
        GROUP BY Location
        ORDER BY count DESC;
        """
    )

    over_time = await db.read_data(
        """
        SELECT strftime('%Y-%m', EventDate) AS period, COUNT(*) AS count
        FROM adverse_events
        WHERE EventDate IS NOT NULL AND TRIM(EventDate) != ''
        GROUP BY period
        ORDER BY period;
        """
    )

    return {
        "totals": {
            "total_events": total["count"] if total else 0,
            "average_time_to_resolution_days": (
                float(avg_resolution_days["avg_days"]) if avg_resolution_days and avg_resolution_days["avg_days"] is not None else 0.0
            ),
            "total_ongoing_events": ongoing["count"] if ongoing else 0,
        },
        "distributions": {
            "by_type": by_type,
            "by_severity": by_severity,
            "by_location": by_location,
        },
        "over_time": over_time,
    }