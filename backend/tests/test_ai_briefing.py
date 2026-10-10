"""
Arquivo: test_ai_briefing.py
Responsabilidade: valida o endpoint de briefing em múltiplas etapas sem chamar um provedor externo.
Dados: endpoint POST /api/contact/briefing
Como editar: use respostas simuladas em JSON para cobrir perguntas e conclusão do briefing.
"""

import asyncio
import json


def test_briefing_uses_openrouter_request_and_parses_response(monkeypatch):
    from app.core.config import settings
    from app.schemas.ai import BriefingMessage, BriefingRequest
    from app.services.ai_service import generate_project_briefing

    expected_content = json.dumps({
        "reply": "Qual resultado você espera alcançar?",
        "completed": False,
        "summary": None,
        "interest": "Sistemas & SaaS",
    })
    captured = {}

    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {"choices": [{"message": {"content": expected_content}}]}

    class FakeAsyncClient:
        def __init__(self, **_kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *_args):
            return None

        async def post(self, url, *, headers, json):
            captured.update(url=url, headers=headers, payload=json)
            return FakeResponse()

    monkeypatch.setattr(settings, "OPENROUTER_API_KEY", "test-key")
    monkeypatch.setattr("app.services.ai_service.httpx.AsyncClient", FakeAsyncClient)

    result = asyncio.run(
        generate_project_briefing(
            BriefingRequest(
                interest="Sistemas & SaaS",
                messages=[
                    BriefingMessage(role="assistant", content="Qual desafio você quer resolver?"),
                    BriefingMessage(role="user", content="Preciso organizar pedidos."),
                ],
            )
        )
    )

    assert result.reply == "Qual resultado você espera alcançar?"
    assert captured["url"] == "https://openrouter.ai/api/v1/chat/completions"
    assert captured["headers"]["Authorization"] == "Bearer test-key"
    assert captured["payload"]["model"] == settings.OPENROUTER_MODEL
    assert captured["payload"]["messages"][-1]["content"] == "Preciso organizar pedidos."


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
            "messages": [
                {"role": "assistant", "content": "Qual desafio você quer resolver?"},
            ],
        },
    )

    assert response.status_code == 422


def test_briefing_cors_allows_local_network_frontend(client):
    response = client.options(
        "/api/contact/briefing",
        headers={
            "Origin": "http://192.168.0.4:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://192.168.0.4:3000"
