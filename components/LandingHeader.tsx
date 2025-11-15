import React from 'react';
import { LANDING_ICONS } from '../constants';

export const LandingHeader: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => (
  <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2 rounded-full" aria-label="Về Trang chủ">
          {LANDING_ICONS.logo}
          <span className="font-bold text-xl text-slate-900">SafeLearn</span>
        </button>
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors">Tính năng</button>
          <button onClick={() => onNavigate('Khóa học')} className="text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors">Khóa học</button>
          <button onClick={() => onNavigate('Phụ huynh')} className="text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors">Phụ huynh</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors">Liên hệ</button>
        </nav>
        <div className="flex items-center space-x-2">
          <button className="text-sm font-bold text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">Đăng nhập</button>
          <button onClick={() => onNavigate('Bắt đầu học')} className="text-sm font-bold text-white bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">Bắt đầu học</button>
        </div>
      </div>
    </div>
  </header>
);