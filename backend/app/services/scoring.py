import re
from typing import Dict, Any, List

def calculate_ats_score(
    parsed_data: Dict[str, Any],
    matching_data: Dict[str, Any],
    job_title: str,
    job_description: str
) -> Dict[str, Any]:
    """Calculate deterministic, normalized ATS compatibility score across 6 weighted categories."""
    
    # 1. Keyword Alignment (Weight: 25%)
    matched_kws = matching_data.get("matched_keywords", [])
    missing_kws = matching_data.get("missing_keywords", [])
    total_kws = len(matched_kws) + len(missing_kws)
    
    if total_kws > 0:
        # Weight by JD frequency
        matched_weight = sum(item["frequency_in_jd"] for item in matched_kws)
        total_weight = sum(item["frequency_in_jd"] for item in matched_kws + missing_kws)
        kw_ratio = (matched_weight / total_weight) if total_weight > 0 else 0.0
        keyword_score = min(100.0, max(0.0, kw_ratio * 100.0))
    else:
        keyword_score = 70.0  # neutral if JD had few distinct keywords
        
    # 2. Required Skill Coverage (Weight: 25%)
    skills_list = matching_data.get("skills_analysis", [])
    if skills_list:
        demonstrated = sum(1 for s in skills_list if s["status"] == "demonstrated")
        mentioned = sum(1 for s in skills_list if s["status"] == "mentioned")
        # Demonstrated skills give full weight (1.0), mentioned give partial (0.6)
        effective_matched = (demonstrated * 1.0) + (mentioned * 0.6)
        skill_score = min(100.0, max(0.0, (effective_matched / len(skills_list)) * 100.0))
    else:
        skill_score = 70.0
        
    # 3. Relevant Experience (Weight: 20%)
    sections = parsed_data.get("sections", {})
    exp_text = sections.get("experience", "") + "\n" + sections.get("projects", "")
    exp_words = len(exp_text.split())
    
    # Check if target role keywords appear in experience
    role_words = [w.lower() for w in job_title.split() if len(w) > 3]
    role_matches = sum(1 for w in role_words if w in exp_text.lower())
    role_factor = (role_matches / len(role_words)) if role_words else 1.0
    
    # Length & bullet depth score
    exp_volume_score = min(100.0, (exp_words / 250.0) * 100.0) if exp_words > 0 else 20.0
    experience_score = (exp_volume_score * 0.6) + (role_factor * 100.0 * 0.4)
    experience_score = min(100.0, max(0.0, experience_score))
    
    # 4. Section Completeness (Weight: 10%)
    essential_sections = ["experience", "education", "skills"]
    bonus_sections = ["summary", "projects", "certifications"]
    
    essential_found = sum(1 for sec in essential_sections if len(sections.get(sec, "").strip()) > 20)
    bonus_found = sum(1 for sec in bonus_sections if len(sections.get(sec, "").strip()) > 20)
    
    section_score = (essential_found / len(essential_sections) * 70.0) + (min(2, bonus_found) / 2.0 * 30.0)
    section_score = min(100.0, max(0.0, section_score))
    
    # 5. Formatting & Parsing (Weight: 10%)
    warnings = parsed_data.get("formatting_warnings", [])
    format_deduction = 0.0
    for w in warnings:
        sev = w.get("severity", "medium")
        if sev == "high":
            format_deduction += 25.0
        elif sev == "medium":
            format_deduction += 10.0
        else:
            format_deduction += 5.0
    formatting_score = max(20.0, 100.0 - format_deduction)
    
    # 6. Achievement Quality (Weight: 10%)
    achieve = parsed_data.get("achievements", {})
    metrics_count = achieve.get("metric_count", 0)
    verbs_count = achieve.get("unique_action_verbs_count", 0)
    bullet_count = achieve.get("bullet_count", 0)
    
    # Scoring metric density and action verbs
    metric_subscore = min(50.0, (metrics_count / 5.0) * 50.0)
    verb_subscore = min(50.0, (verbs_count / 8.0) * 50.0)
    achievement_score = metric_subscore + verb_subscore
    achievement_score = min(100.0, max(20.0, achievement_score))
    
    # Calculate Overall Weighted Score (Normalized 0 - 100)
    overall = (
        (keyword_score * 0.25) +
        (skill_score * 0.25) +
        (experience_score * 0.20) +
        (section_score * 0.10) +
        (formatting_score * 0.10) +
        (achievement_score * 0.10)
    )
    overall_rounded = int(round(overall))
    
    # Generate Prioritized Actionable Recommendations
    recommendations = generate_recommendations(
        keyword_score=keyword_score,
        skill_score=skill_score,
        experience_score=experience_score,
        section_score=section_score,
        formatting_score=formatting_score,
        achievement_score=achievement_score,
        missing_kws=missing_kws,
        skills_list=skills_list,
        warnings=warnings,
        achieve=achieve
    )
    
    return {
        "overall_score": overall_rounded,
        "category_scores": {
            "keyword_alignment": round(keyword_score, 1),
            "required_skills": round(skill_score, 1),
            "relevant_experience": round(experience_score, 1),
            "section_completeness": round(section_score, 1),
            "formatting_parsing": round(formatting_score, 1),
            "achievement_quality": round(achievement_score, 1)
        },
        "recommendations": recommendations
    }

def generate_recommendations(
    keyword_score: float,
    skill_score: float,
    experience_score: float,
    section_score: float,
    formatting_score: float,
    achievement_score: float,
    missing_kws: List[Dict[str, Any]],
    skills_list: List[Dict[str, Any]],
    warnings: List[Dict[str, Any]],
    achieve: Dict[str, Any]
) -> List[Dict[str, str]]:
    """Synthesize specific, prioritized recommendations for user resume improvement."""
    recs = []
    
    # Critical Formatting Warnings
    for w in warnings:
        if w.get("severity") == "high":
            recs.append({
                "priority": "high",
                "category": "Formatting",
                "title": f"Resolve: {w['title']}",
                "description": f"{w['detail']} {w['fix_suggestion']}",
                "action_type": "formatting"
            })
            
    # Missing High-Priority Keywords
    if missing_kws:
        top_missing = [k["keyword"] for k in missing_kws[:4]]
        recs.append({
            "priority": "high" if keyword_score < 60 else "medium",
            "category": "Keywords",
            "title": f"Incorporate Essential Keywords: {', '.join(top_missing)}",
            "description": f"These terms appeared prominently in the job description but were not detected in your resume. Integrate them naturally into your experience bullet points where relevant.",
            "action_type": "add_skill"
        })
        
    # Mentioned skills needing evidence
    mentioned_skills = [s["skill"] for s in skills_list if s["status"] == "mentioned"]
    if mentioned_skills:
        recs.append({
            "priority": "medium",
            "category": "Skills",
            "title": f"Strengthen Evidence for: {', '.join(mentioned_skills[:3])}",
            "description": "These skills are currently listed without sufficient project or accomplishment context. Provide concrete examples in your bullet points.",
            "action_type": "rewrite"
        })
        
    # Achievement & Quantifiable Metrics
    metrics_count = achieve.get("metric_count", 0)
    if metrics_count < 3:
        recs.append({
            "priority": "high",
            "category": "Impact",
            "title": "Add Quantifiable Metrics to Bullet Points",
            "description": f"Detected only {metrics_count} quantifiable outcome(s) (percentages, dollar amounts, team sizes, scale). Quantifying your contributions increases recruiter engagement by over 40%.",
            "action_type": "rewrite"
        })
        
    # Action verbs
    verbs_count = achieve.get("unique_action_verbs_count", 0)
    if verbs_count < 5:
        recs.append({
            "priority": "medium",
            "category": "Language",
            "title": "Use Stronger Action Verbs",
            "description": "Begin each experience bullet point with decisive action verbs (e.g. 'Architected', 'Spearheaded', 'Optimized') rather than passive phrasing like 'Responsible for' or 'Helped with'.",
            "action_type": "rewrite"
        })
        
    # Section Completeness
    if section_score < 80:
        recs.append({
            "priority": "medium",
            "category": "Structure",
            "title": "Ensure All Standard Sections Are Present",
            "description": "Verify your resume contains clearly titled 'Professional Experience', 'Education', 'Technical Skills', and 'Projects' sections.",
            "action_type": "formatting"
        })
        
    return recs[:6]
