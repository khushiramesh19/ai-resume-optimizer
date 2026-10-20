from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class CategoryScores(BaseModel):
    keyword_alignment: float = Field(..., description="Keyword alignment (25%)")
    required_skills: float = Field(..., description="Required skill coverage (25%)")
    relevant_experience: float = Field(..., description="Relevant experience (20%)")
    section_completeness: float = Field(..., description="Section completeness (10%)")
    formatting_parsing: float = Field(..., description="Formatting & parsing (10%)")
    achievement_quality: float = Field(..., description="Achievement quality (10%)")

class KeywordItem(BaseModel):
    keyword: str
    frequency_in_jd: int
    found_in_resume: bool
    frequency_in_resume: int

class SkillMatchItem(BaseModel):
    skill: str
    category: str
    status: str  # "demonstrated", "mentioned", "missing"
    evidence: Optional[str] = None
    suggestion: str

class FormattingWarning(BaseModel):
    severity: str  # "high", "medium", "low"
    title: str
    detail: str
    fix_suggestion: str

class RecommendationItem(BaseModel):
    priority: str  # "high", "medium", "low"
    category: str
    title: str
    description: str
    action_type: str  # "rewrite", "add_skill", "formatting", "experience"

class AnalysisResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    job_title: str
    job_description: str
    overall_score: int
    category_scores: CategoryScores
    matched_keywords: List[KeywordItem]
    missing_keywords: List[KeywordItem]
    skills_analysis: List[SkillMatchItem]
    formatting_warnings: List[FormattingWarning]
    recommendations: List[RecommendationItem]
    parsed_sections: Dict[str, Any]
    created_at: str

class AnalysisListItem(BaseModel):
    id: str
    filename: str
    job_title: str
    overall_score: int
    created_at: str

class RewriteRequest(BaseModel):
    text: str
    style: str = "professional"  # "professional", "concise", "technical", "impact-focused"
    section_type: str = "bullet"  # "bullet", "summary", "headline", "project"
    target_role: Optional[str] = ""

class RewriteResponse(BaseModel):
    original: str
    rewritten: str
    style: str
    improvements_made: List[str]
    facts_preserved: bool
    notes: Optional[str] = None
    ai_configured: bool

class InterviewQuestionItem(BaseModel):
    category: str  # "technical", "project", "behavioral", "hr"
    question: str
    assessment_focus: str
    suggested_approach: str
    sample_outline: str

class InterviewResponse(BaseModel):
    role: str
    questions: List[InterviewQuestionItem]
    ai_configured: bool
