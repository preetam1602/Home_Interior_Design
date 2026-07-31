import logging
from sqlalchemy.orm import Session

from backend.models.activity_logs import ActivityLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("home_interior")



def create_activity_log(
    db: Session,
    *,
    admin_id: int,
    action: str,
    entity_type: str,
    entity_id: int,
) -> ActivityLog:
    db_log = ActivityLog(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def list_activity_logs(db: Session, admin_id: int | None = None) -> list[ActivityLog]:
    query = db.query(ActivityLog)
    if admin_id is not None:
        query = query.filter(ActivityLog.admin_id == admin_id)
    return query.order_by(ActivityLog.timestamp.desc()).all()