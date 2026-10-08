"""
Arquivo: project_service.py
Responsabilidade: regras de negócio para projetos (filtros, ordenação na home, slugs e integridade).
Dados: sessões SQLAlchemy e modelo Project
Como editar: altere limites de projetos na home ou regras de ordenação padrão.
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
import re
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    CATEGORY_LABELS,
    CategoryItemOut,
    ProjectOrderItem
)


# ===== [SEÇÃO: REGRAS DE NEGÓCIO DE PROJETOS] =====
class ProjectService:

    @staticmethod
    def slugify(text: str) -> str:
        slug = re.sub(r"[^\w\s-]", "", text.lower())
        return re.sub(r"[\s_-]+", "-", slug).strip("-")

    @staticmethod
    def get_public_projects(
        db: Session,
        home: bool = False,
        category: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Project], int]:
        """Consulta projetos públicos respeitando regras da home e filtros."""
        query = db.query(Project).filter(Project.is_published == True)

        if home:
            # Regra estrita da Home: somente publicados e com show_on_home ativo
            query = query.filter(Project.show_on_home == True)
            query = query.order_by(Project.home_order.asc(), Project.created_at.desc())
            # Limite máximo de 6 projetos no grid da Home
            effective_limit = min(limit, 6)
            total = query.count()
            projects = query.limit(effective_limit).all()
            return projects, total

        if category:
            query = query.filter(Project.category == category.lower().strip())

        query = query.order_by(Project.created_at.desc())
        total = query.count()

        offset = (page - 1) * limit
        projects = query.offset(offset).limit(limit).all()
        return projects, total

    @staticmethod
    def get_public_by_slug(db: Session, slug: str) -> Project:
        """Obtém um projeto publicado pelo seu slug."""
        project = db.query(Project).filter(
            Project.slug == slug,
            Project.is_published == True
        ).first()

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado ou ainda não publicado."
            )
        return project

    @staticmethod
    def get_categories_summary(db: Session) -> List[CategoryItemOut]:
        """Retorna as categorias e a quantidade de projetos publicados em cada uma."""
        counts = dict(
            db.query(Project.category, func.count(Project.id))
            .filter(Project.is_published == True)
            .group_by(Project.category)
            .all()
        )

        result: List[CategoryItemOut] = []
        for cat_slug, cat_name in CATEGORY_LABELS.items():
            result.append(
                CategoryItemOut(
                    slug=cat_slug.value,
                    name=cat_name,
                    count=counts.get(cat_slug.value, 0)
                )
            )
        return result

    @staticmethod
    def get_admin_projects(
        db: Session,
        search: Optional[str] = None,
        category: Optional[str] = None,
        page: int = 1,
        limit: int = 50
    ) -> Tuple[List[Project], int]:
        """Listagem completa para o painel administrativo (inclui rascunhos)."""
        query = db.query(Project)

        if search:
            term = f"%{search.strip()}%"
            query = query.filter(
                (Project.title.ilike(term)) |
                (Project.summary.ilike(term)) |
                (Project.client.ilike(term))
            )

        if category:
            query = query.filter(Project.category == category.lower().strip())

        query = query.order_by(Project.home_order.asc(), Project.created_at.desc())
        total = query.count()

        offset = (page - 1) * limit
        projects = query.offset(offset).limit(limit).all()
        return projects, total

    @staticmethod
    def get_admin_by_id(db: Session, project_id: int) -> Project:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Projeto com ID {project_id} não encontrado."
            )
        return project

    @classmethod
    def create_project(cls, db: Session, payload: ProjectCreate) -> Project:
        slug = payload.slug or cls.slugify(payload.title)

        # Garante unicidade do slug
        existing = db.query(Project).filter(Project.slug == slug).first()
        if existing:
            counter = 2
            original_slug = slug
            while db.query(Project).filter(Project.slug == f"{original_slug}-{counter}").first():
                counter += 1
            slug = f"{original_slug}-{counter}"

        project = Project(
            title=payload.title,
            slug=slug,
            category=payload.category.value,
            summary=payload.summary,
            description=payload.description,
            cover_image=payload.cover_image,
            gallery=payload.gallery,
            technologies=payload.technologies,
            client=payload.client,
            year=payload.year,
            external_url=payload.external_url,
            show_on_home=payload.show_on_home,
            home_order=payload.home_order,
            is_published=payload.is_published
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

    @classmethod
    def update_project(cls, db: Session, project_id: int, payload: ProjectUpdate) -> Project:
        project = cls.get_admin_by_id(db, project_id)

        update_data = payload.model_dump(exclude_unset=True)

        # Se atualizar o slug, valida unicidade
        if "slug" in update_data and update_data["slug"]:
            new_slug = cls.slugify(update_data["slug"])
            conflict = db.query(Project).filter(
                Project.slug == new_slug,
                Project.id != project_id
            ).first()
            if conflict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"O slug '{new_slug}' já está em uso por outro projeto."
                )
            update_data["slug"] = new_slug

        # Converte enum de categoria para string se presente
        if "category" in update_data and update_data["category"]:
            update_data["category"] = update_data["category"].value

        for key, value in update_data.items():
            setattr(project, key, value)

        db.commit()
        db.refresh(project)
        return project

    @classmethod
    def delete_project(cls, db: Session, project_id: int) -> bool:
        project = cls.get_admin_by_id(db, project_id)
        db.delete(project)
        db.commit()
        return True

    @classmethod
    def toggle_home(cls, db: Session, project_id: int, show_on_home: bool) -> Project:
        project = cls.get_admin_by_id(db, project_id)
        project.show_on_home = show_on_home
        db.commit()
        db.refresh(project)
        return project

    @classmethod
    def reorder_projects(cls, db: Session, items: List[ProjectOrderItem]) -> None:
        for item in items:
            db.query(Project).filter(Project.id == item.id).update(
                {"home_order": item.home_order}
            )
        db.commit()
