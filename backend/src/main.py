from fastapi import APIRouter
from src.db_connections import db
router = APIRouter()

@router.get("/patient_demog")
async def get_patient_demog():
    rows = await db.read_data("SELECT * FROM patient_demography;")
    return rows

@router.get("/adverse_event")
async def get_adverse_events():
    rows = await db.read_data("SELECT * FROM adverse_events;")
    return rows