"""
Arquivo: routes/contact.py
Responsabilidade: endpoint público de recebimento do formulário de contato.
Dados: tabela contact_messages
Como editar: configure integrações adicionais em ContactService.
"""

import time
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.ai import BriefingRequest, BriefingResponse
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.ai_service import generate_project_briefing
from app.services.contact_service import ContactService

router = APIRouter(tags=["Contato"])
_briefing_rate_limits: Dict[str, List[float]] = {}
BRIEFING_RATE_LIMIT_WINDOW_SECONDS = 600
BRIEFING_RATE_LIMIT_MAX_REQUESTS = 20


def _check_briefing_rate_limit(client_ip: Optional[str]) -> None:
    if not client_ip:
        return

    now = time.monotonic()
    window_start = now - BRIEFING_RATE_LIMIT_WINDOW_SECONDS
    requests = [
        timestamp
        for timestamp in _briefing_rate_limits.get(client_ip, [])
        if timestamp > window_start
    ]
    if len(requests) >= BRIEFING_RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Muitas solicitações de briefing. Aguarde alguns minutos e tente novamente.",
        )
    requests.append(now)
    _briefing_rate_limits[client_ip] = requests


# ===== [SEÇÃO: ENDPOINT DE CONTATO] =====
@router.post("/contact/briefing", response_model=BriefingResponse)
async def create_contact_briefing(
    payload: BriefingRequest,
    request: Request,
):
    """Conduz a primeira etapa de qualificação do contato com IA server-side."""
    client_ip = request.client.host if request.client else None
    _check_briefing_rate_limit(client_ip)
    return await generate_project_briefing(payload)


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(
    payload: ContactCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Processa mensagem do formulário de contato da Home.
    Requer consentimento LGPD explícito e filtra envios automatizados via honeypot.
    """
    client_ip = request.client.host if request.client else None
    response = ContactService.process_message(db=db, payload=payload, client_ip=client_ip)
    return response
