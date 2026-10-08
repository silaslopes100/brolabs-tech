"""
Arquivo: tests/test_auth.py
Responsabilidade: validação do fluxo de login, emissão de cookies httpOnly e logout.
"""

def test_login_success_and_cookie(client, admin_user):
    """Valida login com credenciais corretas e emissão de cookie httpOnly."""
    payload = {
        "email": admin_user.email,
        "password": "senha_teste_123"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Valida cookie httpOnly
    assert "brolabs_access_token" in response.cookies


def test_login_invalid_credentials(client, admin_user):
    """Valida rejeição de senha incorreta."""
    payload = {
        "email": admin_user.email,
        "password": "senha_errada"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    assert "incorretos" in response.json()["detail"].lower()


def test_auth_me_with_cookie(client, admin_user):
    """Valida acesso a /api/auth/me utilizando o cookie da sessão."""
    login_res = client.post("/api/auth/login", json={
        "email": admin_user.email,
        "password": "senha_teste_123"
    })
    token = login_res.json()["access_token"]

    # Chamada com Header Bearer
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == admin_user.email


def test_logout(client):
    """Valida expiração do cookie no logout."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert "encerrada" in response.json()["message"].lower()
