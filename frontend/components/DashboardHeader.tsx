import React, { useLayoutEffect, useRef, useState } from 'react';
import { LANDING_ICONS, ICONS } from '../constants';
import { UserRole, View } from '../types';

export const DashboardHeader: React.FC<{
  currentView: View;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  setView: (view: View) => void;
  onLogoClick: () => void;
}> = ({ currentView, userRole, setUserRole, setView, onLogoClick }) => {
  const isStudent = userRole === UserRole.STUDENT_MS || userRole === UserRole.STUDENT_HS;
  const isParent = userRole === UserRole.PARENT;
  const isAdmin = userRole === UserRole.ADMIN;
  
  let homeView: View;
  if(isStudent) homeView = View.STUDENT_DASHBOARD;
  else if(isParent) homeView = View.PARENT_DASHBOARD;
  else homeView = View.ADMIN_DASHBOARD;
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number }>({ x: 0, width: 0 });

  const NavButton = React.forwardRef<HTMLButtonElement, { view: View; icon: React.ReactNode; label: string }>(
    ({ view, icon, label }, ref) => {
      const isActive = currentView === view;
      return (
        <button
          ref={ref}
          onClick={() => setView(view)}
          className={`relative z-10 inline-flex h-10 items-center justify-center gap-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap min-w-[120px] sm:min-w-[140px] ${isActive ? 'text-cyan-600' : 'text-slate-500 hover:bg-cyan-500/10'}`}
        >
          <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
          <span className="leading-none">{label}</span>
        </button>
      );
    }
  );

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const activeBtn = btnRefs.current[currentView as number];
      if (!container || !activeBtn) return;
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft || '0');
      const x = btnRect.left - containerRect.left - paddingLeft;
      const width = btnRect.width;
      setIndicator({ x, width });
    };
    requestAnimationFrame(update);
    const onResize = () => requestAnimationFrame(update);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentView, userRole]);
  
  return (
    <header className="sticky top-0 z-40 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
          <button onClick={onLogoClick} aria-label="Về Trang chủ" className="flex items-center space-x-2 rounded-full">
            {LANDING_ICONS.logo}
            <span className="text-xl font-bold text-slate-900 dark:text-white">SafeLearn</span>
          </button>
          <div ref={containerRef} className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full antialiased overflow-hidden">
            <div
              className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-md ring-1 ring-white/50 dark:ring-white/10 shadow shadow-slate-900/10 transition-all duration-300 pointer-events-none z-0 overflow-hidden"
              style={{ width: `${indicator.width}px`, transform: `translateX(${indicator.x}px)`, willChange: 'transform,width' }}
            />
            {currentView === View.MOODTRACKER ? (
              <>
                <NavButton ref={(el) => (btnRefs.current[View.MOODTRACKER] = el)} view={View.MOODTRACKER} icon={ICONS.pencil} label="Nhật kí cảm xúc" />
              </>
            ) : isAdmin ? (
              <NavButton ref={(el) => (btnRefs.current[View.ADMIN_DASHBOARD] = el)} view={View.ADMIN_DASHBOARD} icon={ICONS.admin} label="Thống kê" />
            ) : (
              <>
                <NavButton ref={(el) => (btnRefs.current[homeView] = el)} view={homeView} icon={ICONS.dashboard} label="Tổng quan" />
                {isStudent && <NavButton ref={(el) => (btnRefs.current[View.SCENARIOS] = el)} view={View.SCENARIOS} icon={ICONS.scenarios} label="Tình huống" />}
                <NavButton ref={(el) => (btnRefs.current[View.QA] = el)} view={View.QA} icon={ICONS.qa} label="Hỏi Đáp" />
                <NavButton ref={(el) => (btnRefs.current[View.MAP] = el)} view={View.MAP} icon={ICONS.map} label="Bản Đồ" />
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isParent && currentView !== View.MOODTRACKER && (
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center">
                {(() => {
                  const base = [UserRole.STUDENT_MS, UserRole.STUDENT_HS];
                  const roles = userRole === UserRole.ADMIN ? [...base, UserRole.ADMIN] : base;
                  return roles;
                })().map(role => (
                  <button key={role}
                      onClick={() => setUserRole(role)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-300 ${userRole === role ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text.white shadow-md' : 'text-slate-500 dark:text-slate-300'}`}
                  >
                     {role === UserRole.STUDENT_MS ? "THCS" : role === UserRole.STUDENT_HS ? "THPT" : "Admin"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
