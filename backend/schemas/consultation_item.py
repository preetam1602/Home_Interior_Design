from pydantic import BaseModel, ConfigDict


class ConsultationItemBase(BaseModel):
    product_id: int
    quantity: int = 1
    notes: str | None = None


class ConsultationItemCreate(ConsultationItemBase):
    pass


class ConsultationItemResponse(ConsultationItemBase):
    id: int
    consultation_id: int

    model_config = ConfigDict(from_attributes=True)
