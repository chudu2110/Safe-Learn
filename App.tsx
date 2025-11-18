import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { LandingPage as LandingPageExternal } from './pages/LandingPage';
import { UserRole, View, CourseModule, QASubmission, ServicePoint, MapServiceType, RoadmapItem, LeaderboardUser, Scenario, AdminStats, ModuleCompletion, UserDistribution } from './types';
import { PARENT_RESOURCES, QA_DATA, MAP_SERVICES, ICONS, LANDING_ICONS, ROADMAP_MS_DATA, ROADMAP_HS_DATA, LEADERBOARD_DATA, STUDENT_MS_COURSES, STUDENT_HS_COURSES, ADMIN_STATS_DATA, MODULE_COMPLETION_DATA, USER_DISTRIBUTION_DATA } from './constants';
import { moderateQuestion, generateScenario } from './services/geminiService';

// Custom Hook for Scroll Animations
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);
};

const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 1.2, suffix = '' }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const total = duration * 1000;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / total, 1);
      const next = Math.floor(progress * end);
      setValue(next);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <span>{value.toLocaleString('en-US')}{suffix}</span>;
};

const SplashScreen: React.FC = () => (
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

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string; phone?: string }>({});

  const validate = () => {
    const next: { name?: string; email?: string; subject?: string; message?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) next.name = 'Vui lòng nhập họ tên hợp lệ';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) next.email = 'Email không hợp lệ';
    if (!subject.trim() || subject.trim().length < 3) next.subject = 'Vui lòng nhập tiêu đề';
    if (!message.trim() || message.trim().length < 10) next.message = 'Nội dung tối thiểu 10 ký tự';
    if (phone && !/^\+?\d{7,15}$/.test(phone.trim())) next.phone = 'Số điện thoại không hợp lệ';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setIsSubmitting(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setPhone('');
    setErrors({});
  };

  const allValid = name && email && subject && message && Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit} className="scroll-animate bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 transition-transform duration-300 hover:-translate-y-1">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Số điện thoại (tuỳ chọn)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Tiêu đề</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-slate-700">Nội dung</label>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      {submitted && <p className="mt-3 text-sm font-medium text-green-600">Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất!</p>}
      <button type="submit" disabled={!allValid || isSubmitting} className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
        {isSubmitting ? 'Đang gửi...' : 'Gửi email'}
      </button>
    </form>
  );
};


// --- LANDING PAGE COMPONENTS (NEW SAFELearn DESIGN) ---

const LandingIllustration = () => (
    <svg viewBox="0 0 552 423" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M515.5 422.5H36.5C16.8939 422.5 1 405.606 1 386V36.5C1 16.8939 16.8939 1 36.5 1H515.5C535.106 1 551 16.8939 551 36.5V386C551 405.606 535.106 422.5 515.5 422.5Z" fill="#f8fafc"/>
        <path d="M515.5 422.5H36.5C16.8939 422.5 1 405.606 1 386V36.5C1 16.8939 16.8939 1 36.5 1H515.5C535.106 1 551 16.8939 551 36.5V386C551 405.606 535.106 422.5 515.5 422.5Z" stroke="#e2e8f0" strokeWidth="2"/>
        <path d="M12 28H538V108C538 117.941 529.941 126 520 126H30C20.0589 126 12 117.941 12 108V28Z" fill="#FFFFFF"/>
        <rect x="36" y="55" width="60" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="454" y="55" width="60" height="8" rx="4" fill="#e2e8f0"/>
        <path d="M165.421 278.411C165.518 274.191 165.613 269.967 165.706 265.74C165.741 264.125 165.776 262.51 165.811 260.895L165.889 257.666C166.216 243.688 176.94 232.964 190.918 232.637C198.835 232.449 206.516 235.14 212.185 240.219C216.516 244.113 219.601 249.23 220.825 254.918C221.751 259.201 221.91 263.606 221.91 267.973V273.71C221.91 275.325 221.872 276.936 221.833 278.544L221.79 280.354C221.748 282.164 221.705 283.974 221.663 285.784L221.579 289.814C221.378 298.599 214.375 305.601 205.59 305.802C199.645 305.94 193.84 303.882 189.28 299.882C183.695 295.142 180.201 288.548 179.467 281.42L179.379 280.596C179.292 279.772 179.204 278.948 179.117 278.124L165.421 278.411Z" fill="#A855F7" fillOpacity="0.2"/>
        <path d="M293 361.5C303 361.5 329.5 363.5 330 358C330.5 352.5 301.167 347.833 293 347C284.833 346.167 251 349.5 251.5 354.5C252 359.5 283 361.5 293 361.5Z" fill="#64748b"/>
        <path d="M261 247H323V358H261V247Z" fill="#F97316"/>
        <rect x="261" y="247" width="62" height="111" fill="#FDBA74"/>
        <path d="M291 199C291 185.745 301.745 175 315 175H317C330.255 175 341 185.745 341 199V247H291V199Z" fill="#0f172a"/>
        <ellipse cx="316" cy="199.5" rx="25" ry="24.5" fill="#F97316"/>
        <path d="M304.5 210C300.667 210.167 298.5 212.1 298.5 214C298.5 215.9 303.1 217.5 308 217C312.9 216.5 317.5 213.9 317.5 212C317.5 210.1 313.333 208.833 310.5 209C307.667 209.167 308.333 209.833 304.5 210Z" fill="white"/>
        <path d="M414 361.5C404 361.5 377.5 363.5 377 358C376.5 352.5 405.833 347.833 414 347C422.167 346.167 456 349.5 455.5 354.5C455 359.5 424 361.5 414 361.5Z" fill="#64748b"/>
        <path d="M386 270H442V358H386V270Z" fill="#00B8D9"/>
        <rect x="386" y="270" width="56" height="88" fill="#5EEAD4"/>
        <path d="M414 199C414 185.745 403.255 175 390 175H388C374.745 175 364 185.745 364 199V270H414V199Z" fill="#0f172a"/>
        <ellipse cx="389" cy="199.5" rx="25" ry="24.5" fill="#00B8D9"/>
        <path d="M400.5 210C404.333 210.167 406.5 212.1 406.5 214C406.5 215.9 401.9 217.5 397 217C392.1 216.5 387.5 213.9 387.5 212C387.5 210.1 391.667 208.833 394.5 209C397.333 209.167 396.667 209.833 400.5 210Z" fill="white"/>
        <rect x="156" y="318" width="105" height="42" rx="21" fill="#FFFFFF"/>
        <path d="M211.75 330.5L215.25 334L211.75 337.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="175" y="331" width="30" height="6" rx="3" fill="#e2e8f0"/>
        <rect x="339" y="221" width="105" height="42" rx="21" fill="#FFFFFF"/>
        <path d="M387.75 233.5L391.25 237L387.75 240.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="358" y="234" width="23" height="6" rx="3" fill="#e2e8f0"/>
    </svg>
);

const LandingHeader: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => (
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
          <button onClick={() => onNavigate('Đăng nhập')} className="text-sm font-bold text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">Đăng nhập</button>
          <button onClick={() => onNavigate('Bắt đầu học')} className="text-sm font-bold text-white bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">Bắt đầu học</button>
        </div>
      </div>
    </div>
  </header>
);

const LandingPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
    useScrollAnimation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
    const [showTag, setShowTag] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShowTag(true), 850);
        return () => clearTimeout(t);
    }, []);
    
    return (
    <div className="bg-slate-50 font-sans">
        <LandingHeader onNavigate={onNavigate}/>
        <main>
            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <div className="text-center lg:text-left">
                        <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 font-semibold px-3.5 py-1.5 rounded-full text-sm mb-6 ring-1 ring-cyan-200 shadow-md shadow-cyan-500/20 transition-opacity duration-500 ${showTag ? 'opacity-100' : 'opacity-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', willChange: 'opacity' }}>
                            {LANDING_ICONS.star}
                            <span>Giáo dục an toàn, khoa học & thân thiện</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight scroll-animate transition-all duration-700" style={{ transitionDelay: '0ms' }}>
                            Hiểu về <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-accent-purple filter drop-shadow-sm transition-transform duration-300 hover:brightness-110 hover:scale-[1.02]">cơ thể</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-orange filter drop-shadow-sm transition-transform duration-300 hover:brightness-110 hover:scale-[1.02]">tâm lý</span> và giới tính
                        </h1>
                        <p className="mt-6 text-lg text-slate-500 scroll-animate transition-all duration-700" style={{ transitionDelay: '120ms' }}>
                            Nền tảng giáo dục giới tính và sinh sản toàn diện cho học sinh THCS, THPT và phụ huynh. Kiến thức khoa học, môi trường an toàn, không phán xét.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <div className={`flex items-center space-x-2 text-slate-500 transition-opacity duration-500 ${showTag ? 'opacity-100' : 'opacity-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', willChange: 'opacity' }}>
                                <span className="text-cyan-500">{LANDING_ICONS.shield}</span>
                                <span>100% Ẩn danh</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-slate-500 transition-opacity duration-500 ${showTag ? 'opacity-100' : 'opacity-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', willChange: 'opacity' }}>
                                <span className="text-accent-orange">{LANDING_ICONS.expert}</span>
                                <span>Chuyên gia hỗ trợ</span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                             <button onClick={() => onNavigate('Bắt đầu học')} className="flex items-center justify-center text-base font-bold text-white bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30">
                                Bắt đầu học ngay {LANDING_ICONS.arrow}
                            </button>
                             <button onClick={() => onNavigate('Dành cho phụ huynh')} className="text-base font-bold text-slate-900 bg-white px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors border-2 border-slate-200">
                                Dành cho phụ huynh
                            </button>
                        </div>
                        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-3xl font-bold text-cyan-500"><CountUp end={10000} duration={1.4} suffix="+" /></p>
                                <p className="text-sm text-slate-500">Học sinh tin tưởng</p>
                            </div>
                             <div>
                                <p className="text-3xl font-bold text-accent-orange"><CountUp end={50} duration={1.2} suffix="+" /></p>
                                <p className="text-sm text-slate-500">Bài học tương tác</p>
                            </div>
                             <div>
                                <p className="text-3xl font-bold text-accent-purple"><CountUp end={24} duration={1.2} suffix="/7" /></p>
                                <p className="text-sm text-slate-500">Hỗ trợ ẩn danh</p>
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="relative">
                        <LandingIllustration />
                        <div className={`group absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 w-64 border border-slate-200 transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 animate-floating transition-opacity duration-500 ${showTag ? 'opacity-100' : 'opacity-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', willChange: 'opacity' }}>
                             <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-500 transition-transform duration-300 group-hover:scale-110">
                                {LANDING_ICONS.shield}
                             </div>
                             <div>
                                 <p className="font-bold text-slate-900">An toàn 100%</p>
                                 <p className="text-sm text-slate-500">Bảo mật tuyệt đối</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto scroll-animate">
                        <h2 className="text-3xl font-bold text-slate-900">Tại sao chọn SafeLearn?</h2>
                        <p className="mt-4 text-lg text-slate-500">Chúng tôi mang đến một môi trường học tập hiện đại, an toàn và hiệu quả, giúp bạn tự tin làm chủ kiến thức.</p>
                    </div>
                    <div className="mt-12 grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mx-auto mb-4">{LANDING_ICONS.privacy}</div>
                            <h3 className="text-xl font-bold text-slate-900">An toàn & Riêng tư</h3>
                            <p className="mt-2 text-slate-500">Mọi thông tin và câu hỏi đều được bảo mật tuyệt đối. Học tập trong không gian ẩn danh, không phán xét.</p>
                        </div>
                        <div className="text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1" style={{transitionDelay: '150ms'}}>
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mx-auto mb-4">{LANDING_ICONS.science}</div>
                            <h3 className="text-xl font-bold text-slate-900">Khoa học & Tin cậy</h3>
                            <p className="mt-2 text-slate-500">Nội dung được biên soạn và kiểm duyệt bởi các chuyên gia y tế và giáo dục hàng đầu.</p>
                        </div>
                        <div className="text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1" style={{transitionDelay: '300ms'}}>
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mx-auto mb-4">{LANDING_ICONS.interactive}</div>
                            <h3 className="text-xl font-bold text-slate-900">Tương tác & Dễ hiểu</h3>
                            <p className="mt-2 text-slate-500">Học qua video, trò chơi, tình huống mô phỏng giúp kiến thức không còn khô khan.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto scroll-animate">
                        <h2 className="text-3xl font-bold text-slate-900">Tính năng nổi bật</h2>
                        <p className="mt-4 text-lg text-slate-500">Khám phá các công cụ được thiết kế để hỗ trợ tối đa cho hành trình học tập của bạn.</p>
                    </div>
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: LANDING_ICONS.path, title: "Lộ trình học cá nhân", desc: "Các bài học được thiết kế phù hợp với độ tuổi và nhu cầu riêng của bạn." },
                            { icon: LANDING_ICONS.anonymousQA, title: "Hỏi đáp ẩn danh", desc: "Đặt bất kỳ câu hỏi nào và nhận câu trả lời từ chuyên gia mà không sợ bị phán xét." },
                            { icon: LANDING_ICONS.scenarios, title: "Tình huống tương tác", desc: "Thực hành các kỹ năng ứng xử qua các tình huống mô phỏng thực tế." },
                            { icon: LANDING_ICONS.mapSupport, title: "Bản đồ hỗ trợ", desc: "Dễ dàng tìm kiếm các địa chỉ tư vấn và hỗ trợ sức khỏe sinh sản tin cậy." }
                        ].map((feature, index) => (
                            <div key={feature.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-200" style={{ transitionDelay: `${index * 150}ms`}}>
                                {feature.icon}
                                <h3 className="font-bold text-slate-900 mt-4">{feature.title}</h3>
                                <p className="text-slate-500 text-sm mt-2">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto scroll-animate">
                        <h2 className="text-3xl font-bold text-slate-900">Bắt đầu thật đơn giản</h2>
                        <p className="mt-4 text-lg text-slate-500">Chỉ với 3 bước, bạn đã sẵn sàng cho hành trình khám phá kiến thức.</p>
                    </div>
                    <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
                        <div className="absolute top-8 left-0 w-full h-px bg-slate-200 hidden md:block"></div>
                        <div className="absolute top-8 left-0 w-full flex justify-around hidden md:flex">
                            <div className="w-1/3 border-t-2 border-dashed border-cyan-300"></div>
                            <div className="w-1/3 border-t-2 border-dashed border-cyan-300"></div>
                        </div>
                        {[
                             { number: 1, title: "Chọn vai trò", desc: "Bạn là học sinh hay phụ huynh? Chọn vai trò để có nội dung phù hợp nhất." },
                             { number: 2, title: "Khám phá nội dung", desc: "Bắt đầu các khóa học, tham gia thảo luận và chơi các mini-game tương tác." },
                             { number: 3, title: "Kết nối & Hỗ trợ", desc: "Đặt câu hỏi ẩn danh và sử dụng bản đồ để tìm kiếm sự giúp đỡ khi cần thiết." }
                        ].map((step, index) => (
                             <div key={step.number} className="relative text-center scroll-animate" style={{ transitionDelay: `${index * 150}ms`}}>
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-cyan-100 text-cyan-600 font-bold text-2xl rounded-full border-4 border-white shadow-md relative z-10">{step.number}</div>
                                <h3 className="font-bold text-slate-900 text-xl mt-6">{step.title}</h3>
                                <p className="text-slate-500 mt-2">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center max-w-3xl mx-auto scroll-animate">
                        <h2 className="text-3xl font-bold text-slate-900">Học viên nói gì về chúng tôi</h2>
                     </div>
                     <div className="mt-12 grid lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-200">
                            <div className="flex items-start">
                                {LANDING_ICONS.quotes}
                                <p className="ml-4 text-slate-500 italic">"Nhờ SafeLearn, em không còn ngại ngùng khi nói về những thay đổi của cơ thể mình. Các bài học rất dễ hiểu và không hề khô khan như em nghĩ."</p>
                            </div>
                            <p className="text-right mt-4 font-bold text-slate-900">- An Nhiên, Học sinh lớp 8</p>
                        </div>
                         <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-200" style={{transitionDelay: '150ms'}}>
                            <div className="flex items-start">
                                {LANDING_ICONS.quotes}
                                <p className="ml-4 text-slate-500 italic">"Ứng dụng này là một công cụ tuyệt vời. Tôi đã biết cách trò chuyện với con trai về các vấn đề nhạy cảm một cách cởi mở và khoa học hơn."</p>
                            </div>
                            <p className="text-right mt-4 font-bold text-slate-900">- Anh Minh, Phụ huynh</p>
                        </div>
                     </div>
                </div>
            </section>
            
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-cyan-600 text-white p-12 rounded-2xl text-center relative overflow-hidden scroll-animate">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
                        <h2 className="text-4xl font-extrabold relative">Sẵn sàng bắt đầu hành trình của bạn?</h2>
                        <p className="mt-4 max-w-2xl mx-auto opacity-80 relative">Trang bị kiến thức, xây dựng sự tự tin và vững bước vào tương lai cùng SafeLearn.</p>
                        <button onClick={() => onNavigate('Bắt đầu học')} className="mt-8 flex items-center justify-center mx-auto text-base font-bold text-cyan-600 bg-white px-8 py-4 rounded-lg hover:bg-slate-200 transition-colors shadow-2xl">
                            Bắt đầu học ngay {LANDING_ICONS.arrow}
                        </button>
                    </div>
                </div>
            </section>
            <section id="contact" className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Liên hệ</h2>
                            <ContactForm />
                        </div>
                        <div className="scroll-animate bg-slate-50 p-6 rounded-2xl border border-slate-200 transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-cyan-100 animate-glowing"></div>
                            <h3 className="text-xl font-bold text-slate-900">Thông tin</h3>
                                <p className="mt-2 text-slate-600">Chúng tôi sẵn sàng hỗ trợ và lắng nghe bạn.</p>
                            <div className="mt-4 space-y-3 text-slate-700">
                                <p><span className="font-semibold">Email:</span> support@safelearn.vn</p>
                                <p><span className="font-semibold">Hotline:</span> 024-1234-5678</p>
                                <p><span className="font-semibold">Thời gian:</span> 08:00–17:30 (T2–T6)</p>
                                <p><span className="font-semibold">Địa chỉ:</span> Km 2, Quốc lộ 2B, xã Định Trung, thành phố Vĩnh Yên, tỉnh Vĩnh Phúc</p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <a href="tel:02412345678" className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600">Gọi Hotline</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <footer className="border-t border-slate-200 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} SafeLearn. Mọi quyền được bảo lưu.</p>
                <p className="mt-2">Một sản phẩm vì cộng đồng, giúp thế hệ trẻ Việt Nam tự tin và an toàn hơn.</p>
            </div>
        </footer>
    </div>
);
};

// --- AUTH PAGE (LOGIN / REGISTER, REDESIGNED) ---
const AuthPage: React.FC<{
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


// --- MAIN APP (POST-LOGIN DASHBOARD) COMPONENTS ---
const DashboardHeader: React.FC<{
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
      const x = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;
      setIndicator({ x, width });
    };
    update();
    const onResize = () => requestAnimationFrame(update);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentView]);
  
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
            {isAdmin ? (
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
            {currentView !== View.PARENT_DASHBOARD && (
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center">
                {(() => {
                  const base = currentView === View.STUDENT_DASHBOARD
                    ? [UserRole.STUDENT_MS, UserRole.STUDENT_HS]
                    : [UserRole.STUDENT_MS, UserRole.STUDENT_HS, UserRole.PARENT];
                  const roles = userRole === UserRole.ADMIN ? [...base, UserRole.ADMIN] : base;
                  return roles;
                })().map(role => (
                  <button key={role}
                      onClick={() => setUserRole(role)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-300 ${userRole === role ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-300'}`}
                  >
                     {role === UserRole.STUDENT_MS ? "THCS" : role === UserRole.STUDENT_HS ? "THPT" : role === UserRole.PARENT ? "Phụ Huynh" : "Admin"}
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

const ParentResourceItem: React.FC<{ resource: any }> = ({ resource }) => (
     <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent-orange text-white shadow-lg shadow-accent-orange/30">
            {resource.icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-slate-900 dark:text-white">{resource.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">{resource.description}</p>
            <button className="mt-2 text-sm text-cyan-600 dark:text-cyan-300 font-semibold hover:underline">Tìm hiểu thêm →</button>
        </div>
    </div>
);
const QAPage: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setIsSubmitting(true);
        setMessage(null);
        const result = await moderateQuestion(question);
        if (result.isAppropriate) {
            setMessage({ text: result.reason, type: 'success' });
            setQuestion('');
        } else {
            setMessage({ text: result.reason, type: 'error' });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Hỏi Đáp Ẩn Danh</h2>
                <p className="text-lg text-slate-500 dark:text-slate-300">Không gian an toàn để bạn hỏi bất cứ điều gì.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700 mb-12">
                <form onSubmit={handleSubmit}>
                    <textarea
                        id="qa-box"
                        rows={4}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="Ví dụ: Làm sao để từ chối khi bạn bè rủ xem phim người lớn?"
                    ></textarea>
                    {message && (
                        <p className={`mt-3 text-sm font-medium ${message.type === 'success' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
                            {message.text}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-400 disabled:dark:bg-slate-700"
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
                    </button>
                </form>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">Câu hỏi phổ biến</h3>
                <div className="space-y-4">
                    {QA_DATA.filter(q => q.isPopular).map(q => (
                        <div key={q.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-cyan-600 dark:text-cyan-300 mb-1">{q.question}</p>
                            <p className="text-slate-500 dark:text-slate-300 leading-relaxed">{q.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
const MapPage: React.FC = () => {
    const [filters, setFilters] = useState<MapServiceType[]>(Object.values(MapServiceType));
    const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(MAP_SERVICES[0]);
    const toggleFilter = (filter: MapServiceType) => { setFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]); };
    const serviceColors: Record<MapServiceType, string> = {
        [MapServiceType.GYNECOLOGY]: 'bg-accent-purple', [MapServiceType.ANDROLOGY]: 'bg-cyan-500', [MapServiceType.COUNSELING]: 'bg-accent-orange', [MapServiceType.HOTLINE]: 'bg-red-500',
    };
    return (
        <div className="space-y-4">
             <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Bản Đồ Dịch Vụ</h2>
                <p className="text-lg text-slate-500 dark:text-slate-300">Tìm kiếm các địa điểm hỗ trợ sức khỏe thân thiện và tin cậy.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-250px)]">
                    <div className="w-full lg:w-2/3 xl:w-3/4 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden">
                        <img src="https://i.imgur.com/Tf2v2bM.png" alt="Map background" className="absolute inset-0 w-full h-full object-cover"/>
                        {MAP_SERVICES.filter(p => filters.includes(p.type)).map(point => (
                            <button key={point.id} onClick={() => setSelectedPoint(point)} className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={{ top: point.position.top, left: point.position.left }} aria-label={point.name}>
                                <div className={`w-5 h-5 rounded-full ${serviceColors[point.type]} ring-4 ring-white/50 dark:ring-white/20 group-hover:scale-125 transition-transform duration-300`}></div>
                                <div className={`absolute inset-0 rounded-full ${serviceColors[point.type]} opacity-50 animate-pulse`}></div>
                            </button>
                        ))}
                    </div>
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col space-y-4">
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                            {Object.values(MapServiceType).map(type => (
                                <button key={type} onClick={() => toggleFilter(type)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex-grow ${filters.includes(type) ? `${serviceColors[type]} text-white shadow-md` : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{type}</button>
                            ))}
                        </div>
                        <div className="flex-grow p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        {selectedPoint ? (
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{selectedPoint.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedPoint.address}</p>
                                {selectedPoint.friendly === 'teen' && <span className="text-xs font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-full mt-3 inline-block">Thân thiện vị thành niên</span>}
                            </div>
                        ) : (
                           <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">Chọn một điểm trên bản đồ để xem chi tiết.</p>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const ScenarioPage: React.FC = () => {
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleGenerateScenario = async () => {
        setLoading(true);
        setError(null);
        setScenario(null);
        setSelectedOption(null);
        const result = await generateScenario();
        if (result) {
            setScenario(result);
        } else {
            setError("Không thể tạo tình huống. Vui lòng thử lại sau.");
        }
        setLoading(false);
    };

    useEffect(() => {
        handleGenerateScenario();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Tình Huống Tương Tác</h2>
                <p className="text-lg text-slate-500 dark:text-slate-300">Thực hành kỹ năng qua các tình huống thực tế do AI tạo ra.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col justify-center items-center">
                {loading && <div className="text-center text-slate-500 dark:text-slate-400">Đang tạo tình huống mới...</div>}
                {error && <p className="text-red-500">{error}</p>}
                {scenario && !loading && (
                    <div className="w-full">
                        <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-300 text-center">{scenario.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 my-6 text-center leading-relaxed">{scenario.situation}</p>
                        <div className="space-y-4">
                            {scenario.options.map((option, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setSelectedOption(index)}
                                        disabled={selectedOption !== null}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${selectedOption === index ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800'} disabled:cursor-not-allowed`}
                                    >
                                        {option.text}
                                    </button>
                                    {selectedOption === index && (
                                        <div className="p-4 mt-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 border-l-4 border-cyan-500 dark:border-cyan-700">
                                            <p className="font-semibold mb-1">Phản hồi:</p>
                                            <p>{option.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    onClick={handleGenerateScenario}
                    disabled={loading}
                    className="mt-8 bg-cyan-500 hover:bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-slate-400 disabled:dark:bg-slate-700 flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                    <span>{selectedOption !== null ? 'Tạo tình huống khác' : 'Tạo tình huống mới'}</span>
                </button>
            </div>
        </div>
    );
};
const RoadmapPath = () => (
    <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
        <svg width="400" height="800" viewBox="0 0 400 800" className="w-full h-full">
            <defs>
                <linearGradient id="pathGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#bae6fd"/>
                    <stop offset="100%" stopColor="#e2e8f0"/>
                </linearGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path d="M 200 40 L 200 760" stroke="url(#pathGrad)" fill="none" strokeWidth="12" strokeLinecap="round" strokeDasharray="28 18" filter="url(#softGlow)"/>
            <g transform="translate(65, 640)">
                <circle cx="36" cy="36" r="36" fill="#94a3b8" opacity="0.15"/>
                <g transform="translate(0, -10) scale(0.8)">
                    <rect x="10" y="52" rx="8" ry="8" width="52" height="12" fill="#0ea5e9" opacity="0.9"/>
                    <circle cx="36" cy="36" r="28" fill="#38bdf8"/>
                    <rect x="28" y="22" width="16" height="20" rx="4" fill="white"/>
                </g>
            </g>
        </svg>
    </div>
);
const StudentDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const courses = userRole === UserRole.STUDENT_HS ? STUDENT_HS_COURSES : STUDENT_MS_COURSES;
    const roadmap = userRole === UserRole.STUDENT_HS ? ROADMAP_HS_DATA : ROADMAP_MS_DATA;
    const [selectedLesson, setSelectedLesson] = useState<RoadmapItem | null>(null);
    const [showCollection, setShowCollection] = useState(false);
    const overall = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);
    const yGap = 120;
    const lanes = [0, 100, 0, 100];
    const MEDAL_ICONS = ['🏅','🎖️','⭐','🎯','🏆','🥇','🥈','🥉'];
    const MedalIcon: React.FC<{ glyph: 'dna'|'hormone'|'brain'|'gender'|'contraception'|'virus'|'spermEgg'|'shield'|'cell'|'star'; tone: 'cyan'|'emerald'|'slate'; uid: string | number }>
    = ({ glyph, tone, uid }) => {
        const gid = `g-${glyph}-${tone}-${uid}`;
        const rid = `r-${glyph}-${tone}-${uid}`;
        const palettes: Record<string, string[]> = {
            dna: ['#22d3ee','#6366f1','#a855f7'],
            hormone: ['#f97316','#fb7185','#f43f5e'],
            brain: ['#f472b6','#a78bfa','#60a5fa'],
            gender: ['#f59e0b','#10b981','#3b82f6'],
            contraception: ['#34d399','#22d3ee','#93c5fd'],
            virus: ['#ef4444','#f59e0b','#f97316'],
            spermEgg: ['#06b6d4','#3b82f6','#8b5cf6'],
            shield: ['#10b981','#22d3ee','#06b6d4'],
            cell: ['#60a5fa','#22d3ee','#a7f3d0']
        };
        const [c1,c2,c3] = palettes[glyph] || palettes.cell;
        const strokeTone = tone === 'emerald' ? '#064e3b' : tone === 'cyan' ? '#0e7490' : '#334155';
        const shape = () => {
            if (glyph === 'dna') return (<g stroke={strokeTone} strokeWidth={2} strokeLinecap="round" fill="none"><path d="M18 10c6 4 6 12 0 16"/><path d="M30 10c-6 4-6 12 0 16"/><path d="M18.5 13h11M18.5 23h11"/></g>);
            if (glyph === 'hormone') return (<g stroke={strokeTone} strokeWidth={2} fill="none"><polygon points="24,12 30,15.5 30,22.5 24,26 18,22.5 18,15.5"/><path d="M30 18h4m-4 0l3 3" strokeLinecap="round"/></g>);
            if (glyph === 'brain') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><path d="M20 15a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4"/><path d="M20 15a4 4 0 0 1 4-3 4 4 0 0 1 4 3"/><path d="M28 15a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4"/></g>);
            if (glyph === 'gender') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><circle cx="21" cy="19" r="3"/><path d="M21 22v4M19 24h4"/><circle cx="29" cy="16" r="3"/><path d="M29 13v-2m0 0h2m-2 0 3 3"/></g>);
            if (glyph === 'contraception') return (<g fill={strokeTone}><circle cx="21" cy="18" r="1.6"/><circle cx="24" cy="18" r="1.6"/><circle cx="27" cy="18" r="1.6"/><circle cx="21" cy="22" r="1.6"/><circle cx="24" cy="22" r="1.6"/><circle cx="27" cy="22" r="1.6"/></g>);
            if (glyph === 'virus') return (<g stroke={strokeTone} strokeWidth={2} strokeLinecap="round"><circle cx="24" cy="20" r="5" fill="none"/><path d="M24 10v4M24 26v4M14 20h4M30 20h4M16 14l3 3M32 26l-3-3M32 14l-3 3M16 26l3-3"/></g>);
            if (glyph === 'spermEgg') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><circle cx="30" cy="16" r="3.5"/><path d="M16 25c2-2 4-1 5 0 1 .8 2 1 3 .5"/><path d="M16 25c-.2-1 .3-1.8 1-2.4"/></g>);
            if (glyph === 'shield') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><path d="M24 12l8 3v5c0 5-4 7-8 8-4-1-8-3-8-8v-5z"/><path d="M20 20l2 2 4-4"/></g>);
            if (glyph === 'star') return (<g fill={strokeTone} strokeLinejoin="round"><path d="M24 13l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L24 27.9l-5.6 2.9 1.1-6.1-4.5-4.4 6.2-.9z"/></g>);
            return (<g stroke={strokeTone} strokeWidth={2} fill="none"><circle cx="24" cy="20" r="6"/><circle cx="24" cy="20" r="2.2" fill={strokeTone}/><circle cx="28" cy="17" r="1.2" fill={strokeTone}/><circle cx="20" cy="23" r="1.2" fill={strokeTone}/></g>);
        };
        return (
            <svg viewBox="0 0 48 48" className="w-6 h-6">
                <defs>
                    <radialGradient id={gid} cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor={c1}/>
                        <stop offset="60%" stopColor={c2}/>
                        <stop offset="100%" stopColor={c3}/>
                    </radialGradient>
                    <linearGradient id={rid} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={c2}/>
                        <stop offset="100%" stopColor={c3}/>
                    </linearGradient>
                </defs>
                <circle cx="24" cy="20" r="12" fill={`url(#${gid})`} stroke={`url(#${rid})`} strokeWidth="2"/>
                <ellipse cx="19" cy="15" rx="6" ry="3" fill="#ffffff" opacity=".22"/>
                <g opacity=".25">
                    <circle cx="33" cy="27" r="1.2" fill={c1}/>
                    <circle cx="16" cy="28" r="0.9" fill={c3}/>
                </g>
                {shape()}
            </svg>
        );
    };
    const toneForModule = (p: number): 'cyan'|'emerald'|'slate' => p>=100?'emerald':p>0?'cyan':'slate';
    const moduleIconFromTitle = (title: string, progress: number, uid: string|number) => {
        const t = title.toLowerCase();
        const tone = toneForModule(progress);
        if (t.includes('giới tính') || t.includes('cơ thể') || t.includes('sinh học')) return <MedalIcon glyph="dna" tone={tone} uid={uid}/>;
        if (t.includes('dậy thì') || t.includes('thay đổi')) return <MedalIcon glyph="hormone" tone={tone} uid={uid}/>;
        if (t.includes('tôn trọng') || t.includes('quan hệ') || t.includes('tình bạn')) return <MedalIcon glyph="gender" tone={tone} uid={uid}/>;
        if (t.includes('tránh thai') || t.includes('tình dục')) return <MedalIcon glyph="contraception" tone={tone} uid={uid}/>;
        if (t.includes('xâm hại') || t.includes('an toàn')) return <MedalIcon glyph="shield" tone={tone} uid={uid}/>;
        return <MedalIcon glyph="cell" tone={tone} uid={uid}/>;
    };
    const layout = roadmap.map((it, idx) => ({
        item: it,
        y: 140 + idx * yGap,
        offset: lanes[idx % lanes.length],
    }));
    const containerHeight = 220 + (roadmap.length - 1) * yGap;
    const RoadmapNode: React.FC<{ item: RoadmapItem; y: number; offset: number }> = ({ item, y, offset }) => {
        const isBadge = item.type === 'badge';
        const isCurrent = item.status === 'current';

        const statusStyles = {
            completed: {
                base: 'from-green-400 to-green-600',
                ring: 'ring-green-300',
                shadow: 'shadow-green-600/40',
                iconColor: 'text-white',
                icon: ICONS.check
            },
            current: {
                base: 'from-cyan-400 to-cyan-600',
                ring: 'ring-cyan-300',
                shadow: 'shadow-cyan-600/40',
                iconColor: 'text-white',
                icon: ICONS.play
            },
            locked: {
                base: 'from-slate-200 to-slate-300',
                ring: 'ring-slate-200',
                shadow: 'shadow-slate-400/30',
                iconColor: 'text-slate-500',
                icon: ICONS.lock
            },
        };
        
        const badgeStatusStyles = {
            completed: {
                base: 'from-yellow-300 to-yellow-500',
                ring: 'ring-yellow-300',
                shadow: 'shadow-yellow-600/40',
                iconColor: 'text-yellow-900',
                icon: ''
            },
            locked: {
                base: 'from-slate-200 to-slate-300',
                ring: 'ring-slate-200',
                shadow: 'shadow-slate-400/30',
                iconColor: 'text-slate-500',
                icon: ICONS.lock
            },
        };

        const style = isBadge ? badgeStatusStyles[item.status === 'current' ? 'completed' : item.status] : statusStyles[item.status];
        const size = isBadge ? 'w-24 h-24' : 'w-20 h-20';
        const bubbleOffset = isBadge ? 'bottom-[5.5rem]' : 'bottom-[4.75rem]';
        const buttonClasses = `relative rounded-full cursor-pointer transition-transform duration-200 ease-out drop-shadow-xl group-hover:-translate-y-1 active:translate-y-0.5`;
        const iconFor = () => {
            if (isBadge) return item.status === 'locked' ? ICONS.lock : MEDAL_ICONS[(item.id - 1) % MEDAL_ICONS.length];
            if (isCurrent) return '📘';
            const icons = ['⭐', '🏋️', '⭐'];
            return icons[(item.id - 1) % icons.length];
        };
        
        return (
            <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isCurrent ? 'z-10' : ''}`} style={{ top: y, left: '50%', marginLeft: offset }}>
                <div className={`absolute ${bubbleOffset} left-1/2 -translate-x-1/2 rounded-xl bg-white text-cyan-600 font-bold text-xs shadow-md ring-1 ring-slate-200 px-3 py-1 flex items-center gap-1 ${isCurrent ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                    BẮT ĐẦU
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></span>
                </div>
                {isCurrent && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cyan-200 ring-2 ring-white shadow-md flex items-center justify-center">
                        <span className="text-cyan-700">✓</span>
                    </div>
                )}
                <button className={`${buttonClasses} ${size}`} onClick={() => setSelectedLesson(item)}>
                    <span className={`absolute inset-0 rounded-full translate-y-2 bg-black/10 blur-[2px] opacity-40`}></span>
                    <span className={`absolute inset-0 rounded-full ring-4 ${style.ring} bg-gradient-to-br ${style.base} flex items-center justify-center shadow-2xl ${isCurrent ? 'animate-glowing' : ''}`}>
                        <span className={`text-3xl ${style.iconColor}`}>{iconFor()}</span>
                    </span>
                </button>
                <p className={`mt-3 w-40 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity`}>{item.title}</p>
            </div>
        );
    };

    const CourseHero: React.FC = () => (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-accent-purple p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
                <div>
                    <p className="text-white/80 text-xs uppercase tracking-wider">Hành trình học tập</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Xin chào! Tiếp tục chinh phục kiến thức nhé</h2>
                    <div className="mt-4">
                        <div className="h-3 w-64 bg-white/20 rounded-full">
                            <div className="h-3 bg-white rounded-full shadow-md" style={{ width: `${overall}%` }}></div>
                        </div>
                        <p className="mt-1 text-sm font-semibold">Tiến độ tổng thể: {overall}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white text-cyan-600 font-bold rounded-lg shadow hover:bg-slate-100">Tiếp tục học</button>
                    <button onClick={()=>setShowCollection(true)} className="px-4 py-2 bg-white/20 font-bold rounded-lg ring-1 ring-white/30 hover:bg-white/30">Bộ sưu tập</button>
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -left-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
        </div>
    );

    const ModuleTile: React.FC<{ module: CourseModule; idx: number }> = ({ module, idx }) => {
        const progress = module.progress || 0;
        const isOwned = progress > 0;
        const medal = isOwned ? MEDAL_ICONS[idx % MEDAL_ICONS.length] : '🔒';
        return (
            <div className={`relative rounded-2xl p-4 transition-all duration-300 ${isOwned ? 'bg-gradient-to-br from-cyan-500/8 to-accent-purple/8 border border-cyan-200 dark:border-cyan-700 shadow-xl hover:shadow-2xl shadow-cyan-500/25 dark:shadow-[0_0_18px_rgba(6,182,212,0.35)] hover:scale-[1.01]' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl'}`}> 
                {isOwned && (<div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-cyan-400/25 blur-xl"></div>)}
                {isOwned && (<div className="absolute -bottom-4 -left-2 w-16 h-16 rounded-full bg-accent-purple/20 blur-xl"></div>)}
                {isOwned && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    <div className="absolute top-3 right-7 w-2 h-2 bg-white/80 rounded-full animate-sparkle"></div>
                    <div className="absolute bottom-4 left-10 w-1.5 h-1.5 bg-white/70 rounded-full animate-sparkle" style={{animationDelay:'300ms'}}></div>
                    <div className="absolute top-6 left-6 w-2 h-2 bg-accent-orange/80 rounded-full animate-sparkle" style={{animationDelay:'600ms'}}></div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className={`absolute inset-0 rounded-full ${isOwned ? 'animate-glowing' : ''}`} style={{ background: `conic-gradient(#06b6d4 ${progress * 3.6}deg, #e2e8f0 0deg)` }}></div>
                        <div className={`absolute inset-1 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center ring-2 ring-white/60 ${isOwned ? 'animate-ringPulse' : ''}`} title={isOwned ? 'Tiến trình' : 'Chưa bắt đầu'}>
                            <span className={`text-2xl ${isOwned ? 'animate-medalPulse' : ''}`}>{medal}</span>
                        </div>
                        {isOwned && (<span className="absolute -inset-0.5 rounded-full bg-cyan-300/20 blur-md"></span>)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{module.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-300 truncate">{module.description}</p>
                    </div>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">{progress}%</span>
                </div>
            </div>
        );
    };

    const CollectionSummary: React.FC<{ roadmap: RoadmapItem[]; courses: CourseModule[] }> = ({ roadmap, courses }) => {
        const xpFor = (it: RoadmapItem) => (it.type === 'badge' ? 150 : 50);
        const totalXp = roadmap.filter(r => r.status === 'completed').reduce((sum, r) => sum + xpFor(r), 0);
        const badges = roadmap.filter(r => r.type === 'badge');
        const owned = badges.filter(b => b.status === 'completed');
        const badgeIcon = (owned: boolean, idx: number) => owned ? ['🥇','🥈','🥉','🏅','🎖️'][idx % 5] : '🔒';
        return (
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Tổng kinh nghiệm</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalXp} XP</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Huy hiệu đang sở hữu</p>
                        <p className="text-xl font-bold text-cyan-600 dark:text-cyan-300">{owned.length} / {badges.length}</p>
                    </div>
                </div>
                <h4 className="mt-6 mb-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Huy hiệu khóa học</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                    {courses.map((c, idx) => {
                        const progress = c.progress || 0;
                        const isOwned = progress > 0;
                        const medal = MEDAL_ICONS[idx % MEDAL_ICONS.length];
                        const xp = isOwned ? 100 : 0;
                        return (
                            <div key={c.id} className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all ${isOwned ? 'border-cyan-200 bg-cyan-50 dark:border-cyan-700/60 dark:bg-cyan-500/10 shadow-lg hover:shadow-2xl shadow-cyan-500/25 hover:scale-[1.01]' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
                                {isOwned && (<div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-cyan-300/25 blur-xl"></div>)}
                                {isOwned && (<div className="absolute -bottom-2 -right-3 w-16 h-16 rounded-full bg-accent-purple/20 blur-xl"></div>)}
                                {isOwned && (
                                  <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                                    <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                  </div>
                                )}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isOwned ? 'bg-gradient-to-br from-cyan-200 to-cyan-300 text-cyan-800 ring-2 ring-cyan-400' : 'bg-slate-200 text-slate-500 ring-2 ring-slate-300'}`}>{isOwned ? medal : '🔒'}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white truncate">{c.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{isOwned ? `+${xp} XP` : 'Chưa sở hữu'}</p>
                                </div>
                                {isOwned && <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">+{xp}</span>}
                            </div>
                        );
                    })}
                </div>
                <h4 className="mt-8 mb-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Huy hiệu lộ trình</h4>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {badges.map((b, idx) => {
                        const isOwned = b.status === 'completed';
                        const xp = 150;
                        return (
                            <div key={b.id} className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all ${isOwned ? 'border-cyan-200 bg-cyan-50 dark:border-cyan-700/60 dark:bg-cyan-500/10 shadow-lg hover:shadow-2xl shadow-cyan-500/25 hover:scale-[1.01]' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
                                {isOwned && (<div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-cyan-300/25 blur-xl"></div>)}
                                {isOwned && (<div className="absolute -bottom-2 -right-3 w-16 h-16 rounded-full bg-accent-purple/20 blur-xl"></div>)}
                                {isOwned && (
                                  <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                                    <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                  </div>
                                )}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isOwned ? 'bg-gradient-to-br from-cyan-200 to-cyan-300 text-cyan-800 ring-2 ring-cyan-400' : 'bg-slate-200 text-slate-500 ring-2 ring-slate-300'}`}>{isOwned ? MEDAL_ICONS[idx % MEDAL_ICONS.length] : '🔒'}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white truncate">{b.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{isOwned ? `+${xp} XP` : 'Chưa sở hữu'}</p>
                                </div>
                                {isOwned && <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">+{xp}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const JourneyTimeline: React.FC = () => {
        const items = roadmap.map((r, i) => ({ ...r, side: i % 2 === 0 ? 'left' as const : 'right' as const }));
        const colorFor = (status: RoadmapItem['status']) => {
            if (status === 'completed') return { bg: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-300', dot: 'bg-emerald-500' };
            if (status === 'current') return { bg: 'from-cyan-400 to-cyan-600', ring: 'ring-cyan-300', dot: 'bg-cyan-500 animate-pulse' };
            return { bg: 'from-slate-200 to-slate-300', ring: 'ring-slate-200', dot: 'bg-slate-400' };
        };
        return (
            <div className="relative py-10">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-200 via-slate-200 to-slate-300"></div>
                <div className="space-y-14">
                    {items.map((it, idx) => {
                        const c = colorFor(it.status);
                        const isLeft = it.side === 'left';
                        return (
                            <div key={it.id} className="relative">
                                <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-md" style={{ backgroundColor: 'transparent' }}>
                                    <div className={`w-full h-full rounded-full ${c.dot}`}></div>
                                </div>
                                <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`w-full sm:w-[460px] max-w-[95%] ${isLeft ? 'sm:mr-[56px]' : 'sm:ml-[56px]'}`}>
                                        <button onClick={() => setSelectedLesson(it)} className={`block text-left rounded-2xl p-5 bg-gradient-to-br ${c.bg} text-white shadow-xl hover:shadow-2xl transition-all ring-1 ${c.ring}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-2xl">{it.type === 'badge' ? (it.status === 'locked' ? '🔒' : MEDAL_ICONS[(it.id - 1) % MEDAL_ICONS.length]) : it.status === 'current' ? '📘' : '⭐'}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs uppercase opacity-90">{it.status === 'locked' ? 'Chưa mở' : it.status === 'completed' ? 'Đã hoàn thành' : 'Đang học'}</p>
                                                    <h4 className="font-extrabold text-lg truncate">{it.title}</h4>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <span className="px-3 py-1 rounded-lg bg-white/20 font-bold text-sm">{it.type === 'badge' ? 'Huy hiệu' : 'Bài học'}</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const JourneyRibbon: React.FC = () => {
        const svgW = 600;
        const svgH = Math.max(900, 240 + roadmap.length * 150);
        const pathRef = useRef<SVGPathElement | null>(null);
        const [pts, setPts] = useState<{ x: number; y: number }[]>([]);

        useEffect(() => {
            const p = pathRef.current;
            if (!p) return;
            const len = p.getTotalLength();
            const n = roadmap.length;
            const gap = len / (n + 1);
            const next: { x: number; y: number }[] = [];
            for (let i = 1; i <= n; i++) {
                const pt = p.getPointAtLength(i * gap);
                next.push({ x: pt.x, y: pt.y });
            }
            setPts(next);
        }, [roadmap.length]);

        const colorFor = (status: RoadmapItem['status']) => {
            if (status === 'completed') return { base: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-300', text: 'text-white' };
            if (status === 'current') return { base: 'from-cyan-400 to-cyan-600', ring: 'ring-cyan-300', text: 'text-white' };
            return { base: 'from-slate-200 to-slate-300', ring: 'ring-slate-200', text: 'text-slate-600' };
        };

        return (
            <div className="relative w-full" style={{ height: `${svgH}px` }}>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="absolute inset-0 w-full h-full">
                    <defs>
                        <linearGradient id="rbGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#bae6fd"/>
                            <stop offset="100%" stopColor="#e2e8f0"/>
                        </linearGradient>
                        <filter id="rbGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="b"/>
                            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>
                    <path ref={pathRef} d={`M ${svgW/2} 60 C ${svgW*0.15} ${svgH*0.18}, ${svgW*0.85} ${svgH*0.30}, ${svgW/2} ${svgH*0.42} S ${svgW*0.15} ${svgH*0.66}, ${svgW/2} ${svgH*0.78} S ${svgW*0.85} ${svgH*0.92}, ${svgW/2} ${svgH-60}`} stroke="url(#rbGrad)" strokeWidth="14" strokeLinecap="round" strokeDasharray="30 20" fill="none" filter="url(#rbGlow)"/>
                    <g opacity="0.15">
                        <circle cx="80" cy="120" r="18" fill="#06b6d4"/>
                        <circle cx="520" cy="220" r="10" fill="#a855f7"/>
                        <circle cx="120" cy="480" r="14" fill="#06b6d4"/>
                    </g>
                </svg>
                {pts.map((pt, idx) => {
                    const it = roadmap[idx];
                    const c = colorFor(it.status);
                    const left = `${(pt.x / svgW) * 100}%`;
                    const top = `${(pt.y / svgH) * 100}%`;
                    const isBadge = it.type === 'badge';
                    const size = isBadge ? 'w-24 h-24' : 'w-20 h-20';
                    const icon = it.type === 'badge' ? (it.status === 'locked' ? '🔒' : MEDAL_ICONS[(it.id - 1) % MEDAL_ICONS.length]) : it.status === 'current' ? '📘' : '⭐';
                    return (
                        <div key={it.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
                            {it.status === 'current' && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-white text-cyan-600 font-bold text-xs shadow ring-1 ring-slate-200">BẮT ĐẦU</div>
                            )}
                            <button onClick={() => setSelectedLesson(it)} className={`relative ${size} rounded-full group transition-transform hover:-translate-y-1 active:translate-y-0.5`}>
                                <span className="absolute inset-0 rounded-full translate-y-2 bg-black/10 blur-[2px] opacity-35"></span>
                                <span className={`absolute inset-0 rounded-full ring-4 ${c.ring} bg-gradient-to-br ${c.base} flex items-center justify-center shadow-2xl`}>
                                    <span className={`text-3xl ${c.text}`}>{icon}</span>
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const CurriculumOutline: React.FC = () => {
        const [q, setQ] = useState('');
        const [tab, setTab] = useState<'all' | 'current' | 'completed' | 'locked'>('all');
        const [open, setOpen] = useState<number[]>([]);
        const toggle = (id: number) => setOpen(o => o.includes(id) ? o.filter(i => i !== id) : [...o, id]);
        const filtered = roadmap.filter(r => {
            if (tab !== 'all' && r.status !== tab) return false as any;
            if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
            return true;
        });
        const label = (s: RoadmapItem['status']) => s === 'current' ? 'Đang học' : s === 'completed' ? 'Đã hoàn thành' : 'Chưa mở';
        const lessonEmoji = (title: string) => {
            const t = title.toLowerCase();
            if ((t.includes('nói') && t.includes('không')) || t.includes('từ chối') || t.includes('say no') || t.includes('no')) return '🚫';
            if (t.includes('cơ thể') || t.includes('giới tính') || t.includes('sinh học')) return '🧬';
            if (t.includes('dậy thì') || t.includes('thay đổi')) return '🧪';
            if (t.includes('cảm xúc')) return '🧠';
            if (t.includes('đồng thuận') || t.includes('tình bạn') || t.includes('tôn trọng')) return '🤝';
            if (t.includes('an toàn') || t.includes('môi trường số')) return '🛡️';
            if (t.includes('tránh thai')) return '💊';
            if (t.includes('stis') || t.includes('bệnh')) return '🦠';
            if (t.includes('bản dạng') || t.includes('xu hướng') || t.includes('giới')) return '⚧️';
            if (t.includes('pháp lý') || t.includes('trách nhiệm') || t.includes('luật')) return '⚖️';
            if (t.includes('sinh sản')) return '🍼';
            return '📘';
        };
        const BioIcons = {
            dna: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M7 3c6 4 6 14 0 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M17 3c-6 4-6 14 0 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M7.5 6.5h9M7.8 9.8h8.4M7.8 14.2h8.4M7.5 17.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            ),
            chromosome: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M7 4c2 2 4 4 5 5s3 3 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M17 4c-2 2-4 4-5 5s-3 3-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            ),
            cell: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <circle cx="16" cy="9" r="1" fill="currentColor"/>
                    <circle cx="8" cy="15" r="1" fill="currentColor"/>
                </svg>
            ),
            hormone: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <polygon points="12,5 16,7.5 16,12.5 12,15 8,12.5 8,7.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M16 10h3m-3 0l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            ),
            gender: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M9 12v5M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="16" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M16 5V3m0 0h2m-2 0 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            ),
            contraception: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <rect x="5" y="6.5" width="14" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="9" cy="10" r="1" fill="currentColor"/>
                    <circle cx="12" cy="10" r="1" fill="currentColor"/>
                    <circle cx="15" cy="10" r="1" fill="currentColor"/>
                    <circle cx="9" cy="14" r="1" fill="currentColor"/>
                    <circle cx="12" cy="14" r="1" fill="currentColor"/>
                    <circle cx="15" cy="14" r="1" fill="currentColor"/>
                </svg>
            ),
            virus: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M4.5 19.5l2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            ),
            brain: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M9 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3M9 6a3 3 0 0 1 3-2 3 3 0 0 1 3 2M15 6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            ),
            shield: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M9 11l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            ),
            spermEgg: (
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle cx="16" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M6 16c2-2 4-1 5 0 1 .8 2 1 3 .5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M6 16c-.2-1 .3-1.8 1-2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            ),
        } as const;

        const MedalIcon: React.FC<{ glyph: 'dna'|'hormone'|'brain'|'gender'|'contraception'|'virus'|'spermEgg'|'shield'|'cell'|'star'; tone: 'cyan'|'emerald'|'slate'; uid: string | number }>
        = ({ glyph, tone, uid }) => {
            const gid = `g-${glyph}-${tone}-${uid}`;
            const rid = `r-${glyph}-${tone}-${uid}`;
            const palettes: Record<string, string[]> = {
                dna: ['#22d3ee','#6366f1','#a855f7'],
                hormone: ['#f97316','#fb7185','#f43f5e'],
                brain: ['#f472b6','#a78bfa','#60a5fa'],
                gender: ['#f59e0b','#10b981','#3b82f6'],
                contraception: ['#34d399','#22d3ee','#93c5fd'],
                virus: ['#ef4444','#f59e0b','#f97316'],
                spermEgg: ['#06b6d4','#3b82f6','#8b5cf6'],
                shield: ['#10b981','#22d3ee','#06b6d4'],
                cell: ['#60a5fa','#22d3ee','#a7f3d0']
            };
            const [c1,c2,c3] = palettes[glyph] || palettes.cell;
            const strokeTone = tone === 'emerald' ? '#064e3b' : tone === 'cyan' ? '#0e7490' : '#334155';
            const shape = () => {
                if (glyph === 'dna') return (<g stroke={strokeTone} strokeWidth={2} strokeLinecap="round" fill="none"><path d="M18 10c6 4 6 12 0 16"/><path d="M30 10c-6 4-6 12 0 16"/><path d="M18.5 13h11M18.5 23h11"/></g>);
                if (glyph === 'hormone') return (<g stroke={strokeTone} strokeWidth={2} fill="none"><polygon points="24,12 30,15.5 30,22.5 24,26 18,22.5 18,15.5"/><path d="M30 18h4m-4 0l3 3" strokeLinecap="round"/></g>);
                if (glyph === 'brain') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><path d="M20 15a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4"/><path d="M20 15a4 4 0 0 1 4-3 4 4 0 0 1 4 3"/><path d="M28 15a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4"/></g>);
                if (glyph === 'gender') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><circle cx="21" cy="19" r="3"/><path d="M21 22v4M19 24h4"/><circle cx="29" cy="16" r="3"/><path d="M29 13v-2m0 0h2m-2 0 3 3"/></g>);
                if (glyph === 'contraception') return (<g fill={strokeTone}><circle cx="21" cy="18" r="1.6"/><circle cx="24" cy="18" r="1.6"/><circle cx="27" cy="18" r="1.6"/><circle cx="21" cy="22" r="1.6"/><circle cx="24" cy="22" r="1.6"/><circle cx="27" cy="22" r="1.6"/></g>);
                if (glyph === 'virus') return (<g stroke={strokeTone} strokeWidth={2} strokeLinecap="round"><circle cx="24" cy="20" r="5" fill="none"/><path d="M24 10v4M24 26v4M14 20h4M30 20h4M16 14l3 3M32 26l-3-3M32 14l-3 3M16 26l3-3"/></g>);
                if (glyph === 'spermEgg') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><circle cx="30" cy="16" r="3.5"/><path d="M16 25c2-2 4-1 5 0 1 .8 2 1 3 .5"/><path d="M16 25c-.2-1 .3-1.8 1-2.4"/></g>);
                if (glyph === 'shield') return (<g stroke={strokeTone} strokeWidth={2} fill="none" strokeLinecap="round"><path d="M24 12l8 3v5c0 5-4 7-8 8-4-1-8-3-8-8v-5z"/><path d="M20 20l2 2 4-4"/></g>);
                if (glyph === 'star') return (<g fill={strokeTone} strokeLinejoin="round"><path d="M24 13l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L24 27.9l-5.6 2.9 1.1-6.1-4.5-4.4 6.2-.9z"/></g>);
                return (<g stroke={strokeTone} strokeWidth={2} fill="none"><circle cx="24" cy="20" r="6"/><circle cx="24" cy="20" r="2.2" fill={strokeTone}/><circle cx="28" cy="17" r="1.2" fill={strokeTone}/><circle cx="20" cy="23" r="1.2" fill={strokeTone}/></g>);
            };
            return (
                <svg viewBox="0 0 48 48" className="w-6 h-6">
                    <defs>
                        <radialGradient id={gid} cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor={c1}/>
                            <stop offset="60%" stopColor={c2}/>
                            <stop offset="100%" stopColor={c3}/>
                        </radialGradient>
                        <linearGradient id={rid} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={c2}/>
                            <stop offset="100%" stopColor={c3}/>
                        </linearGradient>
                    </defs>
                    <circle cx="24" cy="20" r="12" fill={`url(#${gid})`} stroke={`url(#${rid})`} strokeWidth="2"/>
                    <ellipse cx="19" cy="15" rx="6" ry="3" fill="#ffffff" opacity=".22"/>
                    <g opacity=".25">
                        <circle cx="33" cy="27" r="1.2" fill={c1}/>
                        <circle cx="16" cy="28" r="0.9" fill={c3}/>
                    </g>
                    {shape()}
                </svg>
            );
        };

        const toneFor = (s: RoadmapItem['status']): 'cyan'|'emerald'|'slate' => s==='completed'?'emerald':s==='current'?'cyan':'slate';

        const iconFromTitle = (title: string, status: RoadmapItem['status']|undefined, uid: number) => {
            const t = title.toLowerCase();
            const tone = toneFor(status || 'current');
            if (t.includes('cơ thể') || t.includes('giới tính') || t.includes('sinh học')) return <MedalIcon glyph="dna" tone={tone} uid={uid}/>;
            if (t.includes('dậy thì') || t.includes('thay đổi')) return <MedalIcon glyph="hormone" tone={tone} uid={uid}/>;
            if (t.includes('cảm xúc')) return <MedalIcon glyph="brain" tone={tone} uid={uid}/>;
            if (t.includes('đồng thuận') || t.includes('tình bạn') || t.includes('tôn trọng')) return <MedalIcon glyph="gender" tone={tone} uid={uid}/>;
            if (t.includes('an toàn') || t.includes('môi trường số')) return <MedalIcon glyph="shield" tone={tone} uid={uid}/>;
            if (t.includes('tránh thai')) return <MedalIcon glyph="contraception" tone={tone} uid={uid}/>;
            if (t.includes('stis') || t.includes('bệnh')) return <MedalIcon glyph="virus" tone={tone} uid={uid}/>;
            if (t.includes('bản dạng') || t.includes('xu hướng') || t.includes('giới')) return <MedalIcon glyph="gender" tone={tone} uid={uid}/>;
            if (t.includes('pháp lý') || t.includes('trách nhiệm') || t.includes('luật')) return <MedalIcon glyph="shield" tone={tone} uid={uid}/>;
            if (t.includes('sinh sản')) return <MedalIcon glyph="spermEgg" tone={tone} uid={uid}/>;
            return <MedalIcon glyph="cell" tone={tone} uid={uid}/>;
        };
        const chipFor = (status: RoadmapItem['status']) => {
            const base = 'w-11 h-11 flex items-center justify-center rounded-full shadow-md ring-1';
            if (status === 'completed') return `${base} bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 ring-emerald-300 dark:from-emerald-500/20 dark:to-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-700`;
            if (status === 'current') return `${base} bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700 ring-cyan-300 dark:from-cyan-500/20 dark:to-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-700`;
            return `${base} bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 ring-slate-300 dark:from-slate-700/40 dark:to-slate-800/40 dark:text-slate-300 dark:ring-slate-700`;
        };
        return (
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        {[{k:'all',t:'Tất cả'},{k:'current',t:'Đang học'},{k:'completed',t:'Hoàn thành'},{k:'locked',t:'Chưa mở'}].map((t:any)=> (
                            <button key={t.k} onClick={()=>setTab(t.k)} className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${tab===t.k ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>{t.t}</button>
                        ))}
                    </div>
                    <div className="relative">
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm bài học..." className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"/>
                    </div>
                </div>
                <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    {filtered.map((it, idx) => {
                        const isOpen = open.includes(it.id);
                        const primaryLabel = it.status === 'completed' ? 'Ôn lại' : 'Bắt đầu';
                        const btnBase = 'inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm';
                        const btnOutline = `${btnBase} font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:dark:bg-slate-700`;
                        const btnPrimaryEnabled = `${btnBase} font-bold min-w-[96px] bg-cyan-600 hover:bg-cyan-700 text-white`;
                        const btnPrimaryDisabled = `${btnBase} font-bold min-w-[96px] bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-white`;
                        return (
                            <div key={it.id} className="p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <div className={chipFor(it.status)}>
                                        {it.type === 'badge' ? (it.status === 'locked' ? '🔒' : MEDAL_ICONS[(it.id - 1) % MEDAL_ICONS.length]) : lessonEmoji(it.title)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{it.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{label(it.status)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={()=>toggle(it.id)} className={btnOutline}>{isOpen?'Thu gọn':'Chi tiết'}</button>
                                        <button onClick={()=>setSelectedLesson(it)} className={it.status==='locked'?btnPrimaryDisabled:btnPrimaryEnabled}>{primaryLabel}</button>
                                    </div>
                                </div>
                                {isOpen && (
                                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                        {[1,2,3].map(n => (
                                            <div key={n} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-cyan-600">{n}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Nội dung {n}: {it.title.replace('Bài','Phần')}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">3–6 phút • Câu hỏi tương tác</p>
                                                </div>
                                                <button className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Xem</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    {filtered.length===0 && (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">Không tìm thấy bài học phù hợp</div>
                    )}
                </div>
            </div>
        );
    };

    const CourseModuleCard: React.FC<{ module: CourseModule }> = ({ module }) => (
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl flex items-center space-x-4 border border-slate-200/50 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/10">{moduleIconFromTitle(module.title, module.progress || 0, module.id)}</div>
            <div className="flex-grow">
                <h4 className="font-bold text-slate-800 dark:text-white">{module.title}</h4>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-cyan-500 h-2 rounded-full dark:shadow-[0_0_12px_rgba(6,182,212,0.45)]" style={{ width: `${module.progress}%` }}></div>
                </div>
            </div>
            <span className="font-bold text-cyan-500 dark:text-cyan-300 text-sm">{module.progress}%</span>
        </div>
    );
    
    return (
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
                <CourseHero />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map((course, idx) => <ModuleTile key={course.id} module={course} idx={idx} />)}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Chương trình học</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>setShowCollection(true)} className="px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:dark:bg-slate-700">Bộ sưu tập</button>
                            <button className="px-3 py-2 bg-cyan-600 text-white rounded-lg font-bold text-sm hover:bg-cyan-700">Tiếp tục học</button>
                        </div>
                    </div>
                    <CurriculumOutline />
                </div>
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4">Bảng xếp hạng</h3>
                    <div className="space-y-3">
                        {LEADERBOARD_DATA.map((user, index) => {
                            const rankStyles: { [key: number]: string } = {
                                0: 'border-yellow-400',
                                1: 'border-slate-300',
                                2: 'border-yellow-600/70',
                            };
                            return (
                                <div key={user.id} className={`flex items-center p-3 rounded-lg ${user.isCurrentUser ? 'bg-cyan-100 dark:bg-cyan-500/10 border-2 border-cyan-500 dark:border-cyan-700' : 'bg-slate-50 dark:bg-slate-900'}`}>
                                    <span className="font-bold text-slate-400 dark:text-slate-500 text-sm w-6 text-center">{index + 1}</span>
                                    <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full mx-3 border-2 ${rankStyles[index] || 'border-transparent'}`} />
                                    <p className={`flex-grow font-semibold ${user.isCurrentUser ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-300'}`}>{user.name}</p>
                                    <p className="font-bold text-sm text-slate-500 dark:text-slate-400">{user.xp} XP</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {selectedLesson && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLesson(null)}></div>
                    <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto">
                        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-300" onClick={() => setSelectedLesson(null)}>Đóng</button>
                        <h3 className="text-2xl font-extrabold mt-2 text-slate-900 dark:text-white">{selectedLesson.title}</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">Bài học gồm kiến thức nền tảng, tình huống mô phỏng, câu hỏi tương tác và kiểm tra nhanh. Sẵn sàng chưa?</p>
                        <button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl">{selectedLesson.status === 'completed' ? 'Ôn lại' : 'Bắt đầu'}</button>
                    </div>
                </div>
            )}

            {showCollection && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={()=>setShowCollection(false)}></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Bộ sưu tập</h3>
                            <button onClick={()=>setShowCollection(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-300">Đóng</button>
                        </div>
                        <div className="p-6">
                            <CollectionSummary roadmap={roadmap} courses={courses} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ParentDashboard: React.FC<{setView: (view: View) => void;}> = ({setView}) => (
     <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Công cụ cho Phụ huynh</h2>
            <p className="text-slate-500 dark:text-slate-300 mb-4">Đồng hành và trò chuyện cởi mở cùng con.</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700 -mx-4 sm:-mx-6">
                {PARENT_RESOURCES.map(res => <ParentResourceItem key={res.id} resource={res} />)}
            </div>
        </div>
        <div className="lg:col-span-2">
           <div onClick={() => setView(View.QA)} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:dark:border-cyan-400 transition-colors duration-300 cursor-pointer text-center">
                <div className="text-cyan-500 text-4xl mb-3 flex justify-center">{ICONS.question}</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Những điều con băn khoăn</h3>
                <p className="text-slate-500 dark:text-slate-300 mt-1 text-sm">Đọc các câu hỏi phổ biến (ẩn danh) để hiểu hơn về suy nghĩ của con trẻ.</p>
            </div>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const StatCard: React.FC<{ title: string; value: string; change: number; icon: React.ReactNode; color: string; }> = ({ title, value, change, icon, color }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{title}</p>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${color}/20 text-${color} ring-1 ring-slate-200 dark:ring-white/10 dark:bg-white/10`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            <div className={`flex items-center mt-1 text-sm font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% so với tháng trước
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Bảng điều khiển Admin</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* FIX: Replaced non-existent ICONS.users with ICONS.body */}
                <StatCard title="Tổng số học sinh" value={ADMIN_STATS_DATA.totalStudents.value.toLocaleString('vi-VN')} change={ADMIN_STATS_DATA.totalStudents.change} icon={ICONS.users} color="cyan-500" />
                {/* FIX: Replaced non-existent ICONS.users with ICONS.body */}
                <StatCard title="Tổng số phụ huynh" value={ADMIN_STATS_DATA.totalParents.value.toLocaleString('vi-VN')} change={ADMIN_STATS_DATA.totalParents.change} icon={ICONS.users} color="accent-purple" />
                <StatCard title="Tỷ lệ hoàn thành" value={`${ADMIN_STATS_DATA.completionRate.value}%`} change={ADMIN_STATS_DATA.completionRate.change} icon={ICONS.check} color="accent-orange" />
                <StatCard title="Mức độ tương tác" value={`${ADMIN_STATS_DATA.engagementRate.value}%`} change={ADMIN_STATS_DATA.engagementRate.change} icon={ICONS.heart} color="red-500" />
            </div>
            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tiến độ hoàn thành Module</h3>
                    <div className="space-y-4">
                        {MODULE_COMPLETION_DATA.map(module => (
                            <div key={module.id}>
                                <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                    <span>{module.title}</span>
                                    <span>{module.completion}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${module.completion}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Phân bổ người dùng</h3>
                    <div className="space-y-3">
                         {USER_DISTRIBUTION_DATA.map((item, index) => {
                             const colors = ['bg-cyan-500', 'bg-accent-purple', 'bg-accent-orange'];
                             const total = USER_DISTRIBUTION_DATA.reduce((sum, i) => sum + i.count, 0);
                             const percentage = ((item.count / total) * 100).toFixed(1);
                             return (
                                 <div key={item.role}>
                                    <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-300">
                                        <span>{item.role}</span>
                                        <span>{item.count.toLocaleString('vi-VN')}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                                         <div className={`${colors[index % colors.length]} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            )
                         })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MainApp: React.FC<{
  userRole: UserRole;
  currentView: View;
  setUserRole: (role: UserRole) => void;
  setView: (view: View) => void;
  onLogoClick: () => void;
}> = ({ userRole, currentView, setUserRole, setView, onLogoClick }) => {
    
  const handleSetUserRole = (role: UserRole) => {
      setUserRole(role);
  };
  
  const renderView = () => {
    const isStudent = userRole === UserRole.STUDENT_MS || userRole === UserRole.STUDENT_HS;
    switch(currentView) {
      case View.STUDENT_DASHBOARD:
        return <StudentDashboard userRole={userRole} />;
      case View.PARENT_DASHBOARD:
        return <ParentDashboard setView={setView} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      case View.SCENARIOS:
        return isStudent ? <ScenarioPage /> : <StudentDashboard userRole={userRole} />; // Fallback for safety
      case View.MAP:
        return <MapPage />;
      case View.QA:
        return <QAPage />;
      default:
        return userRole === UserRole.ADMIN ? <AdminDashboard /> : isStudent ? <StudentDashboard userRole={userRole} /> : <ParentDashboard setView={setView} />;
    }
  }

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <DashboardHeader 
        currentView={currentView}
        userRole={userRole} 
        setUserRole={handleSetUserRole} 
        setView={setView}
        onLogoClick={onLogoClick}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
}


// --- ROOT APP COMPONENT ---

export default function App() {
  const AUTH_DISABLED = (import.meta.env.VITE_DISABLE_AUTH === 'true') || (import.meta.env.VITE_DISABLE_AUTH === '1');
  const [isLoggedIn, setIsLoggedIn] = useState(AUTH_DISABLED);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT_MS);
  const [currentView, setCurrentView] = useState<View>(View.STUDENT_DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);
  const [username, setUsername] = useState<string>('');

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
        setIsLoggedIn(false);
        setUserRole(UserRole.STUDENT_MS);
        setCurrentView(View.STUDENT_DASHBOARD);
      }
    };
    window.addEventListener('popstate', onPop);
    window.history.replaceState({ login: AUTH_DISABLED, role: UserRole.STUDENT_MS, view: View.STUDENT_DASHBOARD }, '');
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
      if (userRole === UserRole.PARENT) {
        pushAppState(true, userRole, View.PARENT_DASHBOARD);
      } else {
        pushAppState(true, userRole, View.STUDENT_DASHBOARD);
      }
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
    return <LandingPageExternal onNavigate={handleNavigate} isLoggedIn={true} userName={username} />;
  }

  return <MainApp 
    userRole={userRole} 
    currentView={currentView}
    setUserRole={handleSetUserRoleAndSwitchView}
    setView={(view) => pushAppState(true, userRole, view)}
    onLogoClick={() => pushAppState(false, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD)}
  />;
}
