import React from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 200,
  strokeWidth = 14,
  showDetails = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let colorClass = 'text-emerald-600';
  let strokeClass = 'stroke-emerald-500';
  let bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let label = 'Strong Compatibility';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;

  if (score < 50) {
    colorClass = 'text-rose-600';
    strokeClass = 'stroke-rose-500';
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    label = 'Action Required';
    icon = <AlertCircle className="w-4 h-4 text-rose-600" />;
  } else if (score < 75) {
    colorClass = 'text-amber-600';
    strokeClass = 'stroke-amber-500';
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Moderate Compatibility';
    icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
  }

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-slate-100"
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-extrabold tracking-tight ${colorClass}`}>
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            out of 100
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2 w-full">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm font-semibold text-slate-800">
              Estimated ATS Compatibility
            </span>
            <div className="group relative cursor-pointer" title="Score is calculated using 6 deterministic, explainable criteria. Different ATS systems and recruiters evaluate resumes with varying algorithms.">
              <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bgClass}`}>
            {icon}
            <span>{label}</span>
          </div>

          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed pt-1">
            Calculated across keyword coverage, verified skills, relevant experience depth, and formatting integrity.
          </p>
        </div>
      )}
    </div>
  );
};
