from sqlalchemy.orm import Session

from backend.models.consultation_item import ConsultationItem
from backend.schemas.consultation_item import ConsultationItemCreate


def get_items(db: Session, con_id: int) -> list[ConsultationItem]:
    return db.query(ConsultationItem).filter(ConsultationItem.consultation_id == con_id).all()


def create_con_item(db: Session, consult: ConsultationItemCreate, consultation_id: int | None = None) -> ConsultationItem:
    resolved_consultation_id = getattr(consult, "consultation_id", None) or consultation_id
    if resolved_consultation_id is None:
        raise ValueError("consultation_id is required")

    db_consult = ConsultationItem(
        consultation_id=resolved_consultation_id,
        product_id=consult.product_id,
        quantity=consult.quantity,
        notes=consult.notes,
    )

    db.add(db_consult)
    db.commit()
    db.refresh(db_consult)

    return db_consult