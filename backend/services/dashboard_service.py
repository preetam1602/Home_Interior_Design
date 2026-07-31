from sqlalchemy.orm import Session

from backend.models.admin import Admin
from backend.models.consultation import Consultation
from backend.models.feedback import Feedback
from backend.models.product import Product


def get_dashboard_summary(db: Session) -> dict[str, int]:
	return {
		"total_admins": db.query(Admin).count(),
		"total_consultations": db.query(Consultation).count(),
		"total_products": db.query(Product).count(),
		"total_feedback": db.query(Feedback).count(),
	}
