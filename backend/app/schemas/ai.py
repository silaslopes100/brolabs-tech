"""
Arquivo: ai.py
Responsabilidade: contratos validados para o briefing de projeto assistido por IA.
Dados: mensagens do chat de contato
Como editar: mantenha limites de conteúdo para controlar o tamanho dos prompts enviados ao provedor.
"""

from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


class BriefingMessage(BaseModel):
    role: Literal["assistant", "user"]
    content: str = Field(..., min_length=1, max_length=2000)


class BriefingRequest(BaseModel):
    messages: list[BriefingMessage] = Field(..., min_length=1, max_length=24)
    interest: Optional[str] = Field(None, max_length=80)

    @model_validator(mode="after")
    def validate_total_content(self):
        if sum(len(message.content) for message in self.messages) > 16000:
            raise ValueError("O histórico do briefing excede o limite permitido.")
        if self.messages[-1].role != "user":
            raise ValueError("A última mensagem do briefing deve ser do usuário.")
        return self


class BriefingResponse(BaseModel):
    reply: str = Field(..., min_length=1, max_length=2000)
    completed: bool
    summary: Optional[str] = Field(None, max_length=3000)
    interest: Optional[str] = Field(None, max_length=80)
