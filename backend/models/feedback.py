from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from backend.database import Base


class Feedback(Base):
	__tablename__ = "feedbacks"

	id = Column(Integer, primary_key=True, index=True)
	consultation_id = Column(Integer, ForeignKey("consultations.id"), unique=True, nullable=True, index=True)
	rating = Column(Integer, nullable=True)
	comment = Column(String, nullable=True)
	name = Column(String, nullable=True)
	phone = Column(String, nullable=True)
	email = Column(String, nullable=True)
	message = Column(String, nullable=True)
	created_at = Column(DateTime, default=func.now(), nullable=False)

	consultation = relationship("Consultation", back_populates="feedback")

