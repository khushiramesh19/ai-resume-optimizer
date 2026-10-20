import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalysisListItem } from '../types';
import { getAnalyses, deleteAnalysis } from '../services/api';
import { EmptyState } from '../components/EmptyState';
import {
  FileSearch,
  Plus,
  ArrowRight,
  TrendingUp,
  Files,
  Calendar,
  Trash2,
  ExternalLink,
  Award,
  Loader2
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analyses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this analysis record?')) {
      try {
        await deleteAnalysis(id);
        setAnalyses(analyses.filter((a) => a.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete record.');
      }
    }
  };

  const latestScore = analyses.length > 0 ? analyses[0].overall_score : null;
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((acc, curr) => acc + curr.overall_score, 0) / analyses.length)
    : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl text-white shadow-md">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-brand-200">
            ResuMate AI Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Optimize Your Next Career Move
          </h1>
          <p className="text-xs sm:text-sm text-brand-100/80 max-w-lg leading-relaxed">
            Audit your resume against target job requirements with explainable scoring, skill gap detection, and AI bullet rewriting.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-800 hover:bg-brand-50 text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Analyses</span>
            <Files className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 mt-1" /> : analyses.length}
          </div>
          <p className="text-[11px] text-slate-400">Total resumes evaluated locally</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Latest ATS Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400 mt-1" />
            ) : latestScore !== null ? (
              <span className={latestScore >= 75 ? 'text-emerald-600' : latestScore >= 50 ? 'text-amber-600' : 'text-rose-600'}>
                {latestScore}/100
              </span>
            ) : (
              <span className="text-slate-300 text-xl font-medium">—</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Most recent target job alignment</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Average Compatibility</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400 mt-1" />
            ) : avgScore !== null ? (
              `${avgScore}%`
            ) : (
              <span className="text-slate-300 text-xl font-medium">—</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Average match across all submissions</p>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Resume Analyses</h2>
            <p className="text-xs text-slate-500">
              Review and reopen your past evaluations or launch interview preparation
            </p>
          </div>
          {analyses.length > 0 && (
            <Link
              to="/resumes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span className="text-xs text-slate-500">Loading analysis history...</span>
          </div>
        ) : analyses.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="No Resume Analyses Yet"
            description="You haven't uploaded any resumes yet. Start your first analysis to evaluate keyword alignment, skill evidence, and estimated ATS compatibility."
            actionText="Analyze Your First Resume"
            actionLink="/analyze"
          />
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {analyses.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 hover:text-brand-600 transition-colors">
                        {item.job_title}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {item.filename}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold px-2.5 py-1 rounded-full text-xs border ${
                          item.overall_score >= 75
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.overall_score >= 50
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.overall_score}/100 Match
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/results/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
