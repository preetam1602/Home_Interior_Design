from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.crud.consultation import create_consult, get_consult
from backend.crud.consultation_item import create_con_item
from backend.schemas.consultation import ConsultationCreate
from backend.models.consultation import Consultation
from backend.services.validator import validate_consultation


def create_consultation(
    db: Session,
    consult: ConsultationCreate,
) -> Consultation:

    consult = validate_consultation(consult)

    # Check if consultation already exists
    existing_consultation = get_consult(db, consult.customer_name)

    if existing_consultation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultation for this customer already exists"
        )

    # Create consultation
    created_consultation = create_consult(db, consult)

    # Create consultation items
    for item in consult.items:
        create_con_item(
            db=db,
            consult=item,
            consultation_id=created_consultation.id
        )

    db.refresh(created_consultation)

    return created_consultation

def get_all_consultations(db: Session) -> list[Consultation]:
    from backend.crud.consultation import get_all_consults
    return get_all_consults(db)

def update_consultation_status(db: Session, consult_id: int, status: str) -> Consultation:
    from backend.crud.consultation import update_consult_status
    consult = update_consult_status(db, consult_id, status)
    if not consult:
        raise HTTPException(
            status_code=404,
            detail="Consultation not found"
        )
    return consult

def delete_consultation(db: Session, consult_id: int) -> dict:
    from backend.crud.consultation import delete_consult
    success = delete_consult(db, consult_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Consultation not found"
        )
    return {"message": "Consultation deleted successfully"}