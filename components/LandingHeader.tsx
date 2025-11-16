import React from 'react';
import { LANDING_ICONS, ICONS } from '../constants';

export const LandingHeader: React.FC<{ onNavigate: (target: string) => void; isLoggedIn?: boolean; userName?: string; isDark?: boolean; onToggleDark?: () => void }> = ({ onNavigate, isLoggedIn = false, userName, isDark = false, onToggleDark }) => {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerEl = document.querySelector('header') as HTMLElement | null;
    const offset = headerEl ? headerEl.offsetHeight : 0;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2 rounded-full" aria-label="Về Trang chủ">
            {LANDING_ICONS.logo}
            <span className="font-bold text-xl text-slate-900 dark:text-white">SafeLearn</span>
          </button>
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToId('features')} className="text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-cyan-500 hover:dark:text-cyan-300 transition-colors">Tính năng</button>
            <button onClick={() => onNavigate('Khóa học')} className="text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-cyan-500 hover:dark:text-cyan-300 transition-colors">Khóa học</button>
            <button onClick={() => onNavigate('Phụ huynh')} className="text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-cyan-500 hover:dark:text-cyan-300 transition-colors">Phụ huynh</button>
            <button onClick={() => scrollToId('contact')} className="text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-cyan-500 hover:dark:text-cyan-300 transition-colors">Liên hệ</button>
          </nav>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <button onClick={() => onNavigate('Khóa học')} className="text-sm font-bold text-white bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-4 py-2 rounded-lg hover:bg-cyan-700 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors">
                Xin chào, {userName || 'bạn'}
              </button>
            ) : (
              <>
                <button onClick={() => onToggleDark && onToggleDark()} aria-label="Chuyển chế độ tối" className="flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 hover:dark:bg-slate-700 transition-colors">
                  {isDark ? ICONS.sun : ICONS.moon}
                  <span className="hidden sm:inline">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button onClick={() => onNavigate('Bắt đầu học')} className="text-sm font-bold text-white bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-4 py-2 rounded-lg hover:bg-cyan-600 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors">Bắt đầu học</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};