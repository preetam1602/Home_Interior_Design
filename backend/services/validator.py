from fastapi import HTTPException, status

from backend.schemas.consultation import ConsultationCreate
from backend.schemas.consultation_item import ConsultationItemCreate


def _require_text(value: str | None, field_name: str) -> str:
    if value is None or not value.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} is required",
        )
    return value.strip()


def _require_positive_int(value: int, field_name: str) -> int:
    if value <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} must be greater than 0",
        )
    return value


def validate_consultation_item(item: ConsultationItemCreate) -> ConsultationItemCreate:
    _require_positive_int(item.product_id, "product_id")
    _require_positive_int(item.quantity, "quantity")
    if item.notes is not None:
        item.notes = item.notes.strip() or None
    return item


def validate_consultation(consultation: ConsultationCreate) -> ConsultationCreate:
    consultation.customer_name = _require_text(consultation.customer_name, "customer_name")
    consultation.customer_contact = _require_text(consultation.customer_contact, "customer_contact")

    if not consultation.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one consultation item is required",
        )

    consultation.items = [validate_consultation_item(item) for item in consultation.items]
    return consultation