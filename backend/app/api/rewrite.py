from fastapi import APIRouter, HTTPException
from app.schemas.analysis import RewriteRequest, RewriteResponse
from app.services.ai_service import rewrite_resume_content

router = APIRouter(tags=["AI Rewrite"])

@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_bullet_or_summary(req: RewriteRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text to rewrite cannot be empty.")
    
    result = await rewrite_resume_content(
        text=req.text,
        style=req.style,
        section_type=req.section_type,
        target_role=req.target_role
    )
    return result
