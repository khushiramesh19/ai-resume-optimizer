import React, { useEffect, useState } from 'react';
import { HealthResponse } from '../types';
import { getHealth } from '../services/api';
import {
  Settings as SettingsIcon,
  Cpu,
  ShieldCheck,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Key,
  Loader2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealth()
      .then((data) => setHealth(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Diagnostics, AI provider configuration, and local privacy management
        </p>
      </div>

      {/* AI & Backend Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">AI Integration Status</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">v1.0.0</span>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : health ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Backend Server</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Healthy & Online</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Google Gemini AI</span>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {health.ai_status.gemini_active ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Configured
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Unset (Key Missing)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">OpenAI GPT</span>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {health.ai_status.openai_active ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Configured
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Unset (Key Missing)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Provider notice */}
            <div className="p-4 bg-brand-50/50 border border-brand-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-brand-900">
                <Key className="w-4 h-4 text-brand-600" />
                <span>Active Rewriter Engine: {health.ai_status.provider.toUpperCase()}</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                To activate generative rewrites with external LLMs, set <code>GEMINI_API_KEY</code> or <code>OPENAI_API_KEY</code> in <code>backend/.env</code> and restart the backend service. If neither key is supplied, ResuMate AI automatically runs high-speed rule-based structural enhancements with zero data transmission.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-600">Could not reach backend health check.</p>
        )}
      </div>

      {/* Database & Privacy Info */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Persistence Architecture</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Local Development Storage:</strong> Analyses are stored locally in an embedded SQLite database (<code>resumate.db</code>) via SQLAlchemy ORM.
          </p>
          <p>
            • <strong>Production Readiness:</strong> The data layer follows the Repository pattern. You can migrate to production PostgreSQL simply by pointing the <code>DATABASE_URL</code> environment variable to a Postgres instance.
          </p>
        </div>
      </div>
    </div>
  );
};
