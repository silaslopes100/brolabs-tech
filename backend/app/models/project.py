"""
Arquivo: project.py
Responsabilidade: modelo ORM para os projetos do portfólio da BROLABS TECH.
Dados: tabela 'projects'
Como editar: categorias suportadas e campos complementares de case study.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from app.core.database import Base


# ===== [SEÇÃO: MODELO PROJECT] =====
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    # Identificação e URL
    title = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    category = Column(String(50), index=True, nullable=False)  # sistemas, automacoes, sites, design, diagramacao

    # Conteúdo descritivo
    summary = Column(String(200), nullable=False)  # até 160-200 chars
    description = Column(Text, nullable=False)

    # Mídias
    cover_image = Column(String(500), nullable=False)
    gallery = Column(JSON, default=list, nullable=False)  # lista de URLs/caminhos de imagem

    # Metadados
    technologies = Column(JSON, default=list, nullable=False)  # lista de strings: ["React", "FastAPI"]
    client = Column(String(120), nullable=True)
    year = Column(Integer, default=2026, nullable=False)
    external_url = Column(String(500), nullable=True)

    # Regras de exibição
    show_on_home = Column(Boolean, default=False, index=True, nullable=False)
    home_order = Column(Integer, default=0, index=True, nullable=False)
    is_published = Column(Boolean, default=True, index=True, nullable=False)

    # Timestamps
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
