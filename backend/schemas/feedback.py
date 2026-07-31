from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

class FeedbackCreate(BaseModel):
    consultation_id: int | None = None
    rating: int | None = Field(None, ge=1, le=5)
    comment: str | None = None
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    message: str | None = None

class FeedbackResponse(FeedbackCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)