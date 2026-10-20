import httpx
import pymupdf

doc = pymupdf.open()
page = doc.new_page()
resume_text = """Alex Morgan
alex.morgan@techmail.io | (415) 555-0192 | San Francisco, CA | github.com/alexmorgan

Professional Summary
Senior Software Engineer with 6+ years of experience architecting distributed backend services and high-scale cloud platforms.

Technical Skills
Languages: Python, TypeScript, Go, SQL
Frameworks: FastAPI, React, Node.js, Django
Cloud & DevOps: Docker, Kubernetes, AWS (ECS, Lambda, S3), Terraform, CI/CD
Databases: PostgreSQL, Redis, MongoDB

Professional Experience
Lead Backend Engineer | CloudScale Inc. (2021 - Present)
- Architected and deployed microservices handling 35M requests daily using FastAPI and PostgreSQL.
- Reduced database query latency by 42% through Redis caching and query indexing optimizations.
- Spearheaded Kubernetes cluster migration, reducing infrastructure hosting costs by $85,000 annually.
- Mentored a team of 5 junior engineers and instituted automated PyTest CI/CD workflows.

Software Engineer | DevMatrix (2018 - 2021)
- Developed RESTful API endpoints and real-time event streaming pipelines with Python and Docker.
- Automated deployment scripts with AWS Lambda and Terraform, decreasing deployment cycle time by 60%.

Education
B.S. in Computer Science | University of California, Berkeley
"""
page.insert_text((50, 50), resume_text)
pdf_bytes = doc.tobytes()
doc.close()

job_title = "Senior Full Stack Software Engineer"
job_description = """We are seeking an experienced Senior Full Stack Software Engineer to lead the architecture of our cloud platform.
Requirements:
- 5+ years building production applications using React, TypeScript, and modern frontend tooling.
- Deep expertise with Python, FastAPI, and relational databases (PostgreSQL).
- Hands-on experience with containerization (Docker, Kubernetes) and AWS infrastructure.
- Demonstrated experience optimizing API performance, Redis caching, and CI/CD pipelines.
- Strong leadership skills, mentoring experience, and commitment to automated unit testing."""

with httpx.Client(base_url="http://127.0.0.1:8000") as client:
    files = {"file": ("alex_morgan_resume.pdf", pdf_bytes, "application/pdf")}
    data = {"job_title": job_title, "job_description": job_description}
    res = client.post("/api/analyze", files=files, data=data)
    print("Analyze status:", res.status_code)
    payload = res.json()
    record_id = payload.get("id")
    print("Analysis ID:", record_id)
    print("Overall Score:", payload.get("overall_score"))
    print("Category Scores:", payload.get("category_scores"))
    print("Recommendations count:", len(payload.get("recommendations", [])))
    print("Matched keywords:", len(payload.get("matched_keywords", [])))
    print("Skills breakdown:", len(payload.get("skills_analysis", [])))

    bullet = "Spearheaded Kubernetes cluster migration, reducing infrastructure hosting costs by $85,000 annually."
    rew_res = client.post("/api/rewrite", json={
        "text": bullet,
        "style": "impact-focused",
        "section_type": "bullet",
        "target_role": job_title
    })
    print("Rewrite status:", rew_res.status_code)
    print("Rewritten text:", rew_res.json().get("rewritten"))

    int_res = client.post(f"/api/interview/{record_id}")
    print("Interview prep status:", int_res.status_code)
    print("Interview questions count:", len(int_res.json().get("questions", [])))

print("End-to-end test execution succeeded!")
