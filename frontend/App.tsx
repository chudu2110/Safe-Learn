import React, { useEffect, useState } from 'react';
import { LandingPage as LandingPageExternal } from './pages/LandingPage';
import { UserRole, View } from './types';
import { SplashScreen } from './components/SplashScreen';
import { AuthPage } from './pages/AuthPage';
import { DashboardHeader } from './components/DashboardHeader';
import { QAPage } from './pages/QAPage';
import { MapPage } from './pages/MapPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const AUTH_DISABLED = ((import.meta.env.VITE_DISABLE_AUTH ?? 'false') === 'true') || ((import.meta.env.VITE_DISABLE_AUTH ?? 'false') === '1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT_MS);
  const [currentView, setCurrentView] = useState<View>(View.STUDENT_DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);
  const [username, setUsername] = useState<string>('');
  const APP_STATE_KEY = 'safelearn_app_state';

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state as { login?: boolean; role?: UserRole; view?: View } | null;
      if (s && typeof s.login === 'boolean' && s.role && s.view) {
        setIsLoggedIn(s.login);
        setUserRole(s.role);
        setCurrentView(s.view);
      } else {
        const savedRaw = localStorage.getItem(APP_STATE_KEY);
        if (savedRaw) {
          try {
            const saved = JSON.parse(savedRaw) as { login: boolean; role: UserRole; view: View };
            setIsLoggedIn(saved.login);
            setUserRole(saved.role);
            setCurrentView(saved.view);
            window.history.replaceState(saved, '');
          } catch {
            setIsLoggedIn(false);
            setUserRole(UserRole.STUDENT_MS);
            setCurrentView(View.STUDENT_DASHBOARD);
          }
        } else {
          setIsLoggedIn(false);
          setUserRole(UserRole.STUDENT_MS);
          setCurrentView(View.STUDENT_DASHBOARD);
        }
      }
    };
    window.addEventListener('popstate', onPop);
    const savedRaw = localStorage.getItem(APP_STATE_KEY);
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw) as { login: boolean; role: UserRole; view: View };
        setIsLoggedIn(saved.login);
        setUserRole(saved.role);
        setCurrentView(saved.view);
        window.history.replaceState(saved, '');
      } catch {
        window.history.replaceState({ login: false, role: UserRole.STUDENT_MS, view: View.STUDENT_DASHBOARD }, '');
      }
    } else {
      window.history.replaceState({ login: false, role: UserRole.STUDENT_MS, view: View.STUDENT_DASHBOARD }, '');
    }
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const pushAppState = (login: boolean, role: UserRole, view: View) => {
    setIsLoggedIn(login);
    setUserRole(role);
    setCurrentView(view);
    try { localStorage.setItem(APP_STATE_KEY, JSON.stringify({ login, role, view })); } catch {}
    window.history.pushState({ login, role, view }, '');
  };

  const handleNavigate = (target: string) => {
    if (!isLoggedIn) {
      if (AUTH_DISABLED) {
        if (target === 'Phụ huynh' || target === 'Dành cho phụ huynh') {
          pushAppState(true, UserRole.PARENT, View.PARENT_DASHBOARD);
        } else {
          pushAppState(true, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD);
        }
      } else {
        if (
          target === 'Bắt đầu học' ||
          target === 'Khóa học' ||
          target === 'Phụ huynh' ||
          target === 'Dành cho phụ huynh' ||
          target === 'Đăng nhập'
        ) {
          pushAppState(false, UserRole.STUDENT_MS, View.AUTH);
        }
      }
      return;
    }
    if (isLoggedIn && target === 'Khóa học') {
      if (userRole !== UserRole.PARENT) {
        pushAppState(true, userRole, View.STUDENT_DASHBOARD);
      }
      return;
    }
    if (isLoggedIn && (target === 'Phụ huynh' || target === 'Dành cho phụ huynh')) {
      if (userRole === UserRole.PARENT) {
        pushAppState(true, userRole, View.PARENT_DASHBOARD);
      }
      return;
    }
  };
  
  const handleSetUserRoleAndSwitchView = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      pushAppState(true, role, View.ADMIN_DASHBOARD);
    } else if (role === UserRole.PARENT) {
      pushAppState(true, role, View.PARENT_DASHBOARD);
    } else {
      pushAppState(true, role, View.STUDENT_DASHBOARD);
    }
  };

  if (showSplash) {
    return <SplashScreen/>;
  }
  if (!isLoggedIn) {
    if (currentView === View.AUTH) {
      return (
        <AuthPage
          onLoginStudent={(name) => { setUsername(name); pushAppState(true, UserRole.STUDENT_MS, View.HOME); }}
          onLoginParent={(name) => { setUsername(name); pushAppState(true, UserRole.PARENT, View.HOME); }}
          onRegister={(name) => { setUsername(name); pushAppState(true, UserRole.STUDENT_MS, View.HOME); }}
          onLoginAdmin={(name) => { setUsername(name); pushAppState(true, UserRole.ADMIN, View.ADMIN_DASHBOARD); }}
          onBack={() => pushAppState(false, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD)}
        />
      );
    }
    return <LandingPageExternal onNavigate={handleNavigate} />;
  }

  if (currentView === View.HOME) {
    const onLogout = () => { setUsername(''); pushAppState(false, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD); };
    return <LandingPageExternal onNavigate={handleNavigate} isLoggedIn={true} userName={username} onLogout={onLogout} />;
  }

  const isStudent = userRole === UserRole.STUDENT_MS || userRole === UserRole.STUDENT_HS;
  const renderView = () => {
    switch(currentView) {
      case View.STUDENT_DASHBOARD:
        return isStudent ? <StudentDashboard userRole={userRole} /> : <ParentDashboard setView={(v) => pushAppState(true, userRole, v)} />;
      case View.PARENT_DASHBOARD:
        return <ParentDashboard setView={(v) => pushAppState(true, userRole, v)} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      case View.SCENARIOS:
        return isStudent ? <ScenarioPage /> : <StudentDashboard userRole={userRole} />;
      case View.MAP:
        return <MapPage />;
      case View.QA:
        return <QAPage />;
      default:
        return userRole === UserRole.ADMIN ? <AdminDashboard /> : isStudent ? <StudentDashboard userRole={userRole} /> : <ParentDashboard setView={(v) => pushAppState(true, userRole, v)} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <DashboardHeader 
        currentView={currentView}
        userRole={userRole} 
        setUserRole={handleSetUserRoleAndSwitchView} 
        setView={(view) => {
          if (userRole === UserRole.PARENT && view !== View.PARENT_DASHBOARD) return;
          if (userRole !== UserRole.PARENT && view === View.PARENT_DASHBOARD) return;
          pushAppState(true, userRole, view);
        }}
        onLogoClick={() => pushAppState(true, userRole, View.HOME)}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
}
