"""
Arquivo: schemas/auth.py
Responsabilidade: schemas Pydantic v2 para login, resposta de token e perfil de usuário.
Dados: DTOs da API
Como editar: adicione campos públicos ao schema UserOut conforme necessário.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ===== [SEÇÃO: SCHEMAS DE AUTENTICAÇÃO] =====
class LoginRequest(BaseModel):
    # EDITAR AQUI: validações de entrada de login
    email: EmailStr = Field(..., description="E-mail corporativo do administrador")
    password: str = Field(..., min_length=6, description="Senha de acesso")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True
