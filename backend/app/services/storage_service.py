"""
Arquivo: storage_service.py
Responsabilidade: interface de armazenamento de mídias e implementação local com conversão WebP e redimensionamento.
Dados: UPLOAD_DIR ou credenciais Vercel Blob definidas no ambiente.
Como editar: selecione o adaptador em get_storage_service() ou implemente StorageService.
"""

from abc import ABC, abstractmethod
import io
import os
import uuid
from typing import Dict, Tuple
from PIL import Image
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings


async def _prepare_image_variants(file: UploadFile) -> Dict[str, bytes]:
    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Arquivo muito grande. O tamanho máximo permitido é {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    try:
        image = Image.open(io.BytesIO(content))
        image.verify()
        image = Image.open(io.BytesIO(content))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de imagem inválido ou corrompido. Envie JPEG, PNG ou WebP."
        )

    if image.mode in ("P", "1"):
        image = image.convert("RGBA")
    elif image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGB")

    variants: Dict[str, bytes] = {}
    for suffix, target_width in (("800w", 800), ("1600w", 1600)):
        width, height = image.size
        if width > target_width:
            resized = image.resize(
                (target_width, int(height / width * target_width)),
                Image.Resampling.LANCZOS,
            )
        else:
            resized = image.copy()

        output = io.BytesIO()
        resized.save(output, "WEBP", quality=82, method=6)
        variants[suffix] = output.getvalue()

    return variants


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
        variants = await _prepare_image_variants(file)
        file_id = uuid.uuid4().hex[:12]
        base_name = f"brolabs_{file_id}"
        urls: Dict[str, str] = {}

        for suffix, content in variants.items():
            out_filename = f"{base_name}_{suffix}.webp"
            out_path = os.path.join(self.upload_dir, out_filename)
            with open(out_path, "wb") as image_file:
                image_file.write(content)
            urls[suffix] = f"/media/{out_filename}"

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


class VercelBlobStorageService(StorageService):
    async def save_image(self, file: UploadFile) -> Dict[str, str]:
        from vercel.blob import AsyncBlobClient

        variants = await _prepare_image_variants(file)
        file_id = uuid.uuid4().hex[:12]
        client = AsyncBlobClient()
        urls: Dict[str, str] = {}

        for suffix, content in variants.items():
            blob = await client.put(
                f"brolabs_{file_id}_{suffix}.webp",
                content,
                access="public",
                content_type="image/webp",
            )
            urls[suffix] = dict(blob)["url"]

        urls["url"] = urls["800w"]
        return urls

    def delete_file(self, file_path: str) -> bool:
        from vercel.blob import delete

        delete(file_path)
        return True


# Injetor padrão de serviço de armazenamento
# EDITAR AQUI: para trocar por S3 ou Supabase, altere a instância retornada abaixo
def get_storage_service() -> StorageService:
    if settings.STORAGE_BACKEND == "vercel_blob":
        return VercelBlobStorageService()
    return LocalStorageService()
