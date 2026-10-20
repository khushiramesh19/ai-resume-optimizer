import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, JSON, DateTime
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    
    overall_score = Column(Integer, nullable=False)
    category_scores = Column(JSON, nullable=False)
    matched_keywords = Column(JSON, nullable=False)
    missing_keywords = Column(JSON, nullable=False)
    skills_analysis = Column(JSON, nullable=False)
    formatting_warnings = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    parsed_sections = Column(JSON, nullable=False)
    
    created_at = Column(DateTime, default=utc_now, nullable=False)
