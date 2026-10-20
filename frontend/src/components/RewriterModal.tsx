import React, { useState } from 'react';
import { RewriteRequest, RewriteResponse } from '../types';
import { rewriteContent } from '../services/api';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Edit3,
  ShieldAlert,
  Loader2,
  Wand2,
  Info
} from 'lucide-react';

interface RewriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  contextHint?: string;
  targetRole?: string;
  onAccept?: (acceptedText: string) => void;
}

export const RewriterModal: React.FC<RewriterModalProps> = ({
  isOpen,
  onClose,
  initialText = '',
  contextHint = '',
  targetRole = '',
  onAccept,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [style, setStyle] = useState<'professional' | 'concise' | 'technical' | 'impact-focused'>('impact-focused');
  const [sectionType, setSectionType] = useState<'bullet' | 'summary' | 'headline' | 'project'>('bullet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [editedResult, setEditedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sync initialText when modal opens or prop changes
  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      setResult(null);
      setEditedResult('');
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      setError('Please provide text or a bullet point to optimize.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await rewriteContent({
        text: inputText,
        style,
        section_type: sectionType,
        target_role: targetRole,
      });
      setResult(response);
      setEditedResult(response.rewritten);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate rewritten text.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedResult : (result?.rewritten || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    const finalVal = isEditing ? editedResult : (result?.rewritten || inputText);
    if (onAccept) onAccept(finalVal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Resume Rewriter</h3>
              <p className="text-xs text-slate-500">
                Enhance bullet points and summaries with factual integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            {/* Style Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Tone & Style:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                {(['impact-focused', 'professional', 'concise', 'technical'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                      style === s
                        ? 'bg-brand-600 text-white shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Section:</span>
              <select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value as any)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <option value="bullet">Experience Bullet Point</option>
                <option value="summary">Professional Summary</option>
                <option value="headline">Resume Headline</option>
                <option value="project">Project Description</option>
              </select>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original / Editable Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original Text
                </label>
                <span className="text-[11px] text-slate-400">
                  {inputText.length} characters
                </span>
              </div>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the bullet point or summary you wish to improve... e.g., 'Responsible for backend APIs and making the site faster.'"
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans leading-relaxed text-slate-800 placeholder:text-slate-400 resize-none"
              />
              <button
                onClick={handleRewrite}
                disabled={loading || !inputText.trim()}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing with AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Rewritten Version</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Rewritten Result */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Optimized Suggestion</span>
                </label>
                {result && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded text-xs inline-flex items-center gap-1"
                      title="Edit this suggestion"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded text-xs inline-flex items-center gap-1"
                      title="Copy suggestion"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {result ? (
                <div className="space-y-3">
                  {isEditing ? (
                    <textarea
                      rows={6}
                      value={editedResult}
                      onChange={(e) => setEditedResult(e.target.value)}
                      className="w-full text-xs p-3.5 bg-white border border-brand-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed text-slate-800"
                    />
                  ) : (
                    <div className="p-3.5 min-h-[148px] bg-brand-50/40 border border-brand-200/80 rounded-xl text-xs text-slate-900 leading-relaxed font-medium">
                      {editedResult || result.rewritten}
                    </div>
                  )}

                  {/* Improvements list */}
                  {result.improvements_made && result.improvements_made.length > 0 && (
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        Enhancements Made:
                      </p>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                        {result.improvements_made.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback notes if API key is missing */}
                  {!result.ai_configured && result.notes && (
                    <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
                      <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <span>{result.notes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[148px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center bg-slate-50/50">
                  <Sparkles className="w-6 h-6 text-slate-300 mb-1" />
                  <p className="text-xs text-slate-400">
                    Click "Generate Rewritten Version" to see side-by-side improvements.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Factual Integrity Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-800">Strict Factual Integrity Policy</p>
              <p>
                ResuMate AI never fabricates metrics, credentials, or work experience. If a bracketed placeholder like <code>[insert % increase]</code> appears, replace it with your authentic verified achievement.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            Cancel / Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!result}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 px-3.5 py-2 rounded-xl transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Suggestion'}</span>
            </button>
            <button
              onClick={handleAccept}
              disabled={!result}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
