from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.schemas.consultation_item import ConsultationItemCreate, ConsultationItemResponse


class ConsultationBase(BaseModel):
    customer_name: str
    customer_contact: str
    email: str | None = None
    property_type: str | None = None
    room_type: str | None = None
    budget_range: str | None = None
    preferred_style: str | None = None
    project_description: str | None = None
    preferred_consultation: str | None = None


class ConsultationCreate(ConsultationBase):
    items: list[ConsultationItemCreate]


class ConsultationUpdate(BaseModel):
    customer_name: str | None = None
    customer_contact: str | None = None
    email: str | None = None
    property_type: str | None = None
    room_type: str | None = None
    budget_range: str | None = None
    preferred_style: str | None = None
    project_description: str | None = None
    preferred_consultation: str | None = None
    status: str | None = None
    admin_id: int | None = None

class ConsultationResponse(BaseModel):
    id: int
    reference_code: str
    customer_name: str
    customer_contact: str
    email: str | None = None
    property_type: str | None = None
    room_type: str | None = None
    budget_range: str | None = None
    preferred_style: str | None = None
    project_description: str | None = None
    preferred_consultation: str | None = None
    status: str
    admin_id: int | None
    items: list[ConsultationItemResponse]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)