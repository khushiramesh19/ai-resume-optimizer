import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalysisListItem } from '../types';
import { getAnalyses, deleteAnalysis } from '../services/api';
import { EmptyState } from '../components/EmptyState';
import {
  Files,
  Search,
  ExternalLink,
  MessageSquareCode,
  Trash2,
  Calendar,
  FileText,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const MyResumesPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this resume analysis record? This cannot be undone.')) {
      try {
        await deleteAnalysis(id);
        setAnalyses(analyses.filter((a) => a.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete record.');
      }
    }
  };

  const filtered = analyses.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.job_title.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Saved Analyses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Persisted resume evaluations stored in your local development database
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      {analyses.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <p className="text-xs text-slate-500">Loading saved analyses...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={Files}
          title="No Saved Resume Analyses"
          description="Your previous evaluations will be stored here with persistent scores, recommendations, and interview prep links."
          actionText="Run Your First Analysis"
          actionLink="/analyze"
        />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-5">Target Job Title</th>
                  <th className="py-3 px-5">File Name</th>
                  <th className="py-3 px-5">Analysis Date</th>
                  <th className="py-3 px-5">ATS Score</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <Link
                        to={`/results/${item.id}`}
                        className="font-bold text-slate-900 hover:text-brand-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>{item.job_title}</span>
                      </Link>
                    </td>

                    <td className="py-4 px-5 text-slate-500">
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {item.filename}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          item.overall_score >= 75
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.overall_score >= 50
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.overall_score}/100 Match
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span>Results</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <Link
                          to={`/interview-coach?analysisId=${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                          title="Open Interview Coach for this role"
                        >
                          <MessageSquareCode className="w-3.5 h-3.5 text-brand-600" />
                          <span>Coach</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete analysis record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
