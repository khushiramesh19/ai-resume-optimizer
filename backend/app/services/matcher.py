import re
from typing import Dict, List, Set, Tuple, Any, Optional

COMMON_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than",
    "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's",
    "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
    "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves", "role", "team",
    "work", "working", "experience", "candidate", "responsibilities", "requirements",
    "years", "plus", "must", "able", "strong", "knowledge", "including", "opportunity"
}

SKILL_TAXONOMY: Dict[str, Dict[str, List[str]]] = {
    "Languages": {
        "Python": ["python", "py"],
        "JavaScript": ["javascript", "js", "ecmascript"],
        "TypeScript": ["typescript", "ts"],
        "Java": ["java", "core java", "j2ee"],
        "C++": ["c++", "cpp"],
        "C#": ["c#", "csharp", ".net c#"],
        "Go": ["golang", "go language", "go"],
        "Rust": ["rust", "rust-lang"],
        "SQL": ["sql", "structured query language"],
        "Ruby": ["ruby", "ruby on rails"],
        "PHP": ["php"],
        "HTML/CSS": ["html", "css", "html5", "css3"],
        "Kotlin": ["kotlin"],
        "Swift": ["swift", "swiftui"]
    },
    "Frameworks & Web": {
        "React": ["react", "react.js", "reactjs"],
        "Next.js": ["next.js", "nextjs"],
        "Vue.js": ["vue", "vue.js", "vuejs"],
        "Angular": ["angular", "angularjs"],
        "Node.js": ["node", "node.js", "nodejs"],
        "Express": ["express", "express.js", "expressjs"],
        "FastAPI": ["fastapi", "fast api"],
        "Django": ["django"],
        "Flask": ["flask"],
        "Spring Boot": ["spring boot", "spring framework", "spring"],
        "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
        "Redux": ["redux", "redux toolkit"]
    },
    "Cloud & Infrastructure": {
        "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda"],
        "Azure": ["azure", "microsoft azure"],
        "Google Cloud (GCP)": ["gcp", "google cloud", "google cloud platform"],
        "Docker": ["docker", "containerization"],
        "Kubernetes": ["kubernetes", "k8s"],
        "Terraform": ["terraform", "iac", "infrastructure as code"],
        "Linux": ["linux", "unix", "ubuntu", "bash", "shell scripting"]
    },
    "Databases & Storage": {
        "PostgreSQL": ["postgresql", "postgres", "psql"],
        "MySQL": ["mysql"],
        "MongoDB": ["mongodb", "mongo"],
        "Redis": ["redis"],
        "Elasticsearch": ["elasticsearch", "elastic search"],
        "DynamoDB": ["dynamodb"],
        "GraphQL": ["graphql"]
    },
    "DevOps & Tools": {
        "Git": ["git", "github", "gitlab"],
        "CI/CD": ["ci/cd", "continuous integration", "github actions", "jenkins", "gitlab ci"],
        "Microservices": ["microservices", "microservice architecture"],
        "REST APIs": ["rest", "restful", "rest api", "rest apis", "restful api"],
        "Testing / QA": ["unit testing", "pytest", "jest", "cypress", "selenium", "tdd"]
    },
    "AI & Data": {
        "Machine Learning": ["machine learning", "ml", "deep learning"],
        "LLMs / Generative AI": ["llm", "llms", "large language models", "generative ai", "openai", "gemini", "prompt engineering", "langchain"],
        "PyTorch / TensorFlow": ["pytorch", "tensorflow", "keras"],
        "Data Analytics": ["pandas", "numpy", "scikit-learn", "data analysis", "power bi", "tableau"]
    },
    "Methodologies & Soft Skills": {
        "Agile / Scrum": ["agile", "scrum", "sprints", "jira", "kanban"],
        "System Design": ["system design", "software architecture", "scalability", "high availability"],
        "Cross-functional Leadership": ["leadership", "mentoring", "cross-functional", "stakeholder management"],
        "Problem Solving": ["problem solving", "analytical skills", "critical thinking"]
    }
}

def extract_jd_keywords(job_description: str, target_role: str = "") -> List[Dict[str, Any]]:
    """Extract key technical and operational keywords from job description using frequency and taxonomy matching."""
    text_clean = job_description.lower()
    
    # Extract recognized skills from taxonomy
    recognized_keywords = {}
    for category, skills in SKILL_TAXONOMY.items():
        for canonical_name, aliases in skills.items():
            freq = 0
            for alias in aliases:
                pattern = r"(?<!\w)" + re.escape(alias) + r"(?!\w)"
                matches = re.findall(pattern, text_clean)
                freq += len(matches)
            if freq > 0:
                recognized_keywords[canonical_name] = {
                    "keyword": canonical_name,
                    "frequency_in_jd": freq,
                    "category": category
                }
                
    # Also extract prominent high-frequency domain n-grams (1-3 words) not covered by stopwords
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text_clean)
    word_freq = {}
    for w in words:
        if w not in COMMON_STOPWORDS and len(w) > 3:
            word_freq[w] = word_freq.get(w, 0) + 1
            
    # Include target role terms if present
    if target_role:
        for t in target_role.lower().split():
            if t not in COMMON_STOPWORDS and t not in word_freq:
                word_freq[t] = 2

    # Top words appearing >= 2 times as domain keywords
    for w, count in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:15]:
        cap_w = w.capitalize()
        if cap_w not in recognized_keywords:
            recognized_keywords[cap_w] = {
                "keyword": cap_w,
                "frequency_in_jd": count,
                "category": "Domain Keywords"
            }

    return list(recognized_keywords.values())

def find_evidence_in_text(skill_name: str, aliases: List[str], resume_text: str) -> Tuple[bool, int, Optional[str], str]:
    """Find evidence sentences in resume text for a skill.
    Returns: (found, frequency, evidence_snippet, status: 'demonstrated'|'mentioned'|'missing')
    """
    sentences = re.split(r"(?<=[.!?\n])\s+", resume_text)
    matched_sentences = []
    total_matches = 0
    
    all_terms = [skill_name.lower()] + [a.lower() for a in aliases]
    all_terms = list(set(all_terms))
    
    for sent in sentences:
        clean_sent = sent.strip()
        if not clean_sent or len(clean_sent) < 5:
            continue
        lower_sent = clean_sent.lower()
        for term in all_terms:
            pattern = r"(?<!\w)" + re.escape(term) + r"(?!\w)"
            if re.search(pattern, lower_sent):
                total_matches += 1
                if clean_sent not in matched_sentences:
                    matched_sentences.append(clean_sent)
                    
    if total_matches == 0:
        return False, 0, None, "missing"
        
    evidence = matched_sentences[0] if matched_sentences else None
    
    # Evaluate evidence context: does it contain numbers, metrics, or action verbs?
    context_is_rich = False
    if evidence:
        has_metric = bool(re.search(r"(\$|\%|\b\d{2,}\b|\b\d+\b)", evidence))
        has_action_verb = any(word in evidence.lower().split() for word in [
            "led", "built", "designed", "developed", "architected", "deployed",
            "managed", "engineered", "implemented", "scaled", "created", "reduced",
            "increased", "optimized", "spearheaded", "accelerated", "integrated"
        ])
        if (has_metric or has_action_verb) and len(evidence.split()) > 7:
            context_is_rich = True
            
    status = "demonstrated" if context_is_rich else "mentioned"
    return True, total_matches, evidence, status

def perform_skill_and_keyword_matching(resume_text: str, job_description: str, target_role: str = "") -> Dict[str, Any]:
    """Perform thorough NLP matching between resume and job description requirements."""
    jd_keywords = extract_jd_keywords(job_description, target_role)
    
    matched_keywords = []
    missing_keywords = []
    skills_analysis = []
    
    for item in jd_keywords:
        kw = item["keyword"]
        cat = item.get("category", "General")
        
        # Look up aliases from taxonomy
        aliases = [kw.lower()]
        for c, skills in SKILL_TAXONOMY.items():
            if kw in skills:
                aliases = skills[kw]
                cat = c
                break
                
        found, freq, evidence, status = find_evidence_in_text(kw, aliases, resume_text)
        
        kw_record = {
            "keyword": kw,
            "frequency_in_jd": item["frequency_in_jd"],
            "found_in_resume": found,
            "frequency_in_resume": freq
        }
        
        if found:
            matched_keywords.append(kw_record)
        else:
            missing_keywords.append(kw_record)
            
        # Skill item with suggestion
        if status == "demonstrated":
            suggestion = f"Strong evidence found. Highlight specific metrics or business outcomes to make this achievement even more impactful."
        elif status == "mentioned":
            suggestion = f"Mentioned in your resume, but lacks active accomplishment context. Add a bullet point showing how you applied {kw} in a real project."
        else:
            suggestion = f"Required in target job description but not detected in resume. If you have experience with {kw}, add it to your skills and work experience."
            
        skills_analysis.append({
            "skill": kw,
            "category": cat,
            "status": status,
            "evidence": evidence,
            "suggestion": suggestion
        })
        
    return {
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "skills_analysis": skills_analysis
    }
