import React, { useState } from 'react';
import { KeywordItem } from '../types';
import { Check, X, Search, Hash } from 'lucide-react';

interface KeywordMatcherProps {
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
}

export const KeywordMatcher: React.FC<KeywordMatcherProps> = ({
  matchedKeywords,
  missingKeywords,
}) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');
  const [search, setSearch] = useState('');

  const allKeywords = [
    ...matchedKeywords.map((k) => ({ ...k, status: 'matched' as const })),
    ...missingKeywords.map((k) => ({ ...k, status: 'missing' as const })),
  ];

  const filtered = allKeywords.filter((k) => {
    if (filter === 'matched' && k.status !== 'matched') return false;
    if (filter === 'missing' && k.status !== 'missing') return false;
    if (search.trim() && !k.keyword.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Keyword Alignment</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keywords extracted from the job description and checked against your resume
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            All ({allKeywords.length})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'matched' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Matched ({matchedKeywords.length})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'missing' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Keywords Grid */}
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
          {filtered.map((k) => {
            const isMatched = k.status === 'matched';
            return (
              <div
                key={k.keyword}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                  isMatched
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-50'
                    : 'bg-rose-50/60 border-rose-200 text-rose-900 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  {isMatched ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span>{k.keyword}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 border-l border-slate-200/70 pl-2">
                  <span title="Occurrences in Job Description">JD: {k.frequency_in_jd}x</span>
                  {isMatched && (
                    <span title="Occurrences in Resume">| Res: {k.frequency_in_resume}x</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          No keywords match your search query.
        </div>
      )}
    </div>
  );
};
