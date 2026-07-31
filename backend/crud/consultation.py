from sqlalchemy.orm import Session

from backend.models.consultation import Consultation
from backend.schemas.consultation import ConsultationCreate


def get_consult(db: Session, cus_name: str) -> Consultation | None:
    return db.query(Consultation).filter(Consultation.customer_name == cus_name).first()


def create_consult(db: Session, consult: ConsultationCreate) -> Consultation:
    db_consult = Consultation(
        customer_name=consult.customer_name,
        customer_contact=consult.customer_contact,
        email=consult.email,
        property_type=consult.property_type,
        room_type=consult.room_type,
        budget_range=consult.budget_range,
        preferred_style=consult.preferred_style,
        project_description=consult.project_description,
        preferred_consultation=consult.preferred_consultation,
    )

    db.add(db_consult)
    db.commit()
    db.refresh(db_consult)

    return db_consult

def get_all_consults(db: Session) -> list[Consultation]:
    return db.query(Consultation).all()

def update_consult_status(db: Session, consult_id: int, status: str) -> Consultation | None:
    consult = db.query(Consultation).filter(Consultation.id == consult_id).first()
    if consult:
        consult.status = status
        db.commit()
        db.refresh(consult)
    return consult

def delete_consult(db: Session, consult_id: int) -> bool:
    consult = db.query(Consultation).filter(Consultation.id == consult_id).first()
    if consult:
        db.delete(consult)
        db.commit()
        return True
    return False