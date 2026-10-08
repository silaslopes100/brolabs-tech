"""
Arquivo: schemas/__init__.py
Responsabilidade: exportação centralizada de todos os schemas Pydantic.
"""

from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from app.schemas.project import (
    ProjectCategoryEnum,
    CATEGORY_LABELS,
    ProjectCreate,
    ProjectUpdate,
    ProjectHomeToggle,
    ProjectReorderRequest,
    ProjectOrderItem,
    ProjectOut,
    CategoryItemOut
)
from app.schemas.contact import ContactCreate, ContactResponse

__all__ = [
    "LoginRequest",
    "TokenResponse",
    "UserOut",
    "ProjectCategoryEnum",
    "CATEGORY_LABELS",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectHomeToggle",
    "ProjectReorderRequest",
    "ProjectOrderItem",
    "ProjectOut",
    "CategoryItemOut",
    "ContactCreate",
    "ContactResponse"
]
