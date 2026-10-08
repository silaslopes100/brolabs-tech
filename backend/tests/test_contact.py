"""
Arquivo: tests/test_contact.py
Responsabilidade: validação do formulário de contato, obrigatoriedade de LGPD e descarte de bot por honeypot.
"""

from app.models.contact_message import ContactMessage


def test_contact_submission_success(client, db_session):
    """Valida envio regular de contato com consentimento LGPD."""
    payload = {
        "name": "Carlos Silva",
        "email": "carlos@empresa.com.br",
        "company": "Silva Empreendimentos",
        "interest": "Sistemas & SaaS",
        "message": "Gostaria de desenvolver uma plataforma SaaS multi-tenant.",
        "consent_lgpd": True
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    assert response.json()["success"] is True

    # Verifica persistência no banco
    msg = db_session.query(ContactMessage).filter(ContactMessage.email == "carlos@empresa.com.br").first()
    assert msg is not None
    assert msg.name == "Carlos Silva"
    assert msg.interest == "Sistemas & SaaS"


def test_contact_lgpd_required(client):
    """Valida que o envio é rejeitado se consent_lgpd for False."""
    payload = {
        "name": "Carlos Silva",
        "email": "carlos@empresa.com.br",
        "interest": "Sistemas & SaaS",
        "message": "Mensagem sem consentimento LGPD.",
        "consent_lgpd": False
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422


def test_contact_honeypot_discard(client, db_session):
    """Valida que bots que preenchem o campo honeypot recebem resposta de sucesso mas não são persistidos."""
    payload = {
        "name": "Spambot 3000",
        "email": "spam@bot.com",
        "interest": "Automação com IA",
        "message": "Promoção não solicitada de backlinks.",
        "consent_lgpd": True,
        "honeypot": "eu_sou_um_robo"
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    assert response.json()["success"] is True

    # NÃO deve estar no banco de dados
    msg = db_session.query(ContactMessage).filter(ContactMessage.email == "spam@bot.com").first()
    assert msg is None
