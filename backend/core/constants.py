from enum import Enum

class ConsultationStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class AdminRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    STAFF = "staff"

MAX_UPLOAD_SIZE_MB = 5
DEFAULT_PAGE_SIZE = 20