"""
Arquivo: routes/admin_projects.py
Responsabilidade: endpoints administrativos para gestão e ordenação de projetos.
Dados: tabela projects (requer autenticação de administrador)
Como editar: permissões de perfil ou filtros avançados.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.project import (
    ProjectOut,
    ProjectCreate,
    ProjectUpdate,
    ProjectHomeToggle,
    ProjectReorderRequest
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/admin/projects", tags=["Admin - Projetos"])


# ===== [SEÇÃO: ENDPOINTS ADMINISTRATIVOS DE PROJETOS] =====
@router.get("", response_model=List[ProjectOut])
def list_admin_projects(
    search: Optional[str] = Query(None, description="Busca por título, resumo ou cliente"),
    category: Optional[str] = Query(None, description="Filtrar por categoria"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os projetos cadastrados (incluindo rascunhos) para o painel."""
    projects, _ = ProjectService.get_admin_projects(
        db=db,
        search=search,
        category=category,
        page=page,
        limit=limit
    )
    return projects


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cadastra um novo projeto no portfólio."""
    return ProjectService.create_project(db, payload)


@router.get("/{project_id}", response_model=ProjectOut)
def get_admin_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna detalhes completos do projeto para edição."""
    return ProjectService.get_admin_by_id(db, project_id)


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza dados do projeto."""
    return ProjectService.update_project(db, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove um projeto definitivamente."""
    ProjectService.delete_project(db, project_id)
    return None


@router.patch("/{project_id}/home", response_model=ProjectOut)
def toggle_home_status(
    project_id: int,
    payload: ProjectHomeToggle,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ativa ou desativa a exibição rápida do projeto na grade Bento da Home."""
    return ProjectService.toggle_home(db, project_id, payload.show_on_home)


@router.put("/reorder", status_code=status.HTTP_200_OK)
def reorder_home_projects(
    payload: ProjectReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza a ordem dos projetos exibidos na Home."""
    ProjectService.reorder_projects(db, payload.items)
    return {"message": "Ordem dos projetos atualizada com sucesso."}
