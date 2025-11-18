import React, { useState } from 'react';
import { LANDING_ICONS } from '../constants';
import { UserRole } from '../types';

export const AuthPage: React.FC<{
  onLoginStudent: (name: string) => void;
  onLoginParent: (name: string) => void;
  onRegister: (name: string) => void;
  onLoginAdmin: (name: string) => void;
  onBack: () => void;
}> = ({ onLoginStudent, onLoginParent, onRegister, onLoginAdmin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT_MS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = name.trim().length >= 2 && (mode === 'register' ? email && password : true);

  const submit = () => {
    if (!canSubmit) return;
    if (role === UserRole.ADMIN) {
      onLoginAdmin(name.trim());
      return;
    }
    if (mode === 'register') {
      onRegister(name.trim());
    } else {
      if (role === UserRole.PARENT) onLoginParent(name.trim());
      else onLoginStudent(name.trim());
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-900">
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-100 via-white to-accent-purple/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full" style={{background:'radial-gradient(closest-side, rgba(6,182,212,0.28), transparent 70%)', filter:'blur(40px)', animation:'blobMove 18s ease-in-out infinite'}}></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full" style={{background:'radial-gradient(closest-side, rgba(168,85,247,0.24), transparent 70%)', filter:'blur(50px)', animation:'blobMove 22s ease-in-out infinite reverse'}}></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full" style={{background:'radial-gradient(closest-side, rgba(249,115,22,0.20), transparent 70%)', filter:'blur(45px)', animation:'blobMove 26s ease-in-out infinite'}}></div>
        </div>
        <div className="relative z-10 text-center text-slate-900 dark:text-white px-10">
          <div className="group mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur animate-heartbeat transition-all duration-300 hover:bg-white/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:ring-2 hover:ring-cyan-300">
            {LANDING_ICONS.logo}
          </div>
          <h1 className="mt-6 text-4xl font-black">SafeLearn</h1>
          <p className="mt-3 text-slate-700 dark:text-slate-300">Giáo dục giới tính an toàn, khoa học & thân thiện</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-left">
            <div className="group p-3 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 hover:shadow-xl hover:-translate-y-1">
              <div className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/20 flex items-center justify-center text-cyan-500 ring-1 ring-slate-200 dark:ring-white/10 transition-all duration-300 group-hover:ring-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]">{LANDING_ICONS.shield}</div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">100% Ẩn danh</p>
            </div>
            <div className="group p-3 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 hover:shadow-xl hover:-translate-y-1">
              <div className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/20 flex items-center justify-center text-accent-orange ring-1 ring-slate-200 dark:ring-white/10 transition-all duration-300 group-hover:ring-orange-300 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.35)]">{LANDING_ICONS.expert}</div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">Chuyên gia hỗ trợ</p>
            </div>
            <div className="group p-3 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 hover:shadow-xl hover:-translate-y-1">
              <div className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/20 flex items-center justify-center text-accent-purple ring-1 ring-slate-200 dark:ring-white/10 transition-all duration-300 group-hover:ring-purple-300 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">Tương tác dễ hiểu</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes blobMove { 0% { transform: translate(0,0) scale(1);} 50% { transform: translate(10px,-12px) scale(1.08);} 100% { transform: translate(0,0) scale(1);} }
        @keyframes heartbeat { 0% { transform: scale(1);} 25% { transform: scale(1.08);} 40% { transform: scale(1);} 60% { transform: scale(1.08);} 100% { transform: scale(1);} }
        .animate-heartbeat { animation: heartbeat 1.8s ease-in-out infinite; }`}</style>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
              {LANDING_ICONS.logo}
              <span className="text-xl font-extrabold">SafeLearn</span>
            </div>
            <button onClick={onBack} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300">Quay lại</button>
          </div>
          <div className="mt-6 flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full w-fit">
            <button onClick={() => setMode('login')} className={`px-4 py-2 text-sm font-bold rounded-full ${mode==='login' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>Đăng nhập</button>
            <button onClick={() => setMode('register')} className={`px-4 py-2 text-sm font-bold rounded-full ${mode==='register' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>Đăng ký</button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ tên</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full p-3 bg-white dark:bg-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500" />
            </div>
            {mode==='register' && (
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full p-3 bg-white dark:bg-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500" />
              </div>
            )}
            {mode==='register' && (
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full p-3 bg-white dark:bg-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500" />
              </div>
            )}
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Chọn vai trò</p>
            <div className="flex flex-wrap gap-2">
              {[UserRole.STUDENT_MS, UserRole.STUDENT_HS, UserRole.PARENT, UserRole.ADMIN].map(r => (
                <button key={r} onClick={()=>setRole(r)} className={`px-3 py-1.5 text-sm font-bold rounded-full border ${role===r ? 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'}`}>{r===UserRole.STUDENT_MS?'THCS':r===UserRole.STUDENT_HS?'THPT':r===UserRole.PARENT?'Phụ Huynh':'Admin'}</button>
              ))}
            </div>
          </div>
          <button disabled={!canSubmit} onClick={submit} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 disabled:bg-slate-400 disabled:dark:bg-slate-700 text-white font-bold py-3 rounded-lg transition">
            {mode==='register' ? 'Đăng ký' : 'Tiếp tục'}
          </button>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">Đăng nhập Admin sẽ vào thẳng trang quản trị.</p>
        </div>
      </div>
    </div>
  );
};