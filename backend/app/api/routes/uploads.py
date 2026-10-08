"""
Arquivo: routes/uploads.py
Responsabilidade: endpoint administrativo para upload de imagens com conversão WebP e dupla resolução.
Dados: interface StorageService
Como editar: ajuste de limites de tamanho ou tipos suportados.
"""

from typing import Dict
from fastapi import APIRouter, Depends, File, UploadFile
from app.api.deps import get_current_user
from app.models.user import User
from app.services.storage_service import StorageService, get_storage_service

router = APIRouter(prefix="/admin/uploads", tags=["Admin - Uploads"])


# ===== [SEÇÃO: ENDPOINT DE UPLOAD DE IMAGENS] =====
@router.post("", response_model=Dict[str, str])
async def upload_image(
    file: UploadFile = File(...),
    storage: StorageService = Depends(get_storage_service),
    current_user: User = Depends(get_current_user)
):
    """
    Recebe imagem via multipart/form-data, valida formato, gera WebP em 800w e 1600w
    e retorna URLs relativas para visualização imediata.
    """
    result = await storage.save_image(file)
    return result
