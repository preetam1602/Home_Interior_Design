from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from backend.database import Base


class Admin(Base):
	__tablename__ = "admins"

	id = Column(Integer, primary_key=True, index=True)
	username = Column(String, unique=True, index=True, nullable=False)
	email = Column(String, unique=True, index=True, nullable=False)
	password_hash = Column(String, nullable=False)
	role = Column(String, nullable=False, default="consultant")
	created_at = Column(DateTime, default=func.now(), nullable=False)

	consultations = relationship("Consultation", back_populates="admin")
	activity_logs = relationship("ActivityLog", back_populates="admin")

