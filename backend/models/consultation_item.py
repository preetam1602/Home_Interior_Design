from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from backend.database import Base


class ConsultationItem(Base):
	__tablename__ = "consultation_items"

	id = Column(Integer, primary_key=True, index=True)
	consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=False, index=True)
	product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
	quantity = Column(Integer, nullable=False, default=1)
	notes = Column(String, nullable=True)

	consultation = relationship("Consultation", back_populates="items")
	product = relationship("Product", back_populates="consultation_items")

