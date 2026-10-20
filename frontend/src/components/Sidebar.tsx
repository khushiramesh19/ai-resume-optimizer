import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  Files,
  MessageSquareCode,
  Settings,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Resume', to: '/analyze', icon: FileSearch, badge: 'Core' },
    { label: 'My Resumes', to: '/resumes', icon: Files },
    { label: 'Interview Coach', to: '/interview-coach', icon: MessageSquareCode, badge: 'AI' },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 ${className}`}>
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md ${
                    item.badge === 'AI' 
                      ? 'bg-brand-100 text-brand-700' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className="p-4 m-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local & Confidential</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Resumes are parsed securely on your device environment. Text is never retained for model retraining.
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>ResuMate AI v1.0</span>
          <span className="text-emerald-600 flex items-center gap-1 font-sans font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
