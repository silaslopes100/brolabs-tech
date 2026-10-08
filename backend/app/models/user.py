"""
Arquivo: user.py
Responsabilidade: modelo de usuário administrador no banco de dados.
Dados: tabela 'users'
Como editar: adicione campos como nome completo ou perfil se necessário.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base


# ===== [SEÇÃO: MODELO USER] =====
class User(Base):
    __tablename__ = "users"

    # NÃO MEXER: identificadores e credenciais de autenticação
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(120), nullable=True, default="Admin")
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
