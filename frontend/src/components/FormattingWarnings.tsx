import React from 'react';
import { FormattingWarning } from '../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface FormattingWarningsProps {
  warnings: FormattingWarning[];
}

export const FormattingWarnings: React.FC<FormattingWarningsProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-950">Clean Formatting & Parsing Structure</h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Your resume was parsed successfully without formatting roadblocks, layout corruptions, or missing contact anchors.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityConfig = (severity: FormattingWarning['severity']) => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertCircle,
          border: 'border-rose-200',
          bg: 'bg-rose-50/70',
          badge: 'bg-rose-100 text-rose-700',
          titleColor: 'text-rose-950',
          textColor: 'text-rose-800'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          border: 'border-amber-200',
          bg: 'bg-amber-50/70',
          badge: 'bg-amber-100 text-amber-700',
          titleColor: 'text-amber-950',
          textColor: 'text-amber-800'
        };
      default:
        return {
          icon: Info,
          border: 'border-slate-200',
          bg: 'bg-slate-50',
          badge: 'bg-slate-100 text-slate-700',
          titleColor: 'text-slate-900',
          textColor: 'text-slate-700'
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">Formatting & ATS Parsing Diagnostics</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Issues detected that could prevent recruiter tracking systems from properly indexing your credentials
        </p>
      </div>

      <div className="space-y-3">
        {warnings.map((w, idx) => {
          const cfg = getSeverityConfig(w.severity);
          const Icon = cfg.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} space-y-2 transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0 text-slate-700" />
                  <span className={`text-xs font-bold ${cfg.titleColor}`}>{w.title}</span>
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${cfg.badge}`}>
                  {w.severity} priority
                </span>
              </div>
              <p className={`text-xs ${cfg.textColor} leading-relaxed`}>{w.detail}</p>
              <div className="pt-1 text-[11px] font-medium text-slate-700 flex items-start gap-1.5 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                <span className="font-bold text-slate-900">Recommended fix:</span>
                <span>{w.fix_suggestion}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
