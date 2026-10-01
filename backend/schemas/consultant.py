from typing import Literal

from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ConsultantContext(BaseModel):
    current_view: str | None = Field(default=None, max_length=50)
    focused_product_id: int | None = None
    saved_product_ids: list[int] = Field(default_factory=list, max_length=100)


class ConsultantRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)
    context: ConsultantContext = Field(default_factory=ConsultantContext)


class ConsultantResponse(BaseModel):
    display_text: str  # full answer shown in the chat
    spoken_summary: str  # short version for the avatar to speak
    product_ids: list[int]  # validated against the products table
    estimated_total: int | None = None  # sum of recommended per-item products at site price


class AvatarSessionResponse(BaseModel):
    session_token: str  # short-lived; the browser uses it to start the LiveAvatar session
    session_id: str
