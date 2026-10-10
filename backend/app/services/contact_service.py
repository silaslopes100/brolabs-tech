"""
Arquivo: contact_service.py
Responsabilidade: processamento de mensagens de contato com proteção contra spambots e rate limiting.
Dados: tabela contact_messages
Como editar: configure limites de taxa e integrações de notificação (Telegram, Slack, e-mail).
"""

from datetime import datetime, timezone
import time
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.contact_message import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse

# Memória simples de rate limiting por IP: {ip: [timestamps]}
_ip_rate_limits: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW_SECONDS = 600  # 10 minutos
RATE_LIMIT_MAX_REQUESTS = 5      # máximo 5 mensagens por IP na janela


# ===== [SEÇÃO: PROCESSAMENTO DE CONTATO] =====
class ContactService:

    @staticmethod
    def check_rate_limit(client_ip: Optional[str]) -> None:
        if not client_ip:
            return

        now = time.time()
        window_start = now - RATE_LIMIT_WINDOW_SECONDS

        if client_ip not in _ip_rate_limits:
            _ip_rate_limits[client_ip] = []

        # Remove requisições mais antigas que a janela
        _ip_rate_limits[client_ip] = [
            t for t in _ip_rate_limits[client_ip] if t > window_start
        ]

        if len(_ip_rate_limits[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Muitas mensagens enviadas em pouco tempo. Por favor, aguarde alguns minutos."
            )

        _ip_rate_limits[client_ip].append(now)

    @classmethod
    def process_message(
        cls,
        db: Session,
        payload: ContactCreate,
        client_ip: Optional[str] = None
    ) -> ContactResponse:
        cls.check_rate_limit(client_ip)

        # Proteção honeypot: se preenchido, é um bot; retorna sucesso falso sem persistir
        if payload.honeypot and payload.honeypot.strip():
            return ContactResponse(
                success=True,
                message="Mensagem recebida com sucesso! Nossa equipe entrará em contato em breve.",
                received_at=datetime.now(timezone.utc)
            )

        message_record = ContactMessage(
            name=payload.name.strip(),
            email=payload.email.strip().lower(),
            company=payload.company,
            phone=payload.phone.strip() if payload.phone and payload.phone.strip() else None,
            interest=payload.interest.strip(),
            message=payload.message.strip(),
            consent_lgpd=payload.consent_lgpd,
            ip_address=client_ip
        )

        db.add(message_record)
        db.commit()

        # TODO(brolabs): Disparar notificação por e-mail/webhook para Silas e Marcos

        return ContactResponse(
            success=True,
            message="Mensagem recebida com sucesso! Nossa equipe analisará seu projeto e responderá rapidamente.",
            received_at=datetime.now(timezone.utc)
        )
