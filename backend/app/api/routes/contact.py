"""
Arquivo: routes/contact.py
Responsabilidade: endpoint público de recebimento do formulário de contato.
Dados: tabela contact_messages
Como editar: configure integrações adicionais em ContactService.
"""

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.contact_service import ContactService

router = APIRouter(tags=["Contato"])


# ===== [SEÇÃO: ENDPOINT DE CONTATO] =====
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
