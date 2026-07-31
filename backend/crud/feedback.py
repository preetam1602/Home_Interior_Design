from sqlalchemy.orm import Session

from backend.models.feedback import Feedback
from backend.schemas.feedback import FeedbackCreate


def get_feedback_by_id(db: Session, feedback_id: int) -> Feedback | None:
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()


def list_feedbacks(db: Session) -> list[Feedback]:
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()


def create_feedback(db: Session, feedback: FeedbackCreate) -> Feedback:
    db_feedback = Feedback(
        consultation_id=feedback.consultation_id,
        rating=feedback.rating,
        comment=feedback.comment,
        name=feedback.name,
        phone=feedback.phone,
        email=feedback.email,
        message=feedback.message,
    )

    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def update_feedback(db: Session, feedback_id: int, *, rating: int | None = None, comment: str | None = None) -> Feedback | None:
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return None

    if rating is not None:
        db_feedback.rating = rating
    if comment is not None:
        db_feedback.comment = comment

    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def delete_feedback(db: Session, feedback_id: int) -> bool:
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return False

    db.delete(db_feedback)
    db.commit()
    return True