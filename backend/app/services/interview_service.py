import os
import json
import httpx
from typing import Dict, Any, List
from app.core.config import settings

def generate_rule_based_questions(role: str, skills_list: List[Dict[str, Any]], parsed_sections: Dict[str, Any]) -> List[Dict[str, str]]:
    """Generate authentic, role-aligned interview questions using candidate's real skill profile."""
    demonstrated_skills = [s["skill"] for s in skills_list if s.get("status") in ("demonstrated", "mentioned")]
    top_skills = demonstrated_skills[:4] if demonstrated_skills else ["System Architecture", "API Design", "Testing"]
    primary_skill = top_skills[0] if top_skills else "Software Engineering"
    secondary_skill = top_skills[1] if len(top_skills) > 1 else "Database Optimization"

    return [
        {
            "category": "technical",
            "question": f"How have you designed and optimized scalable systems using {primary_skill} in your recent work?",
            "assessment_focus": f"Evaluates depth of practical knowledge in {primary_skill}, engineering trade-offs, performance bottlenecks, and design patterns.",
            "suggested_approach": f"Structure your response around a real project: describe the architecture, explain why {primary_skill} was chosen, discuss a technical hurdle you encountered, and explain how you resolved it.",
            "sample_outline": f"1. Architectural context and scale.\n2. Specific role of {primary_skill}.\n3. Challenges faced (e.g. caching, concurrency, latency).\n4. Verified performance outcome."
        },
        {
            "category": "technical",
            "question": f"When integrating {secondary_skill} with other services, what failure modes and latency considerations did you account for?",
            "assessment_focus": "Tests distributed systems thinking, error handling, resiliency, and monitoring practices.",
            "suggested_approach": "Discuss retry strategies, circuit breakers, idempotency, or asynchronous decoupling techniques you have utilized.",
            "sample_outline": "1. Integration topology.\n2. Potential points of failure.\n3. Mitigation mechanisms (timeouts, rate limits, graceful degradation).\n4. Observability and alerting."
        },
        {
            "category": "project",
            "question": "Walk me through one of the most technically complex projects listed on your resume. What was your specific architectural contribution?",
            "assessment_focus": "Differentiates individual ownership from collective team output; tests ability to communicate complex architecture simply.",
            "suggested_approach": "Use the STAR method: clearly isolate your individual design decisions versus pre-existing legacy code.",
            "sample_outline": "1. Business problem and technical goal.\n2. Your architectural design decisions.\n3. Unanticipated roadblocks during implementation.\n4. Measurable deliverable impact."
        },
        {
            "category": "behavioral",
            "question": f"Tell me about a time when you had a fundamental technical disagreement with a team member or stakeholder regarding a project requirement.",
            "assessment_focus": "Assesses professional communication, humility, consensus building, and data-driven decision making.",
            "suggested_approach": "Focus on how you depersonalized the debate by testing assumptions, gathering metrics, and committing to team alignment.",
            "sample_outline": "1. The differing perspectives.\n2. How you evaluated alternatives objectively.\n3. The collaborative resolution reached.\n4. The ultimate project outcome."
        },
        {
            "category": "hr",
            "question": f"What attracted you to apply for this {role or 'position'}, and how does it fit into your long-term technical growth?",
            "assessment_focus": "Gauges genuine interest, company research, self-awareness, and retention potential.",
            "suggested_approach": "Connect specific aspects of the target company's engineering culture and challenges to the problems you enjoy solving.",
            "sample_outline": "1. What excites you about this specific technical domain.\n2. Relevant strengths you bring immediately.\n3. Areas where you look forward to mentoring or expanding expertise."
        }
    ]

async def generate_interview_preparation(
    role: str,
    skills_list: List[Dict[str, Any]],
    parsed_sections: Dict[str, Any]
) -> Dict[str, Any]:
    """Generate role-specific interview preparation cards."""
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    if gemini_key:
        try:
            top_skills = [s["skill"] for s in skills_list[:6]]
            prompt = f"""You are an elite technical interviewer preparing a candidate for a {role} role.
Based on candidate skills: {', '.join(top_skills)}, generate 5 targeted interview questions across categories: 'technical' (2), 'project' (1), 'behavioral' (1), 'hr' (1).
Output valid JSON array with objects matching:
[
  {{
    "category": "technical",
    "question": "...",
    "assessment_focus": "...",
    "suggested_approach": "...",
    "sample_outline": "..."
  }}
]
Do not wrap in markdown quotes if possible, output pure JSON."""
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.4, "maxOutputTokens": 1000}
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        raw_json = candidates[0]["content"]["parts"][0]["text"].strip()
                        raw_json = re.sub(r"^```json\s*", "", raw_json)
                        raw_json = re.sub(r"\s*```$", "", raw_json)
                        parsed_questions = json.loads(raw_json)
                        return {
                            "role": role,
                            "questions": parsed_questions,
                            "ai_configured": True
                        }
        except Exception:
            pass

    # Deterministic fallback
    questions = generate_rule_based_questions(role, skills_list, parsed_sections)
    return {
        "role": role,
        "questions": questions,
        "ai_configured": bool(gemini_key)
    }
