"""
Arquivo: test_ai_briefing.py
Responsabilidade: valida o endpoint de briefing em múltiplas etapas sem chamar um provedor externo.
Dados: endpoint POST /api/contact/briefing
Como editar: use respostas simuladas em JSON para cobrir perguntas e conclusão do briefing.
"""

import json


def test_briefing_returns_next_question(client, monkeypatch):
    async def fake_request_model(_messages):
        return json.dumps({
            "reply": "Quem será o principal público que usará a plataforma?",
            "completed": False,
            "summary": None,
            "interest": "Sistemas & SaaS",
        })

    monkeypatch.setattr("app.services.ai_service._request_model", fake_request_model)
    response = client.post(
        "/api/contact/briefing",
        json={
            "interest": "Sistemas & SaaS",
            "consent_ai": True,
            "messages": [
                {"role": "assistant", "content": "Qual desafio você quer resolver?"},
                {"role": "user", "content": "Quero organizar pedidos de distribuidores."},
            ],
        },
    )

    assert response.status_code == 200
    assert response.json()["completed"] is False
    assert response.json()["summary"] is None
    assert "público" in response.json()["reply"]


def test_briefing_returns_summary_when_complete(client, monkeypatch):
    async def fake_request_model(_messages):
        return json.dumps({
            "reply": "Briefing organizado. Você poderá revisar o resumo no formulário.",
            "completed": True,
            "summary": "Plataforma para distribuidores acompanharem pedidos e estoque em tempo real.",
            "interest": "Sistemas & SaaS",
        })

    monkeypatch.setattr("app.services.ai_service._request_model", fake_request_model)
    response = client.post(
        "/api/contact/briefing",
        json={
            "interest": "Sistemas & SaaS",
            "consent_ai": True,
            "messages": [
                {"role": "assistant", "content": "Qual desafio você quer resolver?"},
                {"role": "user", "content": "Distribuidores não conseguem acompanhar pedidos."},
            ],
        },
    )

    assert response.status_code == 200
    assert response.json()["completed"] is True
    assert "Plataforma para distribuidores" in response.json()["summary"]


def test_briefing_rejects_invalid_history(client):
    response = client.post(
        "/api/contact/briefing",
        json={
            "consent_ai": True,
            "messages": [
                {"role": "assistant", "content": "Qual desafio você quer resolver?"},
            ],
        },
    )

    assert response.status_code == 422


def test_briefing_requires_ai_consent(client):
    response = client.post(
        "/api/contact/briefing",
        json={
            "consent_ai": False,
            "messages": [
                {"role": "assistant", "content": "Qual desafio você quer resolver?"},
                {"role": "user", "content": "Quero organizar pedidos de distribuidores."},
            ],
        },
    )

    assert response.status_code == 422
