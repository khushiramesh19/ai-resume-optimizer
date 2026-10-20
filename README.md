# ResuMate AI

> **"Your next opportunity starts with a stronger resume."**

ResuMate AI is a portfolio-quality, production-ready SaaS platform engineered for authentic resume optimization, explainable ATS compatibility scoring, skill gap detection, side-by-side AI bullet rewriting, and role-specific interview coaching.

---

## Key Features

1. **Multi-Format Document Parsing**
   - High-fidelity text extraction via **PyMuPDF** (`pymupdf`) for PDFs, **python-docx** for DOCX, and multi-encoding plain text (`.txt`).
   - Identifies candidate contact anchors (email, phone, LinkedIn, GitHub).
   - Segments standard resume sections (Summary, Experience, Education, Skills, Projects, Certifications).
   - Identifies quantifiable metrics ($ amounts, % gains, scale metrics) and active leadership verbs.

2. **Deterministic, Explainable ATS Scoring Engine**
   - Eliminates black-box random scores. Evaluates 6 normalized dimensions totaling 100%:
     - **Keyword Alignment (25%)**: Ratio of job description keywords found in resume.
     - **Required Skill Coverage (25%)**: Coverage of essential core technologies and qualifications.
     - **Relevant Experience (20%)**: Role alignment, duration, and bullet point depth.
     - **Section Completeness (10%)**: Verification of essential sections.
     - **Formatting and Parsing (10%)**: Penalties only for real parsing hazards (low text volume, missing contacts, unusual encoding artifacts).
     - **Achievement Quality (10%)**: Quantified impact and action verb strength.

3. **Skill & Requirement Evidence Matrix**
   - Automatically compares resume content against the job description.
   - Distinguishes between:
     - **Demonstrated**: Accompanied by active context, metrics, or project evidence.
     - **Mentioned**: Listed without descriptive accomplishment context.
     - **Missing**: Not detected in resume text.
   - Provides concrete suggestions for each skill requirement.

4. **Factual AI Bullet Rewriter**
   - Side-by-side comparison modal with 4 distinct styles: `Professional`, `Concise`, `Technical`, `Impact-focused`.
   - **Strict Integrity Guarantee**: Never invents credentials, internships, or fabricated statistics. If details are missing, bracketed placeholders like `[insert % improvement]` are generated for user completion.
   - **Graceful Fallback**: If `GEMINI_API_KEY` or `OPENAI_API_KEY` is not configured, the platform displays an honest status notice and executes high-speed, rule-based structural enhancements with zero data leakage.

5. **Targeted Interview Coach**
   - Formulates tailored interview questions across 4 categories:
     - **Technical Deep-Dive**
     - **Project Ownership & Architecture**
     - **Behavioral (STAR Method)**
     - **Culture & Motivation**
   - Provides assessment criteria and structural answer frameworks for each question.

6. **Local Persistence & PostgreSQL Readiness**
   - Stores analysis records locally in an embedded SQLite database (`resumate.db`).
   - Clean SQLAlchemy Repository abstraction allows effortless migration to PostgreSQL in production simply by setting `DATABASE_URL`.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router
- **Backend**: Python 3.11+, FastAPI, Pydantic, SQLAlchemy, PyMuPDF, python-docx, scikit-learn
- **Testing**: PyTest, AnyIO, HTTPX
- **Deployment**: Docker, Docker Compose, Nginx

---

## Quickstart Guide (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# (Optional) Configure environment variables
cp ../.env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
The backend API and Swagger docs will be accessible at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: `http://localhost:5173`

---

## Running with Docker Compose

To spin up the entire full-stack application inside isolated containers:
```bash
# Build and launch both backend and frontend containers
docker compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Health Check: `http://localhost:8000/api/health`

---

## Running Automated Tests

Run the backend unit and integration test suite:
```bash
cd backend
python -m pytest tests -v
```

Test coverage includes:
- `tests/test_parser.py`: PDF, DOCX, TXT parsing, contact extraction, and metrics detection.
- `tests/test_scoring.py`: Normalized 6-category ATS scoring calculation and synonym resolution.
- `tests/test_api.py`: Health endpoint, multipart resume upload, AI rewrite endpoint, and interview generator.

---

## Environment Variables

| Variable | Description | Default | Required? |
|---|---|---|---|
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./resumate.db` | No (defaults to SQLite) |
| `GEMINI_API_KEY` | Google Gemini API key for generative rewrites | *None* | Optional (activates LLM) |
| `OPENAI_API_KEY` | OpenAI API key for GPT rewrites | *None* | Optional (activates LLM) |
| `MAX_FILE_SIZE_MB` | Maximum allowed file upload size | `10` | No |
| `VITE_API_URL` | Frontend API endpoint URL | `http://localhost:8000/api` | No |

---

## Security & Privacy Highlights

- **No Public Retraining**: Resumes are never transmitted to third parties for model training.
- **Untrusted File Sandboxing**: Documents are strictly evaluated in memory buffers with size and format whitelists.
- **Right to Erasure**: Users can permanently remove stored analyses with one click.
