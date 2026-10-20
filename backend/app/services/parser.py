import io
import re
from typing import Dict, Any, List, Optional
import pymupdf  # PyMuPDF
import docx

ACTION_VERBS = {
    "accelerated", "accomplished", "achieved", "acquired", "adapted", "administered",
    "advised", "allocated", "analyzed", "architected", "automated", "boosted",
    "budgeted", "built", "centralized", "championed", "collaborated", "composed",
    "conceived", "constructed", "converted", "coordinated", "created", "cut",
    "decreased", "delivered", "deployed", "designed", "developed", "devised",
    "directed", "doubled", "drove", "eliminated", "enabled", "engineered",
    "enhanced", "established", "evaluated", "exceeded", "executed", "expanded",
    "expedited", "fabricated", "facilitated", "formulated", "generated", "guided",
    "headed", "identified", "implemented", "improved", "increased", "initiated",
    "innovated", "installed", "instituted", "integrated", "introduced", "invented",
    "launched", "led", "leveraged", "managed", "maximized", "mentored", "migrated",
    "modernized", "negotiated", "optimized", "orchestrated", "organized", "overhauled",
    "oversaw", "partnered", "performed", "pioneered", "planned", "produced",
    "programmed", "promoted", "published", "rebuilt", "redesigned", "reduced",
    "reengineered", "resolved", "restructured", "revamped", "saved", "scaled",
    "secured", "simplified", "spearheaded", "standardized", "streamlined",
    "strengthened", "structured", "surpassed", "trained", "transformed", "unified", "upgraded"
}

def extract_text_from_pdf(content: bytes) -> str:
    """Extract clean text from PDF bytes using PyMuPDF."""
    text_chunks = []
    try:
        doc = pymupdf.open(stream=content, filetype="pdf")
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            page_text = page.get_text("text")
            if page_text:
                text_chunks.append(page_text.strip())
        doc.close()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF document: {str(e)}")
    return "\n\n".join(text_chunks)

def extract_text_from_docx(content: bytes) -> str:
    """Extract clean text from DOCX bytes using python-docx."""
    try:
        doc_stream = io.BytesIO(content)
        doc = docx.Document(doc_stream)
        lines = []
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:
                lines.append(text)
        for table in doc.tables:
            for row in table.rows:
                row_cells = [c.text.strip() for c in row.cells if c.text.strip()]
                if row_cells:
                    lines.append(" | ".join(row_cells))
        return "\n".join(lines)
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX document: {str(e)}")

def extract_text_from_txt(content: bytes) -> str:
    """Extract text from TXT with multiple encoding attempts."""
    for enc in ["utf-8", "utf-8-sig", "latin-1", "cp1252"]:
        try:
            return content.decode(enc)
        except UnicodeDecodeError:
            continue
    return content.decode("utf-8", errors="replace")

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract email, phone, links, and estimate name from resume text."""
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}", text)
    linkedin_match = re.search(r"linkedin\.com/in/[\w\-]+", text, re.IGNORECASE)
    github_match = re.search(r"github\.com/[\w\-]+", text, re.IGNORECASE)
    
    # Simple heuristic for candidate name: usually first non-empty line
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    estimated_name = lines[0] if lines and len(lines[0].split()) <= 4 else None

    return {
        "name": estimated_name,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None
    }

def segment_sections(text: str) -> Dict[str, str]:
    """Segment resume text into standard semantic sections."""
    section_patterns = {
        "summary": r"(summary|professional summary|executive summary|profile|about me|objective)",
        "experience": r"(experience|work experience|employment history|work history|professional experience)",
        "education": r"(education|academic background|academics|degrees)",
        "skills": r"(skills|technical skills|core competencies|technologies|expertise)",
        "projects": r"(projects|key projects|personal projects|notable projects)",
        "certifications": r"(certifications|licenses|certificates|credentials)"
    }
    
    sections = {k: "" for k in section_patterns.keys()}
    sections["other"] = ""
    
    lines = text.splitlines()
    current_section = "other"
    current_content: List[str] = []
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        is_header = False
        lower_line = stripped.lower()
        if len(stripped) < 40 and not stripped.endswith("."):
            for sec_name, pat in section_patterns.items():
                if re.fullmatch(pat, lower_line) or re.match(r"^" + pat + r"(:)?$", lower_line):
                    if current_content:
                        sections[current_section] = "\n".join(current_content)
                    current_section = sec_name
                    current_content = []
                    is_header = True
                    break
                    
        if not is_header:
            current_content.append(stripped)
            
    if current_content:
        sections[current_section] = "\n".join(current_content)
        
    return sections

def analyze_achievements_and_metrics(text: str) -> Dict[str, Any]:
    """Analyze the presence of quantitative metrics and strong action verbs in resume text."""
    # Metric patterns: $X, X%, numbers >= 2 digits, metrics like '2x', '10+', etc.
    metric_pattern = r"(\$\s?\d+[\d,]*(\.\d+)?|\b\d+(\.\d+)?%|\b\d{2,}\b|\b\d+x\b|\b\d+\+\b)"
    metrics_found = re.findall(metric_pattern, text, re.IGNORECASE)
    
    words = re.findall(r"\b[A-Za-z]+\b", text.lower())
    action_verbs_found = [w for w in set(words) if w in ACTION_VERBS]
    
    # Check bullet lines
    lines = text.splitlines()
    bullet_lines = [l.strip() for l in lines if l.strip().startswith(("-", "•", "*", "–")) or re.match(r"^\d+\.", l.strip())]
    
    metrics_in_bullets = 0
    strong_start_bullets = 0
    for b in bullet_lines:
        clean_b = re.sub(r"^[-•*–\d\.\s]+", "", b).strip()
        first_word = clean_b.split()[0].lower() if clean_b.split() else ""
        if first_word in ACTION_VERBS:
            strong_start_bullets += 1
        if re.search(metric_pattern, clean_b):
            metrics_in_bullets += 1
            
    return {
        "metric_count": len(metrics_found),
        "unique_action_verbs_count": len(action_verbs_found),
        "action_verbs": sorted(list(action_verbs_found))[:20],
        "bullet_count": len(bullet_lines),
        "bullets_with_metrics": metrics_in_bullets,
        "bullets_with_strong_verb": strong_start_bullets
    }

def check_formatting_and_parsing(text: str, filename: str) -> List[Dict[str, str]]:
    """Detect formatting or structural anomalies that might break ATS parsers."""
    warnings = []
    
    # 1. Length check
    words = text.split()
    word_count = len(words)
    if word_count < 150:
        warnings.append({
            "severity": "high",
            "title": "Low Resume Text Volume",
            "detail": f"Resume contains only {word_count} words. ATS systems may mark this as incomplete or fail to index skills.",
            "fix_suggestion": "Ensure the document is not an image-only scan and includes complete experience and education sections."
        })
    elif word_count > 1500:
        warnings.append({
            "severity": "medium",
            "title": "Length Exceeds Standard Recommendation",
            "detail": f"Document contains {word_count} words (likely 3+ pages). Recruiters spend an average of 7-10 seconds on first review.",
            "fix_suggestion": "Condense bullet points to focus on highest-impact achievements within 1-2 pages."
        })
        
    # 2. Scanned / OCR alert
    if len(text.strip()) < 50:
        warnings.append({
            "severity": "high",
            "title": "Potential Scanned Document Detected",
            "detail": "Extracted text is empty or virtually non-existent. The file may be a scanned image without selectable text.",
            "fix_suggestion": "ResuMate AI does not perform OCR on flattened images. Please save or export your resume from Microsoft Word, Google Docs, or LaTeX as a text-based PDF."
        })
        
    # 3. Contact info checks
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}", text)
    if not email_match:
        warnings.append({
            "severity": "high",
            "title": "Missing or Unparseable Email",
            "detail": "No valid email address was detected in the document header or body.",
            "fix_suggestion": "Include a standard, clearly formatted email address (e.g. name@domain.com) near the top."
        })
    if not phone_match:
        warnings.append({
            "severity": "medium",
            "title": "Missing Phone Number",
            "detail": "No phone number was identified by the parsing engine.",
            "fix_suggestion": "Add a direct phone number with area/country code in the contact section."
        })

    # 4. Multi-column or weird table artifacts
    unusual_symbols = len(re.findall(r"[\ufffd\x00-\x08\x0b\x0c\x0e-\x1f]", text))
    if unusual_symbols > 5:
        warnings.append({
            "severity": "medium",
            "title": "Non-Standard Character Artifacts",
            "detail": f"Detected {unusual_symbols} non-standard or corrupted encoding characters in the document stream.",
            "fix_suggestion": "Avoid unconventional fonts, decorative wingdings, or complex layout tables that encode non-standard glyphs."
        })

    return warnings

def parse_resume_document(content: bytes, filename: str) -> Dict[str, Any]:
    """Parse resume content according to file type and return complete structured data."""
    ext = filename.lower().split(".")[-1] if "." in filename else ""
    
    if ext == "pdf":
        raw_text = extract_text_from_pdf(content)
        file_type = "application/pdf"
    elif ext in ["docx", "doc"]:
        raw_text = extract_text_from_docx(content)
        file_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif ext in ["txt", "text"]:
        raw_text = extract_text_from_txt(content)
        file_type = "text/plain"
    else:
        raise ValueError(f"Unsupported file format '.{ext}'. Supported formats are PDF (.pdf), DOCX (.docx), and TXT (.txt).")

    if not raw_text.strip():
        raise ValueError("The uploaded resume appears to be empty or contains no readable text content.")

    contact = extract_contact_info(raw_text)
    sections = segment_sections(raw_text)
    achievements = analyze_achievements_and_metrics(raw_text)
    formatting_warnings = check_formatting_and_parsing(raw_text, filename)
    
    return {
        "filename": filename,
        "file_type": file_type,
        "raw_text": raw_text,
        "contact": contact,
        "sections": sections,
        "achievements": achievements,
        "formatting_warnings": formatting_warnings,
        "word_count": len(raw_text.split()),
        "character_count": len(raw_text)
    }
