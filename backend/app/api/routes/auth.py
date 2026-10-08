"""
Arquivo: routes/auth.py
Responsabilidade: endpoints de autenticação de administradores (login, logout, perfil me).
Dados: cookies httpOnly e tokens Bearer JWT
Como editar: tempos de expiração ou cookies adicionais.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticação"])


# ===== [SEÇÃO: ENDPOINTS DE AUTENTICAÇÃO] =====
@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """Realiza o login de administradores, definindo cookie httpOnly seguro."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conta inativa. Contate o suporte da BROLABS TECH."
        )

    access_token = create_access_token(subject=str(user.id))

    # Define cookie httpOnly para segurança contra XSS
    response.set_cookie(
        key="brolabs_access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=settings.is_production,
        path="/"
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )


@router.post("/logout")
def logout(response: Response):
    """Encerra a sessão removendo o cookie httpOnly."""
    response.delete_cookie(
        key="brolabs_access_token",
        path="/",
        samesite="lax"
    )
    return {"message": "Sessão encerrada com sucesso."}


@router.get("/me", response_model=UserOut)
def get_current_admin(current_user: User = Depends(get_current_user)):
    """Retorna os dados do administrador autenticado."""
    return current_user
