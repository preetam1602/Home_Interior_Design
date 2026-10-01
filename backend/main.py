from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.database import Base, engine
from backend.core.exception_handlers import (
    custom_http_exception_handler,
    custom_validation_exception_handler,
)
from backend.routes import (
    auth,
    product,
    consultation,
    consultant,
    dashboard,
    feedback,
    upload,
)

# Create database tables (Development only)
# Use Alembic migrations in production
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Consultation Platform API",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React (3000) and Vite (5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers
app.add_exception_handler(
    StarletteHTTPException,
    custom_http_exception_handler,
)

app.add_exception_handler(
    RequestValidationError,
    custom_validation_exception_handler,
)

# Register Routers
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(consultation.router)
app.include_router(consultant.router)
app.include_router(dashboard.router)
app.include_router(feedback.router)
app.include_router(upload.router)



@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "API is running",
    }

