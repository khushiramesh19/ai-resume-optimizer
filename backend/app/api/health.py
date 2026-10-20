import os
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    gemini_configured = bool(settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", ""))
    openai_configured = bool(settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", ""))
    
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_status": {
            "gemini_active": gemini_configured,
            "openai_active": openai_configured,
            "provider": "gemini" if gemini_configured else ("openai" if openai_configured else "rule_based_fallback")
        }
    }
