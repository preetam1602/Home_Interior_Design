from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.core.dependency import get_current_admin
from backend.services.dashboard_service import get_dashboard_summary as load_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard_summary(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    return load_dashboard_summary(db)
