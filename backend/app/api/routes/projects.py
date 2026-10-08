"""
Arquivo: routes/projects.py
Responsabilidade: endpoints públicos de listagem, categorias e detalhe de projetos.
Dados: tabela projects
Como editar: parâmetros de busca ou limites padrão na rota.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.project import ProjectOut, CategoryItemOut
from app.services.project_service import ProjectService

router = APIRouter(tags=["Projetos Públicos"])


# ===== [SEÇÃO: ENDPOINTS PÚBLICOS DE PROJETOS] =====
@router.get("/projects", response_model=List[ProjectOut])
def list_projects(
    home: bool = Query(False, description="Filtrar apenas projetos marcados para o grid da Home (máx 6)"),
    category: Optional[str] = Query(None, description="Filtrar por categoria: sistemas, automacoes, sites, design, diagramacao"),
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(20, ge=1, le=50, description="Itens por página"),
    db: Session = Depends(get_db)
):
    """Lista projetos publicados com filtros opcionais de categoria ou exibição na Home."""
    projects, _ = ProjectService.get_public_projects(
        db=db,
        home=home,
        category=category,
        page=page,
        limit=limit
    )
    return projects


@router.get("/projects/{slug}", response_model=ProjectOut)
def get_project_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Obtém detalhes de um projeto publicado pelo slug."""
    return ProjectService.get_public_by_slug(db, slug)


@router.get("/categories", response_model=List[CategoryItemOut])
def list_categories(db: Session = Depends(get_db)):
    """Retorna as categorias disponíveis com a contagem de projetos publicados."""
    return ProjectService.get_categories_summary(db)
