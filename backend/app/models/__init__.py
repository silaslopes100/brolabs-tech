"""
Arquivo: models/__init__.py
Responsabilidade: exportação centralizada dos modelos ORM do SQLAlchemy.
"""

from app.models.user import User
from app.models.project import Project
from app.models.contact_message import ContactMessage

__all__ = ["User", "Project", "ContactMessage"]
