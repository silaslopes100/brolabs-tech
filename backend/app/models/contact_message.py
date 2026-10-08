"""
Arquivo: contact_message.py
Responsabilidade: modelo para armazenamento das mensagens enviadas pelo formulário de contato.
Dados: tabela 'contact_messages'
Como editar: adicione campos se o briefing exigir mais detalhes do cliente.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.database import Base


# ===== [SEÇÃO: MODELO CONTACT_MESSAGE] =====
class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(120), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    company = Column(String(120), nullable=True)
    interest = Column(String(80), nullable=False)  # Sistemas & SaaS, Automação com IA, etc.
    message = Column(Text, nullable=False)
    consent_lgpd = Column(Boolean, default=False, nullable=False)

    ip_address = Column(String(45), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
