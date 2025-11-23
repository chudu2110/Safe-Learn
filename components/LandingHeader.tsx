import React, { useEffect, useRef, useState } from 'react';
import { LANDING_ICONS, ICONS } from '../constants';

export const LandingHeader: React.FC<{ onNavigate: (target: string) => void; isLoggedIn?: boolean; userName?: string; isDark?: boolean; onToggleDark?: () => void; onLogout?: () => void }> = ({ onNavigate, isLoggedIn = false, userName, isDark = false, onToggleDark, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      const target = e.target as Node | null;
      if (target && !menuRef.current.contains(target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);
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
            <button onClick={() => onToggleDark && onToggleDark()} aria-label="Chuyển chế độ tối" className="flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 hover:dark:bg-slate-700 transition-colors">
              {isDark ? ICONS.sun : ICONS.moon}
              <span className="hidden sm:inline">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(o => !o)} className="text-sm font-bold text-white bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-4 py-2 rounded-lg hover:bg-cyan-700 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors flex items-center gap-2">
                  <span>Xin chào, {userName || 'bạn'}</span>
                  <span className="text-white/90">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-auto max-h-60 z-50">
                    <button onClick={() => { onNavigate('Khóa học'); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-700">Hồ sơ của tôi</button>
                    <button onClick={() => { onLogout && onLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:dark:bg-slate-700">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onNavigate('Bắt đầu học')} className="text-sm font-bold text-white bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-4 py-2 rounded-lg hover:bg-cyan-600 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors">Bắt đầu học</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};