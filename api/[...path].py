"""
Arquivo: api/[...path].py
Responsabilidade: expor o backend FastAPI como função serverless na Vercel.
Dados: configurações do backend definidas nas variáveis de ambiente da Vercel.
Como editar: mantenha este ponto de entrada apontando para a aplicação FastAPI.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.main import app
