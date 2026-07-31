from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from backend.database import Base


class ActivityLog(Base):
	__tablename__ = "activity_logs"

	id = Column(Integer, primary_key=True, index=True)
	admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False, index=True)
	action = Column(String, nullable=False)
	entity_type = Column(String, nullable=False)
	entity_id = Column(Integer, nullable=False, index=True)
	timestamp = Column(DateTime, default=func.now(), nullable=False)

	admin = relationship("Admin", back_populates="activity_logs")

