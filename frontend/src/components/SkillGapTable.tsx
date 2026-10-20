import React, { useState } from 'react';
import { SkillMatchItem } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Filter, Sparkles } from 'lucide-react';

interface SkillGapTableProps {
  skills: SkillMatchItem[];
  onTriggerRewrite?: (suggestionText: string, skill: string) => void;
}

export const SkillGapTable: React.FC<SkillGapTableProps> = ({ skills, onTriggerRewrite }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'demonstrated' | 'mentioned' | 'missing'>('all');

  const filtered = skills.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  const getStatusBadge = (status: SkillMatchItem['status']) => {
    switch (status) {
      case 'demonstrated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Demonstrated
          </span>
        );
      case 'mentioned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Mentioned
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Missing
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Skill & Requirement Evidence Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed validation of whether target skills are demonstrated with evidence, merely mentioned, or missing
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            All ({skills.length})
          </button>
          <button
            onClick={() => setStatusFilter('demonstrated')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'demonstrated' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Demonstrated
          </button>
          <button
            onClick={() => setStatusFilter('mentioned')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'mentioned' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Mentioned
          </button>
          <button
            onClick={() => setStatusFilter('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'missing' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Missing
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Skill / Requirement</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Match Status</th>
              <th className="py-3 px-4">Evidence from Resume</th>
              <th className="py-3 px-4">Actionable Suggestion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  {item.skill}
                </td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs">
                  {item.evidence ? (
                    <blockquote className="italic border-l-2 border-brand-300 pl-2 text-slate-700 font-mono text-[11px] bg-slate-50/80 py-1 rounded-r">
                      "{item.evidence}"
                    </blockquote>
                  ) : (
                    <span className="text-slate-400 italic">No direct context found in document</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="leading-relaxed">{item.suggestion}</span>
                    {item.status !== 'demonstrated' && onTriggerRewrite && (
                      <button
                        onClick={() => onTriggerRewrite(item.evidence || `Experience with ${item.skill}`, item.skill)}
                        className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded-md transition-colors"
                        title="Draft bullet with AI"
                      >
                        <Sparkles className="w-3 h-3" />
                        Rewrite
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
