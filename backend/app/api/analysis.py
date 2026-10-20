import os
import uuid
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.analysis import AnalysisRecord
from app.schemas.analysis import AnalysisResponse, AnalysisListItem
from app.services.parser import parse_resume_document
from app.services.matcher import perform_skill_and_keyword_matching
from app.services.scoring import calculate_ats_score

router = APIRouter(tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db)
):
    # 1. Validation
    if not job_title.strip():
        raise HTTPException(status_code=400, detail="Target job title cannot be empty.")
    if not job_description.strip() or len(job_description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short (minimum 20 characters required).")
        
    filename = file.filename or "resume.txt"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
        
    # Read file content safely
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")
        
    file_size_mb = len(content) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    # 2. Parse Document
    try:
        parsed_data = parse_resume_document(content, filename)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Document parsing error: {str(e)}")

    # 3. Match Skills and Keywords
    matching_data = perform_skill_and_keyword_matching(
        resume_text=parsed_data["raw_text"],
        job_description=job_description,
        target_role=job_title
    )

    # 4. Calculate Deterministic ATS Score
    scoring_result = calculate_ats_score(
        parsed_data=parsed_data,
        matching_data=matching_data,
        job_title=job_title,
        job_description=job_description
    )

    # 5. Persist to Database
    record_id = str(uuid.uuid4())
    record = AnalysisRecord(
        id=record_id,
        filename=filename,
        file_type=parsed_data["file_type"],
        job_title=job_title,
        job_description=job_description,
        overall_score=scoring_result["overall_score"],
        category_scores=scoring_result["category_scores"],
        matched_keywords=matching_data["matched_keywords"],
        missing_keywords=matching_data["missing_keywords"],
        skills_analysis=matching_data["skills_analysis"],
        formatting_warnings=parsed_data["formatting_warnings"],
        recommendations=scoring_result["recommendations"],
        parsed_sections={
            "contact": parsed_data["contact"],
            "sections": parsed_data["sections"],
            "word_count": parsed_data["word_count"],
            "character_count": parsed_data["character_count"],
            "achievements": parsed_data["achievements"]
        }
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AnalysisResponse(
        id=record.id,
        filename=record.filename,
        file_type=record.file_type,
        job_title=record.job_title,
        job_description=record.job_description,
        overall_score=record.overall_score,
        category_scores=record.category_scores,
        matched_keywords=record.matched_keywords,
        missing_keywords=record.missing_keywords,
        skills_analysis=record.skills_analysis,
        formatting_warnings=record.formatting_warnings,
        recommendations=record.recommendations,
        parsed_sections=record.parsed_sections,
        created_at=record.created_at.isoformat()
    )

@router.get("/analyses", response_model=List[AnalysisListItem])
def list_analyses(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).all()
    return [
        AnalysisListItem(
            id=r.id,
            filename=r.filename,
            job_title=r.job_title,
            overall_score=r.overall_score,
            created_at=r.created_at.isoformat()
        )
        for r in records
    ]

@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_detail(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return AnalysisResponse(
        id=record.id,
        filename=record.filename,
        file_type=record.file_type,
        job_title=record.job_title,
        job_description=record.job_description,
        overall_score=record.overall_score,
        category_scores=record.category_scores,
        matched_keywords=record.matched_keywords,
        missing_keywords=record.missing_keywords,
        skills_analysis=record.skills_analysis,
        formatting_warnings=record.formatting_warnings,
        recommendations=record.recommendations,
        parsed_sections=record.parsed_sections,
        created_at=record.created_at.isoformat()
    )

@router.delete("/analyses/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(record)
    db.commit()
    return None
