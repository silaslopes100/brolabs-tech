"""
Arquivo: routes/health.py
Responsabilidade: endpoint de verificação de integridade operacional do backend.
Dados: conexão com banco de dados e versão da aplicação
Como editar: adicione verificações de serviços externos (S3, Redis, SMTP) se houver.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter(tags=["Health"])


# ===== [SEÇÃO: HEALTH CHECK] =====
@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Verifica saúde da API e conectividade com a base de dados."""
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "service": "BROLABS TECH API",
        "database": db_status
    }
