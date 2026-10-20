import React from 'react';
import { CategoryScores } from '../types';
import { KeyRound, Wrench, Briefcase, FileCheck, LayoutList, Trophy } from 'lucide-react';

interface CategoryBreakdownProps {
  scores: CategoryScores;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ scores }) => {
  const categories = [
    {
      key: 'keyword_alignment',
      name: 'Keyword Alignment',
      weight: '25%',
      score: scores.keyword_alignment,
      icon: KeyRound,
      description: 'Density & presence of primary keywords from the job description.',
    },
    {
      key: 'required_skills',
      name: 'Required Skill Coverage',
      weight: '25%',
      score: scores.required_skills,
      icon: Wrench,
      description: 'Coverage of essential tools, frameworks, and core technologies.',
    },
    {
      key: 'relevant_experience',
      name: 'Relevant Experience',
      weight: '20%',
      score: scores.relevant_experience,
      icon: Briefcase,
      description: 'Alignment of past role titles, responsibilities, and depth.',
    },
    {
      key: 'section_completeness',
      name: 'Section Completeness',
      weight: '10%',
      score: scores.section_completeness,
      icon: LayoutList,
      description: 'Presence of standard sections (Experience, Education, Skills, Projects).',
    },
    {
      key: 'formatting_parsing',
      name: 'Formatting & Parsing',
      weight: '10%',
      score: scores.formatting_parsing,
      icon: FileCheck,
      description: 'Clean text extraction without layout or encoding corruption.',
    },
    {
      key: 'achievement_quality',
      name: 'Achievement Quality',
      weight: '10%',
      score: scores.achievement_quality,
      icon: Trophy,
      description: 'Use of active verbs and measurable outcomes (%, $, metrics).',
    },
  ];

  const getBarColor = (val: number) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = (val: number) => {
    if (val >= 75) return 'text-emerald-700';
    if (val >= 50) return 'text-amber-700';
    return 'text-rose-700';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Score Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized evaluation across 6 weighted ATS compatibility dimensions
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Total Weight: 100%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">{cat.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Weight: {cat.weight}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${getTextColor(cat.score)}`}>
                    {cat.score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${getBarColor(cat.score)}`}
                  style={{ width: `${Math.min(100, Math.max(5, cat.score))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
