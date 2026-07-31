from sqlalchemy.orm import Session

from backend.core.security import hash_password, verify_password
from backend.models.admin import Admin
from backend.schemas.admin import AdminCreate, createAdmin


def get_admin_by_username(db: Session, username: str) -> Admin | None:
    return db.query(Admin).filter(Admin.username == username).first()


def create_admin(db: Session, admin: AdminCreate | createAdmin, password_hash: str) -> Admin:
    db_admin = Admin(
        username=admin.username,
        email=admin.email,
        password_hash=password_hash,
    )

    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def authenticate_user(db: Session, username: str, password: str):
    user = get_admin_by_username(db, username)
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user