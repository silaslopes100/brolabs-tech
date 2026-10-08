"""
Arquivo: tests/test_projects.py
Responsabilidade: validação das regras de negócio de projetos, regras da home, filtros e endpoints admin.
"""

def test_home_projects_rule(client, seed_projects):
    """
    CRÍTICO: Valida que a Home exibe APENAS projetos com is_published=True AND show_on_home=True.
    O projeto rascunho (show_on_home=True, mas is_published=False) NÃO pode aparecer.
    """
    response = client.get("/api/projects?home=true")
    assert response.status_code == 200
    data = response.json()

    slugs = [p["slug"] for p in data]
    assert "saas-enterprise-analytics" in slugs
    assert "agente-autonomo-vendas" in slugs
    # Projeto sem flag da home não deve aparecer
    assert "portal-institucional-fintech" not in slugs
    # Rascunho despublicado nunca deve aparecer na home pública
    assert "rascunho-nao-publicado" not in slugs
    assert len(data) == 2


def test_category_filter(client, seed_projects):
    """Valida o filtro de categoria na listagem geral de projetos."""
    response = client.get("/api/projects?category=automacoes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "agente-autonomo-vendas"
    assert data[0]["category"] == "automacoes"


def test_categories_endpoint(client, seed_projects):
    """Valida a contagem de projetos por categoria pública."""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    counts = {c["slug"]: c["count"] for c in data}
    assert counts["sistemas"] == 1  # Apenas o publicado
    assert counts["automacoes"] == 1
    assert counts["sites"] == 1
    assert counts["design"] == 0


def test_project_detail_by_slug(client, seed_projects):
    """Valida obtenção por slug e bloqueio de rascunhos no endpoint público."""
    res_pub = client.get("/api/projects/saas-enterprise-analytics")
    assert res_pub.status_code == 200
    assert res_pub.json()["title"] == "SaaS Enterprise Analytics"

    res_draft = client.get("/api/projects/rascunho-nao-publicado")
    assert res_draft.status_code == 404


def test_admin_protection(client):
    """Garante que rotas /api/admin/* rejeitam acesso não autenticado com 401."""
    res = client.get("/api/admin/projects")
    assert res.status_code == 401


def test_admin_create_and_toggle(client, auth_headers):
    """Valida criação de projeto pelo admin e toggle de exibição na Home."""
    payload = {
        "title": "Sistema CRM Personalizado",
        "category": "sistemas",
        "summary": "Gestão completa de leads e integração com WhatsApp.",
        "description": "Estudo de caso do CRM customizado com pipeline kanban.",
        "cover_image": "/media/crm.webp",
        "technologies": ["React", "FastAPI", "PostgreSQL"],
        "client": "Grupo Alpha",
        "year": 2026,
        "show_on_home": False,
        "is_published": True
    }

    create_res = client.post("/api/admin/projects", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]
    slug = create_res.json()["slug"]
    assert slug == "sistema-crm-personalizado"

    # Não deve estar na home
    home_before = client.get("/api/projects?home=true").json()
    assert slug not in [p["slug"] for p in home_before]

    # Ativa na home via toggle PATCH
    toggle_res = client.patch(
        f"/api/admin/projects/{created_id}/home",
        json={"show_on_home": True},
        headers=auth_headers
    )
    assert toggle_res.status_code == 200
    assert toggle_res.json()["show_on_home"] is True

    # Agora DEVE estar na home
    home_after = client.get("/api/projects?home=true").json()
    assert slug in [p["slug"] for p in home_after]
