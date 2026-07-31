from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from ..reference_generator import generate_reference_code
from backend.database import Base


class Consultation(Base):
	__tablename__ = "consultations"

	id = Column(Integer, primary_key=True, index=True)
	reference_code = Column(String, unique=True, index=True, nullable=False, default=generate_reference_code)
	customer_name = Column(String, nullable=False, index=True)
	customer_contact = Column(String, nullable=False, index=True)
	email = Column(String, nullable=True, index=True)
	property_type = Column(String, nullable=True)
	room_type = Column(String, nullable=True)
	budget_range = Column(String, nullable=True)
	preferred_style = Column(String, nullable=True)
	project_description = Column(String, nullable=True)
	preferred_consultation = Column(String, nullable=True)
	status = Column(String, nullable=False, default="pending")
	admin_id = Column(Integer, ForeignKey("admins.id"), nullable=True, index=True)
	created_at = Column(DateTime, default=func.now(), nullable=False)

	admin = relationship("Admin", back_populates="consultations")
	items = relationship("ConsultationItem", back_populates="consultation", cascade="all, delete-orphan")
	feedback = relationship("Feedback", back_populates="consultation", uselist=False, cascade="all, delete-orphan")

