from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.crud.feedback import create_feedback, delete_feedback, get_feedback_by_id, list_feedbacks, update_feedback
from backend.database import get_db
from backend.core.dependency import get_current_admin
from backend.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/feed", tags=["Feedback"])


@router.post("/feedback", response_model=FeedbackResponse)
def create_feedback_route(feed: FeedbackCreate, db: Session = Depends(get_db)):
    return create_feedback(db, feed)


@router.get("/feedback", response_model=list[FeedbackResponse])
def list_feedback_route(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    return list_feedbacks(db)


@router.get("/feedback/{feedback_id}", response_model=FeedbackResponse)
def get_feedback_route(feedback_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    feedback = get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    return feedback


@router.put("/feedback/{feedback_id}", response_model=FeedbackResponse)
def update_feedback_route(feedback_id: int, feedback_update: FeedbackCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    updated_feedback = update_feedback(
        db,
        feedback_id,
        rating=feedback_update.rating,
        comment=feedback_update.comment,
    )
    if not updated_feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    return updated_feedback


@router.delete("/feedback/{feedback_id}")
def delete_feedback_route(feedback_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    deleted = delete_feedback(db, feedback_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    return {"detail": "Feedback deleted successfully"}