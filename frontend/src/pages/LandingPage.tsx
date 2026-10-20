import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Wand2,
  MessageSquareCode,
  Lock,
  ChevronDown,
  Layers,
  BarChart3,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-radial from-brand-50/50 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Subtle Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Career Intelligence</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your next opportunity starts with a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                stronger resume.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ResuMate AI evaluates your resume against target job descriptions using explainable ATS scoring, verified skill evidence, and factual AI bullet optimization.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all"
            >
              Explore Features
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Deterministic ATS Weights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Factual Integrity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>No Training on Your Documents</span>
            </div>
          </div>

          {/* Product Dashboard Preview (Clean Demonstration) */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-slate-900/5 ring-1 ring-slate-900/10 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-white border border-slate-200">
                {/* Demo Notice Ribbon */}
                <div className="bg-slate-900 text-slate-300 px-4 py-2 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="ml-2 font-sans font-medium text-slate-400">
                      Live Results Preview (Sample Demonstration)
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-400 font-sans font-semibold">
                    Target: Senior Full Stack Engineer
                  </span>
                </div>

                {/* Demonstration Graphic */}
                <div className="p-6 sm:p-8 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Score Card Demonstration */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center mb-3">
                      <span className="text-3xl font-extrabold text-emerald-600">84</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Score</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">Estimated Compatibility</span>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Strong Candidate Match
                    </span>
                  </div>

                  {/* Category Breakdown Demonstration */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Evaluation Breakdown
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-600">Keyword Alignment (25%)</span>
                          <span className="font-bold text-slate-800">88%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full w-[88%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-600">Skill Coverage (25%)</span>
                          <span className="font-bold text-slate-800">92%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full w-[92%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-600">Experience Depth (20%)</span>
                          <span className="font-bold text-slate-800">79%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full w-[79%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Rewriter Preview Demonstration */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        AI Rewrite Preview
                      </h4>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-500 line-through">
                        "Responsible for managing backend APIs and database queries."
                      </div>
                      <div className="p-2 bg-brand-50/70 rounded border border-brand-200 text-slate-800 font-medium">
                        "Architected scalable REST APIs in FastAPI, reducing query latency by 35% across 20M daily requests."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Overview */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for precision, clarity, and genuine results.
            </p>
            <p className="text-sm text-slate-600">
              Every score and suggestion is backed by verifiable analysis, avoiding black-box assertions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Explainable ATS Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                6 normalized criteria totaling 100%. Review exactly how keyword alignment, skills, formatting, and achievements contributed to your score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Skill Evidence Matrix</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distinguishes between skills demonstrated with verifiable accomplishment context, skills merely listed in bullet lists, and missing gaps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Factual AI Rewriter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform bullet points into impact-focused accomplishments across 4 distinct styles while strictly safeguarding authentic verified facts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Targeted Interview Prep</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates role-specific technical, behavioral (STAR), project deep-dive, and HR questions based on your parsed experience and the job criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Explanation Workflow */}
      <section id="workflow" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Workflow
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Three steps to a recruiter-ready resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Upload & Parse Document</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your resume in PDF, DOCX, or TXT format and paste your target job description. Our backend engine extracts structural sections, metrics, and contacts without data loss.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Analyze ATS Compatibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an explainable compatibility score out of 100, broken down into keyword alignment, required skills, experience depth, structure, and quantifiable metrics.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Optimize & Prepare</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use side-by-side AI rewriting to strengthen weak bullets, address highlighted skill gaps, and practice with tailored technical and behavioral interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section id="security" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Data Protection Guarantee</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your career data belongs to you.
            </h2>
            <p className="text-sm text-slate-600">
              We design ResuMate AI with privacy-by-design principles: safe parsing, zero third-party model retraining, and client control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">No Model Retraining</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume text and credentials are never used to train or fine-tune public foundation models.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Safe Input Validation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All uploaded files are scanned in isolated memory buffers with strict file type and size restrictions.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Right to Erasure</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delete your saved resume analyses and parsed records anytime from your dashboard with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Frequently Asked Questions
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">How is the ATS compatibility score calculated?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The score uses a normalized weighted model: Keyword Alignment (25%), Required Skill Coverage (25%), Relevant Experience (20%), Section Completeness (10%), Formatting & Parsing (10%), and Achievement Quality (10%). It does not rely on arbitrary or randomized scoring.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Does ResuMate AI claim to replicate every proprietary ATS algorithm?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Different employers and ATS vendors (Workday, Greenhouse, Lever, Taleo) implement proprietary parsing rules and human screening workflows. Our score is an explainable estimate engineered around industry-standard recruiting best practices.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Will AI rewriting fabricate metrics or fake companies?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never. ResuMate AI enforces a strict factual integrity prompt that preserves your authentic experiences. If an achievement lacks quantifiable metrics, the tool inserts placeholder brackets so you can input your own verified figures.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Which file formats are supported?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We support standard text-based PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) files up to 10MB. Note that flattened image scans without selectable text cannot be processed by standard ATS systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ResuMate AI</span>
            <span>—</span>
            <span>"Your next opportunity starts with a stronger resume."</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/analyze" className="hover:text-slate-900">Analyze Resume</Link>
            <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/interview-coach" className="hover:text-slate-900">Interview Coach</Link>
            <Link to="/settings" className="hover:text-slate-900">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
