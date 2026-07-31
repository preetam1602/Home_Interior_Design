from datetime import datetime

from pydantic import BaseModel, ConfigDict

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: int
    category: str
    stock: int = 0

class ProductCreate(ProductBase):
    pass  # what the admin submits to add a product

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: int | None = None
    category: str | None = None
    stock: int | None = None
    image_url: str | None = None
    # all optional — partial updates

class ProductResponse(ProductBase):
    id: int
    image_url: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)