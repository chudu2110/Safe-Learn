import React from 'react';
import { LANDING_ICONS } from '../constants';

export const SplashScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-accent-purple/10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
    <div className="absolute top-12 left-10 w-6 h-6 rounded-full bg-cyan-100 dark:bg-white/10 animate-floating"></div>
    <div className="absolute bottom-14 right-16 w-8 h-8 rounded-full bg-rose-100 dark:bg-white/10 animate-floating"></div>
    <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-accent-orange/30 dark:bg-white/10 animate-floating"></div>
    <div className="text-center">
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-b-accent-purple border-l-transparent border-r-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-cyan-200 dark:border-white/10 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl dark:shadow-[0_0_24px_rgba(6,182,212,0.25)]">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white">{LANDING_ICONS.logo}</div>
        </div>
      </div>
      <p className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">SafeLearn</p>
      <p className="mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-accent-purple dark:from-cyan-400 dark:to-accent-purple">Giáo dục an toàn, khoa học & thân thiện</p>
      <div className="mt-6 w-48 h-2 bg-slate-200 dark:bg-white/10 rounded-full mx-auto overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-cyan-500 to-accent-purple rounded-full dark:shadow-[0_0_18px_rgba(6,182,212,0.45)]" style={{ animation: 'loadingSlide 1.4s ease-in-out infinite' }}></div>
      </div>
    </div>
    <style>{`@keyframes loadingSlide { 0% { transform: translateX(-100%);} 50% { transform: translateX(0%);} 100% { transform: translateX(100%);} }`}</style>
  </div>
);