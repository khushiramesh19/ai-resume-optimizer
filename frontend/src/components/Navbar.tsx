import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/analyze') ||
                      location.pathname.startsWith('/results') ||
                      location.pathname.startsWith('/resumes') ||
                      location.pathname.startsWith('/interview-coach') ||
                      location.pathname.startsWith('/settings');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:shadow-md group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              ResuMate<span className="text-brand-600 font-extrabold ml-0.5">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase -mt-1">
              Resume Intelligence
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (when on landing or general pages) */}
        {!isDashboard ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privacy & Security
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            ATS Scoring Engine v1.0 Active
          </div>
        )}

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
