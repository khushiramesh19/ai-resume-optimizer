import React from 'react';
import { RecommendationItem } from '../types';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: RecommendationItem[];
  onTriggerRewrite?: (sampleText: string, context: string) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onTriggerRewrite,
}) => {
  const getPriorityBadge = (priority: RecommendationItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Prioritized Action Items</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked steps to maximize your estimated ATS match score and recruiter readability
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          <Zap className="w-3.5 h-3.5" />
          <span>High Impact</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {rec.category}
                </span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${getPriorityBadge(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-7">
              {rec.description}
            </p>

            {rec.action_type === 'rewrite' && onTriggerRewrite && (
              <div className="pl-7 pt-1">
                <button
                  onClick={() => onTriggerRewrite('', rec.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-100/70 hover:bg-brand-100 active:bg-brand-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Open AI Rewriter for this item</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
