from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.analysis import AnalysisRecord
from app.schemas.analysis import InterviewResponse
from app.services.interview_service import generate_interview_preparation

router = APIRouter(tags=["Interview Coach"])

@router.post("/interview/{analysis_id}", response_model=InterviewResponse)
async def generate_interview_for_analysis(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
        
    result = await generate_interview_preparation(
        role=record.job_title,
        skills_list=record.skills_analysis,
        parsed_sections=record.parsed_sections
    )
    return result

@router.post("/interview-generic", response_model=InterviewResponse)
async def generate_generic_interview(role: str = "Full Stack Engineer"):
    result = await generate_interview_preparation(
        role=role,
        skills_list=[
            {"skill": "React", "status": "demonstrated"},
            {"skill": "TypeScript", "status": "demonstrated"},
            {"skill": "Python / FastAPI", "status": "demonstrated"},
            {"skill": "PostgreSQL", "status": "mentioned"},
            {"skill": "Docker", "status": "mentioned"}
        ],
        parsed_sections={}
    )
    return result
