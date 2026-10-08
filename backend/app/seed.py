"""
Arquivo: seed.py
Responsabilidade: script CLI para semear o usuário administrador inicial e dados essenciais.
Dados: ADMIN_EMAIL e ADMIN_PASSWORD configurados no ambiente (.env).
Como editar: execute com 'python -m app.seed' a partir do diretório backend/.
"""

import sys
from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User


# ===== [SEÇÃO: SEED DE ADMIN] =====
def seed_admin_user() -> None:
    """Cria ou atualiza o usuário administrador com base nas variáveis de ambiente."""
    print("Iniciando processo de seed da BROLABS TECH...")

    # Garante criação das tabelas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin_email = settings.ADMIN_EMAIL.lower().strip()
        admin_password = settings.ADMIN_PASSWORD

        if not admin_password or len(admin_password) < 6:
            print("ERRO: ADMIN_PASSWORD não configurada ou muito curta (mínimo 6 caracteres).")
            sys.exit(1)

        user = db.query(User).filter(User.email == admin_email).first()

        if user:
            print(f"Usuário admin '{admin_email}' já existe. Atualizando senha e status ativo...")
            user.hashed_password = get_password_hash(admin_password)
            user.is_active = True
            user.is_superuser = True
        else:
            print(f"Criando novo usuário administrador para '{admin_email}'...")
            user = User(
                email=admin_email,
                name="Silas / Marcos (Admin)",
                hashed_password=get_password_hash(admin_password),
                is_active=True,
                is_superuser=True
            )
            db.add(user)

        db.commit()
        print("✓ Administrador configurado com sucesso!")
        print(f"  E-mail: {admin_email}")
        print("  Senha: [definida via ADMIN_PASSWORD no .env]")

    except Exception as exc:
        db.rollback()
        print(f"ERRO durante o seed: {exc}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_user()
