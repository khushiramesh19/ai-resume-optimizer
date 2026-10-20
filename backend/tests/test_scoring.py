import pytest
from app.services.matcher import perform_skill_and_keyword_matching
from app.services.scoring import calculate_ats_score

def test_matcher_and_synonyms():
    resume_text = "Built web dashboards with React.js, TypeScript, and styled with Tailwind. Orchestrated microservices in K8s and Docker."
    jd = "Seeking a Senior Frontend Engineer proficient in React, Tailwind CSS, TypeScript, and Kubernetes."
    
    matches = perform_skill_and_keyword_matching(resume_text, jd, "Senior Frontend Engineer")
    matched_names = [k["keyword"] for k in matches["matched_keywords"]]
    
    # Check that canonical names matched through aliases
    assert "React" in matched_names
    assert "TypeScript" in matched_names
    assert "Tailwind CSS" in matched_names
    assert "Kubernetes" in matched_names

def test_deterministic_ats_scoring():
    parsed_data = {
        "raw_text": "Experienced engineer skilled in Python, FastAPI, Docker, and AWS. Architected distributed pipeline scaling 40% efficiency.",
        "sections": {
            "experience": "Senior Engineer: Built cloud services in Python and FastAPI, handling 10M requests daily.",
            "education": "B.S. in Computer Science",
            "skills": "Python, FastAPI, Docker, AWS, PostgreSQL",
            "projects": "Open source developer for microservices framework."
        },
        "achievements": {
            "metric_count": 3,
            "unique_action_verbs_count": 6,
            "bullet_count": 4,
            "action_verbs": ["built", "architected", "scaled"]
        },
        "formatting_warnings": []
    }
    
    matching_data = {
        "matched_keywords": [
            {"keyword": "Python", "frequency_in_jd": 3, "found_in_resume": True, "frequency_in_resume": 2},
            {"keyword": "FastAPI", "frequency_in_jd": 2, "found_in_resume": True, "frequency_in_resume": 2},
            {"keyword": "Docker", "frequency_in_jd": 2, "found_in_resume": True, "frequency_in_resume": 1}
        ],
        "missing_keywords": [
            {"keyword": "Redis", "frequency_in_jd": 1, "found_in_resume": False, "frequency_in_resume": 0}
        ],
        "skills_analysis": [
            {"skill": "Python", "status": "demonstrated"},
            {"skill": "FastAPI", "status": "demonstrated"},
            {"skill": "Docker", "status": "mentioned"},
            {"skill": "Redis", "status": "missing"}
        ]
    }
    
    score_result = calculate_ats_score(
        parsed_data=parsed_data,
        matching_data=matching_data,
        job_title="Senior Python Backend Engineer",
        job_description="Seeking a Senior Python Backend Engineer with FastAPI, Docker, and Redis experience."
    )
    
    assert 0 <= score_result["overall_score"] <= 100
    cat_scores = score_result["category_scores"]
    assert 0 <= cat_scores["keyword_alignment"] <= 100
    assert 0 <= cat_scores["required_skills"] <= 100
    assert 0 <= cat_scores["relevant_experience"] <= 100
    assert 0 <= cat_scores["section_completeness"] <= 100
    assert 0 <= cat_scores["formatting_parsing"] <= 100
    assert 0 <= cat_scores["achievement_quality"] <= 100
    assert len(score_result["recommendations"]) > 0
