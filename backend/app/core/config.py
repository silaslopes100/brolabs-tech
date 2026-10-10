"""
Arquivo: config.py
Responsabilidade: centralização de variáveis de ambiente e configurações da aplicação FastAPI.
Dados: .env
Como editar: configure variáveis adicionais em Settings com valores padrão seguros.
"""

from typing import List
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


# ===== [SEÇÃO: CONFIGURAÇÕES CENTRAIS] =====
class Settings(BaseSettings):
    # NÃO MEXER: estrutura base do Pydantic Settings
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # EDITAR AQUI: Nome da aplicação e ambiente
    PROJECT_NAME: str = "BROLABS TECH API"
    ENV: str = "development"
    DEBUG: bool = True

    # Banco de dados (SQLite local padrão)
    DATABASE_URL: str = "sqlite:///./brolabs.db"

    # Segurança e autenticação
    SECRET_KEY: str = "dev_secret_key_brolabs_tech_2026_super_secure_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    # Origens de CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Seed Admin
    ADMIN_EMAIL: str = "admin@brolabs.tech"
    ADMIN_PASSWORD: str = "admin123456"

    # Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 5

    # TODO(brolabs): Adicionar credenciais SMTP para envio real de e-mail de contato
    CONTACT_DEST_EMAIL: str = "contato@brolabs.tech"

    # Integração server-side com OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-oss-120b"

    @computed_field
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @computed_field
    @property
    def is_production(self) -> bool:
        return self.ENV.lower() == "production"


settings = Settings()
