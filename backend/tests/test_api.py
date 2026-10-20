import io
import pytest
import httpx
from app.main import app

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

@pytest.mark.anyio
async def test_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ResuMate AI"

@pytest.mark.anyio
async def test_analyze_and_manage_workflow(client):
    sample_resume = b"""
    Alex Rivera
    alex.rivera@example.com | (555) 345-6789
    
    Professional Summary
    Senior Full Stack Engineer with 7 years experience in React, TypeScript, Python, FastAPI, and Docker.
    
    Experience
    Senior Engineer at CloudCorp (2020 - Present)
    - Architected microservices with FastAPI and PostgreSQL, serving 20M requests daily.
    - Improved page load speeds by 40% with React query and code splitting.
    
    Education
    B.S. in Computer Science - University of Michigan
    
    Skills
    React, TypeScript, Python, FastAPI, Docker, PostgreSQL, Redis, Git
    """
    
    files = {"file": ("alex_resume.txt", io.BytesIO(sample_resume), "text/plain")}
    data = {
        "job_title": "Full Stack Software Engineer",
        "job_description": "We are seeking a Full Stack Software Engineer experienced in React, TypeScript, Python, FastAPI, Docker, and PostgreSQL. Must have strong experience designing microservices."
    }
    
    res = await client.post("/api/analyze", files=files, data=data)
    assert res.status_code == 200
    payload = res.json()
    assert payload["overall_score"] > 60
    assert "keyword_alignment" in payload["category_scores"]
    assert len(payload["matched_keywords"]) > 0
    assert len(payload["recommendations"]) > 0
    
    analysis_id = payload["id"]
    
    # Test GET by ID
    get_res = await client.get(f"/api/analyses/{analysis_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == analysis_id
    
    # Test List
    list_res = await client.get("/api/analyses")
    assert list_res.status_code == 200
    assert any(a["id"] == analysis_id for a in list_res.json())
    
    # Test Delete
    del_res = await client.delete(f"/api/analyses/{analysis_id}")
    assert del_res.status_code == 204

@pytest.mark.anyio
async def test_rewrite_endpoint(client):
    payload = {
        "text": "Responsible for managing the database and helping with queries.",
        "style": "impact-focused",
        "section_type": "bullet",
        "target_role": "Backend Engineer"
    }
    res = await client.post("/api/rewrite", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["facts_preserved"] is True
    assert len(data["rewritten"]) > 0

@pytest.mark.anyio
async def test_interview_generic(client):
    res = await client.post("/api/interview-generic?role=Frontend%20Engineer")
    assert res.status_code == 200
    data = res.json()
    assert len(data["questions"]) >= 4
