import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InterviewResponse, AnalysisListItem } from '../types';
import { getAnalyses, getInterviewPrep, getGenericInterviewPrep } from '../services/api';
import {
  Sparkles,
  HelpCircle,
  Briefcase,
  UserCheck,
  Code2,
  FolderGit2,
  Loader2,
  Info,
  PenTool,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const InterviewCoachPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryAnalysisId = searchParams.get('analysisId');

  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(queryAnalysisId || '');
  const [customRole, setCustomRole] = useState('Full Stack Software Engineer');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'technical' | 'project' | 'behavioral' | 'hr'>('all');

  const [interviewData, setInterviewData] = useState<InterviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active practice answer states
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    getAnalyses()
      .then((data) => {
        setAnalyses(data);
        if (data.length > 0 && !queryAnalysisId) {
          setSelectedAnalysisId(data[0].id);
        }
      })
      .catch(() => {});
  }, [queryAnalysisId]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: InterviewResponse;
      if (selectedAnalysisId) {
        data = await getInterviewPrep(selectedAnalysisId);
      } else {
        data = await getGenericInterviewPrep(customRole);
      }
      setInterviewData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate interview preparation questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedAnalysisId]);

  const filteredQuestions = interviewData?.questions.filter((q) => {
    if (categoryFilter === 'all') return true;
    return q.category === categoryFilter;
  }) || [];

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'technical':
        return {
          icon: Code2,
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          label: 'Technical Deep-Dive'
        };
      case 'project':
        return {
          icon: FolderGit2,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Project Ownership'
        };
      case 'behavioral':
        return {
          icon: UserCheck,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Behavioral (STAR)'
        };
      case 'hr':
        return {
          icon: Briefcase,
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Culture & Motivation'
        };
      default:
        return {
          icon: HelpCircle,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          label: cat
        };
    }
  };

  const handlePracticeChange = (idx: number, text: string) => {
    setPracticeAnswers(prev => ({ ...prev, [idx]: text }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Role-Specific Interview Simulation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Interview Coach
        </h1>
        <p className="text-xs text-slate-500">
          Anticipate technical, architectural, behavioral, and culture-fit questions tailored to your resume credentials and target job requirements.
        </p>
      </div>

      {/* Role / Analysis Selector Bar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
            Context Source:
          </label>
          {analyses.length > 0 ? (
            <select
              value={selectedAnalysisId}
              onChange={(e) => setSelectedAnalysisId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500 max-w-xs"
            >
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.job_title} ({a.filename})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          )}
        </div>

        <button
          onClick={loadQuestions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Regenerate Questions</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {(['all', 'technical', 'project', 'behavioral', 'hr'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat === 'hr' ? 'HR & Fit' : cat}
          </button>
        ))}
      </div>

      {/* Guidelines Disclaimer */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Authentic Preparation Note:</span>
          <p>
            Example answer frameworks and outlines are structural blueprints to guide your thinking. Never recite fabricated experiences in an interview; always adapt responses to your own authentic history.
          </p>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-xs text-slate-500">Formulating role-specific interview scenarios...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No questions found in this category.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((q, idx) => {
            const catConfig = getCategoryBadge(q.category);
            const Icon = catConfig.icon;
            const isPracticing = activePracticeIndex === idx;
            const currentAnswer = practiceAnswers[idx] || '';

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${catConfig.badge}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{catConfig.label}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePracticeIndex(isPracticing ? null : idx)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{isPracticing ? 'Close Practice Box' : 'Practice Your Response'}</span>
                      {isPracticing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">
                      Q#{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  "{q.question}"
                </h3>

                {/* 3 Pillars: Assessment Focus, Suggested Approach, Outline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      What the Interviewer Is Assessing
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {q.assessment_focus}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Recommended Strategy (STAR Framework)
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {q.suggested_approach}
                    </p>
                  </div>
                </div>

                {/* Sample Answer Blueprint */}
                <div className="p-3.5 bg-brand-50/40 rounded-xl border border-brand-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand-600" />
                    <span>Structural Answer Outline Blueprint</span>
                  </span>
                  <pre className="text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {q.sample_outline}
                  </pre>
                </div>

                {/* Interactive Practice Box */}
                {isPracticing && (
                  <div className="p-4 bg-slate-50 border border-brand-300 rounded-xl space-y-3 pt-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-brand-600" />
                        <span>Draft Your Practice Answer (STAR Framework)</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {currentAnswer.length} characters
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={currentAnswer}
                      onChange={(e) => handlePracticeChange(idx, e.target.value)}
                      placeholder="Situation: At my previous company...&#10;Task: I needed to reduce API response latency...&#10;Action: I implemented Redis caching and query indexing...&#10;Result: We achieved a 42% latency reduction."
                      className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed text-slate-900"
                    />

                    {/* STAR Checklist */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${currentAnswer.toLowerCase().includes('situation') || currentAnswer.length > 50 ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span>Situation stated</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${currentAnswer.toLowerCase().includes('task') || currentAnswer.length > 100 ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span>Task defined</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${currentAnswer.toLowerCase().includes('action') || currentAnswer.length > 150 ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span>Action detailed</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${currentAnswer.toLowerCase().includes('result') || currentAnswer.includes('%') || currentAnswer.includes('$') ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span>Result quantified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
