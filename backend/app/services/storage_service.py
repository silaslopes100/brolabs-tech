"""
Arquivo: storage_service.py
Responsabilidade: interface de armazenamento de mídias e implementação local com conversão WebP e redimensionamento.
Dados: pasta UPLOAD_DIR
Como editar: para integrar AWS S3 ou Supabase Storage, implemente a classe S3StorageService herdando de StorageService.
"""

from abc import ABC, abstractmethod
import io
import os
import uuid
from typing import Dict, Tuple
from PIL import Image
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings


# ===== [SEÇÃO: INTERFACE DE ARMAZENAMENTO] =====
class StorageService(ABC):
    """Interface abstrata para armazenamento de arquivos e imagens."""

    @abstractmethod
    async def save_image(self, file: UploadFile) -> Dict[str, str]:
        """Salva uma imagem, gerando versões WebP responsivas (800w e 1600w)."""
        pass

    @abstractmethod
    def delete_file(self, file_path: str) -> bool:
        """Exclui um arquivo armazenado."""
        pass


# ===== [SEÇÃO: IMPLEMENTAÇÃO LOCAL (DESENVOLVIMENTO & PRODUÇÃO SIMPLES)] =====
class LocalStorageService(StorageService):
    def __init__(self, upload_dir: str = settings.UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_image(self, file: UploadFile) -> Dict[str, str]:
        # Validação de tamanho (máximo 5MB)
        content = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Arquivo muito grande. O tamanho máximo permitido é {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # Validação do tipo real através do Pillow
        try:
            image = Image.open(io.BytesIO(content))
            image.verify()
            # Reabre a imagem pois o verify invalida o cursor
            image = Image.open(io.BytesIO(content))
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de imagem inválido ou corrompido. Envie JPEG, PNG ou WebP."
            )

        # Normalização do modo de cor (RGBA para WebP com transparência, RGB para sem)
        if image.mode in ("P", "1"):
            image = image.convert("RGBA")
        elif image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")

        file_id = uuid.uuid4().hex[:12]
        base_name = f"brolabs_{file_id}"

        # Geração dos dois tamanhos: 800w e 1600w
        sizes = [("800w", 800), ("1600w", 1600)]
        urls: Dict[str, str] = {}

        for suffix, target_width in sizes:
            width, height = image.size
            if width > target_width:
                aspect = height / width
                new_height = int(target_width * aspect)
                resized = image.resize((target_width, new_height), Image.Resampling.LANCZOS)
            else:
                resized = image.copy()

            out_filename = f"{base_name}_{suffix}.webp"
            out_path = os.path.join(self.upload_dir, out_filename)
            resized.save(out_path, "WEBP", quality=82, method=6)

            urls[suffix] = f"/media/{out_filename}"

        # Define URL canônica padrão (800w como capa base)
        urls["url"] = urls["800w"]
        return urls

    def delete_file(self, file_path: str) -> bool:
        try:
            filename = os.path.basename(file_path)
            full_path = os.path.join(self.upload_dir, filename)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
        except Exception:
            pass
        return False


# Injetor padrão de serviço de armazenamento
# EDITAR AQUI: para trocar por S3 ou Supabase, altere a instância retornada abaixo
def get_storage_service() -> StorageService:
    return LocalStorageService()
