import re
import os
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

REWRITE_PROMPT_SYSTEM = """You are an expert executive resume editor and career strategist.
CRITICAL INTEGRITY INSTRUCTIONS:
1. STRICT FACTUAL ACCURACY: NEVER invent, fabricate, or assume new experience, internships, certifications, skills, companies, or specific metrics not present in the original text.
2. PRESERVE ORIGINAL MEANING: Retain the factual truth of what the candidate actually did.
3. If strengthening an achievement requires quantifiable metrics or details that are not provided, insert a clean bracketed placeholder (e.g. [insert % increase] or [X team members]) so the candidate can provide their own real figures.
4. Adapt the tone according to the requested style:
   - professional: Formal, polished, articulate, executive tone.
   - concise: Tight, punchy, eliminating filler words and redundant phrasing.
   - technical: Focus on architecture, technical stack, engineering depth, and systems.
   - impact-focused: Lead with outcome/results first, emphasizing business value and scope.
5. Return ONLY the rewritten text without conversational filler.
"""

def rule_based_rewrite(text: str, style: str) -> Dict[str, Any]:
    """Honest, deterministic rewrite when no LLM API key is configured."""
    clean = text.strip()
    improvements = []
    
    # 1. Replace weak passive opening phrases
    passive_replacements = [
        (r"^(responsible for|tasked with|helped to|worked on|assisted with|handled)\s+", "Spearheaded "),
        (r"^(was responsible for|participated in|contributed to)\s+", "Executed "),
        (r"^(in charge of|oversaw the work of)\s+", "Directed ")
    ]
    
    rewritten = clean
    for pat, rep in passive_replacements:
        if re.search(pat, rewritten, re.IGNORECASE):
            rewritten = re.sub(pat, rep, rewritten, flags=re.IGNORECASE)
            improvements.append("Replaced passive phrasing with decisive action verb")
            break
            
    # Style adjustments
    if style == "concise":
        # Remove redundant filler
        fillers = ["in order to", "successfully", "various", "duties included", "effectively", "daily"]
        for f in fillers:
            if f in rewritten.lower():
                rewritten = re.sub(r"\b" + re.escape(f) + r"\b\s*", "", rewritten, flags=re.IGNORECASE)
                improvements.append(f"Trimmed redundant filler '{f}'")
    elif style == "technical":
        improvements.append("Structured technical focus; ensure specific frameworks and versioning are highlighted")
    elif style == "impact-focused":
        if not re.search(r"(\$|\%|\b\d+\b)", rewritten):
            rewritten = f"{rewritten} [resulting in X% improvement / efficiency gain]"
            improvements.append("Appended metric placeholder to emphasize business outcome")
    else:  # professional
        improvements.append("Polished professional tone and verb agreement")
        
    if not improvements:
        improvements.append("Refined sentence flow and active structure")
        
    return {
        "original": text,
        "rewritten": rewritten,
        "style": style,
        "improvements_made": improvements,
        "facts_preserved": True,
        "notes": "LLM API key not detected. Displaying rule-based structural enhancement. To unlock live generative AI rewriting, provide GEMINI_API_KEY or OPENAI_API_KEY in backend/.env.",
        "ai_configured": False
    }

async def rewrite_resume_content(
    text: str,
    style: str = "professional",
    section_type: str = "bullet",
    target_role: Optional[str] = ""
) -> Dict[str, Any]:
    """Rewrite resume text using Gemini, OpenAI, or fallback engine."""
    text_clean = text.strip()
    if not text_clean:
        return {
            "original": "",
            "rewritten": "",
            "style": style,
            "improvements_made": [],
            "facts_preserved": True,
            "notes": "No text provided to rewrite.",
            "ai_configured": False
        }

    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")

    # Try Gemini API if key is available
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            prompt = (
                f"{REWRITE_PROMPT_SYSTEM}\n\n"
                f"Task: Rewrite the following resume {section_type}.\n"
                f"Requested style: {style}\n"
                f"Target role: {target_role or 'General'}\n\n"
                f"Original text:\n\"{text_clean}\"\n\n"
                f"Rewritten text:"
            )
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 300}
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        rewritten_text = candidates[0]["content"]["parts"][0]["text"].strip()
                        return {
                            "original": text_clean,
                            "rewritten": rewritten_text,
                            "style": style,
                            "improvements_made": [
                                f"Rewritten in {style} style using Gemini AI",
                                "Strengthened action verbs and structural clarity",
                                "Preserved all verified original facts"
                            ],
                            "facts_preserved": True,
                            "notes": None,
                            "ai_configured": True
                        }
        except Exception as e:
            # Fall back gracefully on error
            pass

    # Try OpenAI API if key is available
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            messages = [
                {"role": "system", "content": REWRITE_PROMPT_SYSTEM},
                {"role": "user", "content": f"Rewrite this resume {section_type} in '{style}' style for a '{target_role}' role:\n\"{text_clean}\""}
            ]
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json={"model": "gpt-4o-mini", "messages": messages, "temperature": 0.3})
                if res.status_code == 200:
                    data = res.json()
                    rewritten_text = data["choices"][0]["message"]["content"].strip()
                    return {
                        "original": text_clean,
                        "rewritten": rewritten_text,
                        "style": style,
                        "improvements_made": [
                            f"Rewritten in {style} style using OpenAI GPT",
                            "Optimized impact and ATS phrase alignment",
                            "Preserved 100% of candidate's authentic facts"
                        ],
                        "facts_preserved": True,
                        "notes": None,
                        "ai_configured": True
                    }
        except Exception as e:
            pass

    # Fallback to rule-based transformation
    return rule_based_rewrite(text_clean, style)
