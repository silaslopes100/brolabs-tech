"""
Arquivo: schemas/project.py
Responsabilidade: schemas Pydantic v2 para validação e serialização de Projetos da BROLABS TECH.
Dados: DTOs de entrada e saída da API de Projetos
Como editar: adicione campos opcionais mantendo compatibilidade com o modelo Project.
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
import re


# ===== [SEÇÃO: CATEGORIAS FIXAS] =====
class ProjectCategoryEnum(str, Enum):
    # NÃO MEXER: enumeração estrita definida no briefing
    sistemas = "sistemas"
    automacoes = "automacoes"
    sites = "sites"
    design = "design"
    diagramacao = "diagramacao"


CATEGORY_LABELS = {
    ProjectCategoryEnum.sistemas: "Sistemas",
    ProjectCategoryEnum.automacoes: "Automações",
    ProjectCategoryEnum.sites: "Sites",
    ProjectCategoryEnum.design: "Design",
    ProjectCategoryEnum.diagramacao: "Diagramação"
}


# ===== [SEÇÃO: SCHEMAS DE ENTRADA / CRIAÇÃO] =====
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Título do projeto")
    slug: Optional[str] = Field(None, max_length=220, description="Slug único da URL (gerado automaticamente se nulo)")
    category: ProjectCategoryEnum = Field(..., description="Categoria fixa do projeto")
    summary: str = Field(..., min_length=10, max_length=200, description="Resumo para o card (máx. 160-200 caracteres)")
    description: str = Field(..., min_length=20, description="Estudo de caso detalhado")
    cover_image: str = Field(..., description="URL ou caminho da imagem de capa")
    gallery: List[str] = Field(default_factory=list, description="Lista de imagens adicionais")
    technologies: List[str] = Field(default_factory=list, description="Tecnologias utilizadas")
    client: Optional[str] = Field(None, max_length=120, description="Nome do cliente (opcional)")
    year: int = Field(default=2026, ge=2020, le=2035, description="Ano de execução")
    external_url: Optional[str] = Field(None, description="Link para o produto em produção")
    show_on_home: bool = Field(default=False, description="Exibir na grade bento da Home")
    home_order: int = Field(default=0, ge=0, description="Posição de ordenação na Home")
    is_published: bool = Field(default=True, description="Status de publicação")

    @field_validator("slug", mode="before")
    def generate_slug_if_empty(cls, v, values):
        if not v and "title" in values.data:
            title = values.data["title"]
            slug = re.sub(r"[^\w\s-]", "", title.lower())
            slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
            return slug
        return v


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    slug: Optional[str] = Field(None, max_length=220)
    category: Optional[ProjectCategoryEnum] = None
    summary: Optional[str] = Field(None, min_length=10, max_length=200)
    description: Optional[str] = None
    cover_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    client: Optional[str] = None
    year: Optional[int] = Field(None, ge=2020, le=2035)
    external_url: Optional[str] = None
    show_on_home: Optional[bool] = None
    home_order: Optional[int] = Field(None, ge=0)
    is_published: Optional[bool] = None


class ProjectHomeToggle(BaseModel):
    show_on_home: bool


class ProjectOrderItem(BaseModel):
    id: int
    home_order: int


class ProjectReorderRequest(BaseModel):
    items: List[ProjectOrderItem]


# ===== [SEÇÃO: SCHEMAS DE RESPOSTA] =====
class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    category_label: Optional[str] = None
    summary: str
    description: str
    cover_image: str
    gallery: List[str]
    technologies: List[str]
    client: Optional[str] = None
    year: int
    external_url: Optional[str] = None
    show_on_home: bool
    home_order: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryItemOut(BaseModel):
    slug: str
    name: str
    count: int
