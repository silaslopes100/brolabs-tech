"""
Arquivo: tests/conftest.py
Responsabilidade: fixtures de teste com banco SQLite em memória, cliente HTTP de teste e usuário autenticado.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.database import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.project import Project
from app.main import app

# Banco de dados SQLite isolado em memória para os testes
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db_session):
    user = User(
        email="test_admin@brolabs.tech",
        name="Admin Teste",
        hashed_password=get_password_hash("senha_teste_123"),
        is_active=True,
        is_superuser=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers(admin_user):
    token = create_access_token(subject=str(admin_user.id))
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def seed_projects(db_session):
    projects = [
        Project(
            title="SaaS Enterprise Analytics",
            slug="saas-enterprise-analytics",
            category="sistemas",
            summary="Plataforma de alta escala para processamento de métricas.",
            description="Estudo de caso detalhado sobre a arquitetura distribuída.",
            cover_image="/media/test1.webp",
            technologies=["React", "FastAPI", "PostgreSQL"],
            show_on_home=True,
            home_order=1,
            is_published=True
        ),
        Project(
            title="Agente Autônomo de Vendas",
            slug="agente-autonomo-vendas",
            category="automacoes",
            summary="Fluxo de triagem e qualificação com LLMs integradas.",
            description="Implementação de agentes inteligentes com baixa latência.",
            cover_image="/media/test2.webp",
            technologies=["Python", "LangChain", "OpenAI"],
            show_on_home=True,
            home_order=2,
            is_published=True
        ),
        Project(
            title="Portal Institucional Fintech",
            slug="portal-institucional-fintech",
            category="sites",
            summary="Landing page e portal de produtos financeiros.",
            description="Design minimalista e carregamento instantâneo.",
            cover_image="/media/test3.webp",
            technologies=["Next.js", "Tailwind CSS"],
            show_on_home=False,
            home_order=0,
            is_published=True
        ),
        Project(
            title="Rascunho Não Publicado",
            slug="rascunho-nao-publicado",
            category="sistemas",
            summary="Projeto ainda em fase de sigilo.",
            description="Conteúdo interno em desenvolvimento.",
            cover_image="/media/test4.webp",
            technologies=["FastAPI"],
            show_on_home=True,  # marcado na home mas despublicado: NÃO deve aparecer na home pública!
            home_order=0,
            is_published=False
        ),
    ]
    for p in projects:
        db_session.add(p)
    db_session.commit()
    return projects
