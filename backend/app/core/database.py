"""
Arquivo: database.py
Responsabilidade: conexão com SQLAlchemy 2.0, gerenciamento de sessões e base declarativa.
Dados: DATABASE_URL definido em config.py
Como editar: parâmetros de pool de conexões podem ser ajustados abaixo.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# ===== [SEÇÃO: CONEXÃO COM BANCO DE DADOS] =====
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# NÃO MEXER: Criação do engine SQLAlchemy 2.0
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Dependência de injeção de sessão por requisição
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
