from fastapi import APIRouter, Depends
import logging
from fastapi import APIRouter

from .main import router as main_router

logger = logging.getLogger(__name__)

router = APIRouter()

router.include_router(main_router, prefix="/patient_info", tags=["patient_info"])
