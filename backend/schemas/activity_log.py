from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ActivityLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: int


class ActivityLogCreate(ActivityLogBase):
    admin_id: int


class ActivityLogResponse(ActivityLogBase):
    id: int
    admin_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
