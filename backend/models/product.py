from sqlalchemy import JSON, Column, DateTime, Integer, String, Text, func
from sqlalchemy.orm import relationship

from backend.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    category = Column(String, index=True, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    image_url = Column(String, nullable=True)
    room = Column(String, index=True, nullable=True)
    unit = Column(String, nullable=True)  # e.g. "/ litre", "/sq.ft"; empty for per-item prices
    styles = Column(JSON, nullable=True)  # list of style tags, e.g. ["modern", "minimalist"]
    created_at = Column(DateTime, default=func.now(), nullable=False)

    consultation_items = relationship("ConsultationItem", back_populates="product")
