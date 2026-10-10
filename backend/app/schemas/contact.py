"""
Arquivo: schemas/contact.py
Responsabilidade: validação do formulário de contato com proteção anti-spam (honeypot) e consentimento LGPD.
Dados: DTO de envio para POST /api/contact
Como editar: adicione campos de briefing respeitando as regras de privacidade.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ===== [SEÇÃO: SCHEMAS DE CONTATO] =====
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120, description="Nome completo ou de contato")
    email: EmailStr = Field(..., description="E-mail profissional")
    company: str = Field(..., min_length=1, max_length=120, description="Nome da empresa")
    phone: Optional[str] = Field(None, max_length=40, description="Telefone ou WhatsApp")
    interest: str = Field(..., min_length=2, max_length=80, description="Serviço de interesse principal")
    message: str = Field(..., min_length=10, max_length=3000, description="Detalhes sobre a ideia ou projeto")
    consent_lgpd: bool = Field(..., description="Consentimento explícito com a Política de Privacidade")
    honeypot: Optional[str] = Field(None, description="Campo anti-spam invisível para bots")

    @field_validator("company")
    def validate_company(cls, value: str) -> str:
        company = value.strip()
        if not company:
            raise ValueError("O nome da empresa é obrigatório.")
        return company

    @field_validator("consent_lgpd")
    def validate_lgpd(cls, v):
        if not v:
            raise ValueError("O consentimento LGPD é obrigatório para o envio.")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str
    received_at: datetime
