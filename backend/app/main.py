"""
Arquivo: main.py
Responsabilidade: ponto de entrada do backend FastAPI da BROLABS TECH, configuração de CORS, rotas e media estática.
Dados: app/core/config.py
Como editar: adicione novos roteadores ou middlewares conforme a evolução dos módulos.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import auth, health, projects, admin_projects, uploads, contact


# ===== [SEÇÃO: CICLO DE VIDA E INICIALIZAÇÃO] =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Garante criação de tabelas em SQLite / desenvolvimento
    Base.metadata.create_all(bind=engine)

    # Garante diretório de uploads
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API institucional da BROLABS TECH — Hub de Inovação Digital",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan
)


# ===== [SEÇÃO: MIDDLEWARES E CORS] =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=(
        r"https?://(?:localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):3000"
        if not settings.is_production
        else None
    ),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ===== [SEÇÃO: ROTAS DA API] =====
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(admin_projects.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")
app.include_router(contact.router, prefix="/api")

# Pasta para servir imagens carregadas localmente
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.UPLOAD_DIR), name="media")


@app.get("/")
def root():
    return {
        "message": "BROLABS TECH API operacional.",
        "status": "online",
        "docs": "/docs"
    }
