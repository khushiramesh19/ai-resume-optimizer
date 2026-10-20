import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';
import {
  UploadCloud,
  FileCheck,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Briefcase,
  FileText
} from 'lucide-react';

const SAMPLE_RESUMES: Record<string, { filename: string; text: string; role: string }> = {
  "Senior Full Stack Engineer": {
    filename: "alex_morgan_fullstack_resume.txt",
    role: "Senior Full Stack Software Engineer",
    text: `Alex Morgan
alex.morgan@techmail.io | (415) 555-0192 | San Francisco, CA | github.com/alexmorgan | linkedin.com/in/alexmorgan

Professional Summary
Senior Full Stack Engineer with 6+ years of experience architecting distributed backend services and high-scale cloud platforms. Skilled in Python, TypeScript, React, Docker, and PostgreSQL.

Technical Skills
Languages: Python, TypeScript, JavaScript, SQL, Go
Frameworks: React, FastAPI, Node.js, Express, Django
Cloud & Infrastructure: Docker, Kubernetes, AWS (ECS, Lambda, S3, RDS), Terraform, CI/CD
Databases: PostgreSQL, Redis, MongoDB
Practices: Microservices, REST APIs, GraphQL, TDD, Agile/Scrum

Professional Experience
Lead Backend Engineer | CloudScale Inc. (2021 - Present)
- Architected and deployed microservices handling 35M requests daily using FastAPI and PostgreSQL.
- Reduced database query latency by 42% through Redis caching and query indexing optimizations.
- Spearheaded Kubernetes cluster migration, reducing infrastructure hosting costs by $85,000 annually.
- Mentored a team of 5 junior engineers and instituted automated PyTest CI/CD workflows across 12 microservices.

Software Engineer | DevMatrix (2018 - 2021)
- Developed RESTful API endpoints and real-time event streaming pipelines with Python, Node.js, and Docker.
- Automated deployment scripts with AWS Lambda and Terraform, decreasing deployment cycle time by 60%.
- Improved web application loading time by 38% through React code splitting and server-side rendering.

Education
B.S. in Computer Science | University of California, Berkeley (2018)
`
  },
  "Backend Cloud & DevOps Specialist": {
    filename: "jordan_lee_cloud_resume.txt",
    role: "Backend Python / Cloud Engineer",
    text: `Jordan Lee
jordan.lee@cloudops.dev | (206) 555-4821 | Seattle, WA | github.com/jordanlee

Professional Summary
DevOps & Cloud Engineer specializing in Kubernetes orchestration, infrastructure-as-code, and resilient Python microservice architectures.

Technical Skills
Cloud: AWS (ECS, EKS, Lambda, S3, CloudFront), GCP
Containers & Orchestration: Docker, Kubernetes, Helm
IaC & CI/CD: Terraform, Ansible, GitHub Actions, Jenkins
Languages & Backend: Python, Go, Bash, SQL, FastAPI
Databases & Monitoring: PostgreSQL, Redis, Prometheus, Grafana

Work Experience
Senior DevOps Engineer | InfraCore Systems (2020 - Present)
- Designed automated Terraform modules provisioning multi-region AWS cloud infrastructure supporting 10M active users.
- Reduced cloud infrastructure expenditures by 28% through autoscaling policies and container right-sizing.
- Built end-to-end CI/CD pipelines deploying containerized FastAPI microservices in under 4 minutes.
- Maintained 99.99% system availability by integrating Prometheus alerts and distributed tracing.

Education
B.S. in Information Systems | University of Washington
`
  }
};

const SAMPLE_JOB_DESCRIPTIONS: Record<string, string> = {
  "Senior Full Stack Software Engineer": `We are seeking an experienced Senior Full Stack Software Engineer to build scalable web applications.
Requirements:
- 5+ years building production applications using React, TypeScript, and modern frontend tooling.
- Strong backend experience with Python, FastAPI, or Node.js.
- Solid understanding of relational databases (PostgreSQL) and caching layers (Redis).
- Hands-on experience with containerization (Docker, Kubernetes) and CI/CD pipelines (GitHub Actions).
- Proven track record architecting microservices, REST APIs, and event-driven architectures.
- Experience with cloud platforms (AWS, GCP) and infrastructure-as-code is preferred.
- Excellent communication skills, cross-functional leadership, and commitment to unit testing and code quality.`,

  "Backend Python / Cloud Engineer": `Looking for a Senior Backend Engineer to design high-throughput cloud services.
Responsibilities:
- Build and optimize microservices using Python, FastAPI, and asynchronous workflows.
- Manage PostgreSQL databases, query optimization, indexing, and migration strategies.
- Deploy and monitor services on AWS (ECS, Lambda, S3, RDS) using Terraform.
- Implement robust telemetry, Prometheus metrics, and automated unit testing with PyTest.
- Collaborate with frontend and data science teams to deliver secure, reliable RESTful and GraphQL APIs.`
};

export const AnalyzeResumePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    SAMPLE_JOB_DESCRIPTIONS['Senior Full Stack Software Engineer']
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    const validExts = ['.pdf', '.docx', '.txt'];
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

    if (!validExts.includes(ext)) {
      setErrorMessage(`Unsupported format '${ext}'. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.`);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds the 10MB limit. Please compress or upload a smaller version.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const loadSampleResume = (presetKey: string) => {
    const preset = SAMPLE_RESUMES[presetKey];
    if (!preset) return;

    // Create an actual File object in-memory
    const blob = new Blob([preset.text], { type: 'text/plain' });
    const sampleFile = new File([blob], preset.filename, { type: 'text/plain' });
    setFile(sampleFile);
    setJobTitle(preset.role);
    if (SAMPLE_JOB_DESCRIPTIONS[preset.role]) {
      setJobDescription(SAMPLE_JOB_DESCRIPTIONS[preset.role]);
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select or drop a resume file to analyze.');
      return;
    }
    if (!jobTitle.trim()) {
      setErrorMessage('Please enter a target job title.');
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setErrorMessage('Job description must be at least 20 characters.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const result = await analyzeResume(
        file,
        jobTitle.trim(),
        jobDescription.trim(),
        (progress) => {
          setUploadProgress(progress);
        }
      );
      navigate(`/results/${result.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during resume analysis.');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Analyze & Optimize Resume
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload your resume and supply the target job details to run full ATS diagnostics and skill gap matching.
        </p>
      </div>

      {/* Quick Test Helper Banner */}
      <div className="p-4 bg-brand-50/60 border border-brand-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brand-900 font-medium">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Need a quick test? Load an authentic sample resume & job description:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => loadSampleResume('Senior Full Stack Engineer')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold shadow-2xs transition-all cursor-pointer"
          >
            Full Stack Profile
          </button>
          <button
            type="button"
            onClick={() => loadSampleResume('Backend Cloud & DevOps Specialist')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold shadow-2xs transition-all cursor-pointer"
          >
            Cloud / DevOps Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Upload Zone */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900">Upload Your Resume</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Supported: PDF, DOCX, TXT (Max 10MB)
            </span>
          </div>

          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-brand-500 bg-brand-50/50 scale-[1.01]'
                  : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-3 shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Drag and drop your resume file here
              </p>
              <p className="text-xs text-slate-500 mb-4">
                or click to browse from your device
              </p>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                PDF, DOCX, or TXT
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-brand-50/40 border border-brand-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{file.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.name.split('.').pop()?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Target Job Details */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">Target Role & Job Description</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Job Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer, Technical Lead"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Job Description Requirements
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {jobDescription.length} characters
                </span>
              </div>
              <textarea
                rows={8}
                required
                placeholder="Paste the full job description or core requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans leading-relaxed text-slate-900 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Progress & Error */}
        {isSubmitting && (
          <div className="p-4 bg-white border border-brand-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                Analyzing resume against ATS requirements...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(10, uploadProgress)}%` }}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Validation Error:</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Scoring Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit for ATS Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
