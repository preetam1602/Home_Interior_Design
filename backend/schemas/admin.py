from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

class createAdmin(BaseModel):
    username:str
    email:EmailStr
    password:str


class AdminBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "consultant"


class AdminCreate(createAdmin):
    pass


class AdminUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: str | None = None

class AdminResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

