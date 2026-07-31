from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.core.dependency import get_current_admin
from backend.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
)
from backend.services.consultation_service import create_consultation

router = APIRouter(
    prefix="/consult",
    tags=["Consultation"]
)


@router.post(
    "/create",
    response_model=ConsultationResponse,
)
def create(
    consult: ConsultationCreate,
    db: Session = Depends(get_db),
):
    return create_consultation(db, consult)


@router.get("/", response_model=list[ConsultationResponse])
def get_all(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    from backend.services.consultation_service import get_all_consultations
    return get_all_consultations(db)


from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: str

@router.put("/{consult_id}/status", response_model=ConsultationResponse)
def update_status(
    consult_id: int,
    status_update: StatusUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    from backend.services.consultation_service import update_consultation_status
    return update_consultation_status(db, consult_id, status_update.status)


@router.delete("/{consult_id}")
def delete(consult_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    from backend.services.consultation_service import delete_consultation
    return delete_consultation(db, consult_id)