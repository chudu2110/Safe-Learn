import React, { useState, useEffect } from 'react';
import { LandingPage as LandingPageExternal } from './pages/LandingPage';
import { UserRole, View, CourseModule, QASubmission, ServicePoint, MapServiceType, RoadmapItem, LeaderboardUser, Scenario, AdminStats, ModuleCompletion, UserDistribution } from './types';
import { PARENT_RESOURCES, QA_DATA, MAP_SERVICES, ICONS, LANDING_ICONS, ROADMAP_DATA, LEADERBOARD_DATA, STUDENT_MS_COURSES, STUDENT_HS_COURSES, ADMIN_STATS_DATA, MODULE_COMPLETION_DATA, USER_DISTRIBUTION_DATA } from './constants';
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-accent-purple/10 relative overflow-hidden">
    <div className="absolute top-12 left-10 w-6 h-6 rounded-full bg-cyan-100 animate-floating"></div>
    <div className="absolute bottom-14 right-16 w-8 h-8 rounded-full bg-rose-100 animate-floating"></div>
    <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-accent-orange/30 animate-floating"></div>
    <div className="text-center">
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-b-accent-purple border-l-transparent border-r-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-cyan-200 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-xl">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white">{LANDING_ICONS.logo}</div>
        </div>
      </div>
      <p className="mt-6 text-2xl font-extrabold text-slate-900">SafeLearn</p>
      <p className="mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-accent-purple">Giáo dục an toàn, khoa học & thân thiện</p>
      <div className="mt-6 w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-cyan-500 to-accent-purple rounded-full" style={{ animation: 'loadingSlide 1.4s ease-in-out infinite' }}></div>
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
          <button className="text-sm font-bold text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">Đăng nhập</button>
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
                                <p><span className="font-semibold">Địa chỉ:</span> Quận 1, TP.HCM</p>
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

  const NavButton: React.FC<{ view: View; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setView(view)} 
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-white text-cyan-600 shadow-md' : 'text-slate-500 hover:bg-cyan-500/10'}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };
  
  return (
    <header className="sticky top-0 z-40 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-lg shadow-slate-900/5 border border-slate-200">
          <button onClick={onLogoClick} aria-label="Về Trang chủ" className="flex items-center space-x-2 rounded-full">
            {LANDING_ICONS.logo}
            <span className="text-xl font-bold text-slate-900">SafeLearn</span>
          </button>
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-full">
            {isAdmin ? (
                 <NavButton view={View.ADMIN_DASHBOARD} icon={ICONS.admin} label="Thống kê" />
            ) : (
                <>
                    <NavButton view={homeView} icon={ICONS.dashboard} label="Tổng quan" />
                    {isStudent && <NavButton view={View.SCENARIOS} icon={ICONS.scenarios} label="Tình huống" />}
                    <NavButton view={View.QA} icon={ICONS.qa} label="Hỏi Đáp" />
                    <NavButton view={View.MAP} icon={ICONS.map} label="Bản Đồ" />
                </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-full flex items-center">
              {[UserRole.STUDENT_MS, UserRole.STUDENT_HS, UserRole.PARENT, UserRole.ADMIN].map(role => (
                  <button key={role}
                      onClick={() => setUserRole(role)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-300 ${userRole === role ? 'bg-white text-cyan-600 shadow-md' : 'text-slate-500'}`}
                  >
                     {role === UserRole.STUDENT_MS ? "THCS" : role === UserRole.STUDENT_HS ? "THPT" : role === UserRole.PARENT ? "Phụ Huynh" : "Admin"}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ParentResourceItem: React.FC<{ resource: any }> = ({ resource }) => (
     <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent-orange text-white shadow-lg shadow-accent-orange/30">
            {resource.icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-slate-900">{resource.title}</h3>
            <p className="text-sm text-slate-500">{resource.description}</p>
            <button className="mt-2 text-sm text-cyan-600 font-semibold hover:underline">Tìm hiểu thêm →</button>
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
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Hỏi Đáp Ẩn Danh</h2>
                <p className="text-lg text-slate-500">Không gian an toàn để bạn hỏi bất cứ điều gì.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 mb-12">
                <form onSubmit={handleSubmit}>
                    <textarea
                        id="qa-box"
                        rows={4}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-4 bg-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-900 placeholder-slate-400"
                        placeholder="Ví dụ: Làm sao để từ chối khi bạn bè rủ xem phim người lớn?"
                    ></textarea>
                    {message && (
                        <p className={`mt-3 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-400"
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
                    </button>
                </form>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Câu hỏi phổ biến</h3>
                <div className="space-y-4">
                    {QA_DATA.filter(q => q.isPopular).map(q => (
                        <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200">
                            <p className="font-semibold text-cyan-600 mb-1">{q.question}</p>
                            <p className="text-slate-500 leading-relaxed">{q.answer}</p>
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
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Bản Đồ Dịch Vụ</h2>
                <p className="text-lg text-slate-500">Tìm kiếm các địa điểm hỗ trợ sức khỏe thân thiện và tin cậy.</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200">
                <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-250px)]">
                    <div className="w-full lg:w-2/3 xl:w-3/4 bg-slate-100 rounded-xl relative overflow-hidden">
                        <img src="https://i.imgur.com/Tf2v2bM.png" alt="Map background" className="absolute inset-0 w-full h-full object-cover"/>
                        {MAP_SERVICES.filter(p => filters.includes(p.type)).map(point => (
                            <button key={point.id} onClick={() => setSelectedPoint(point)} className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={{ top: point.position.top, left: point.position.left }} aria-label={point.name}>
                                <div className={`w-5 h-5 rounded-full ${serviceColors[point.type]} ring-4 ring-white/50 group-hover:scale-125 transition-transform duration-300`}></div>
                                <div className={`absolute inset-0 rounded-full ${serviceColors[point.type]} opacity-50 animate-pulse`}></div>
                            </button>
                        ))}
                    </div>
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col space-y-4">
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-lg">
                            {Object.values(MapServiceType).map(type => (
                                <button key={type} onClick={() => toggleFilter(type)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex-grow ${filters.includes(type) ? `${serviceColors[type]} text-white shadow-md` : 'bg-white text-slate-500 hover:bg-slate-200'}`}>{type}</button>
                            ))}
                        </div>
                        <div className="flex-grow p-4 bg-slate-100 rounded-lg">
                        {selectedPoint ? (
                            <div>
                                <h4 className="font-bold text-slate-900">{selectedPoint.name}</h4>
                                <p className="text-sm text-slate-500 mt-1">{selectedPoint.address}</p>
                                {selectedPoint.friendly === 'teen' && <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full mt-3 inline-block">Thân thiện vị thành niên</span>}
                            </div>
                        ) : (
                           <p className="text-sm text-slate-500 text-center mt-8">Chọn một điểm trên bản đồ để xem chi tiết.</p>
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
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Tình Huống Tương Tác</h2>
                <p className="text-lg text-slate-500">Thực hành kỹ năng qua các tình huống thực tế do AI tạo ra.</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 min-h-[400px] flex flex-col justify-center items-center">
                {loading && <div className="text-center text-slate-500">Đang tạo tình huống mới...</div>}
                {error && <p className="text-red-500">{error}</p>}
                {scenario && !loading && (
                    <div className="w-full">
                        <h3 className="text-2xl font-bold text-cyan-600 text-center">{scenario.title}</h3>
                        <p className="text-slate-600 my-6 text-center leading-relaxed">{scenario.situation}</p>
                        <div className="space-y-4">
                            {scenario.options.map((option, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setSelectedOption(index)}
                                        disabled={selectedOption !== null}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${selectedOption === index ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50'} disabled:cursor-not-allowed`}
                                    >
                                        {option.text}
                                    </button>
                                    {selectedOption === index && (
                                        <div className="p-4 mt-2 bg-slate-100 rounded-lg text-slate-700 border-l-4 border-cyan-500">
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
                    className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-slate-400 flex items-center space-x-2"
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
            <path d="M 240 40 C 240 100, 150 100, 150 160 S 260 220, 260 280 S 150 340, 150 400 S 250 460, 250 520 S 160 580, 160 640 S 230 700, 230 760" stroke="#E2E8F0" fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray="20 15" />
            <g transform="translate(180, 250) scale(0.5)">
                <path d="M84.1,64.3C83.2,61.5,82.2,58.7,81.1,56c-2-5.1-4.8-9.8-8.2-13.8c-2.2-2.6-4.6-5-7.3-7c-5-3.6-11-5.7-17.5-5.7c-6.2,0-12,1.9-16.9,5.4c-4.9,3.5-8.2,8.4-9.6,14.1c-1.2,4.6-1.5,9.4-1,14.1c0.5,5.1,1.8,10.1,3.8,14.7c1.7,3.9,3.8,7.6,6.3,10.9c2.5,3.3,5.4,6.2,8.6,8.6c3.2,2.4,6.8,4.2,10.5,5.3" fill="none" stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" strokeMiterlimit="10"/>
            </g>
             <g transform="translate(250, 550) scale(0.4) rotate(180)">
                <path d="M84.1,64.3C83.2,61.5,82.2,58.7,81.1,56c-2-5.1-4.8-9.8-8.2-13.8c-2.2-2.6-4.6-5-7.3-7c-5-3.6-11-5.7-17.5-5.7c-6.2,0-12,1.9-16.9,5.4c-4.9,3.5-8.2,8.4-9.6,14.1c-1.2,4.6-1.5,9.4-1,14.1c0.5,5.1,1.8,10.1,3.8,14.7c1.7,3.9,3.8,7.6,6.3,10.9c2.5,3.3,5.4,6.2,8.6,8.6c3.2,2.4,6.8,4.2,10.5,5.3" fill="none" stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" strokeMiterlimit="10"/>
            </g>
        </svg>
    </div>
);
const StudentDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const courses = userRole === UserRole.STUDENT_HS ? STUDENT_HS_COURSES : STUDENT_MS_COURSES;
    const RoadmapNode: React.FC<{ item: RoadmapItem }> = ({ item }) => {
        const isBadge = item.type === 'badge';
        const isCurrent = item.status === 'current';

        const statusStyles = {
            completed: {
                base: 'bg-gradient-to-br from-green-400 to-green-600',
                bottom: 'bg-green-800',
                iconColor: 'text-white',
                icon: ICONS.check
            },
            current: {
                base: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
                bottom: 'bg-cyan-800',
                iconColor: 'text-white',
                icon: ICONS.play
            },
            locked: {
                base: 'bg-gradient-to-br from-slate-300 to-slate-400',
                bottom: 'bg-slate-500',
                iconColor: 'text-slate-600',
                icon: ICONS.lock
            },
        };
        
        const badgeStatusStyles = {
            completed: {
                base: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
                bottom: 'bg-yellow-700',
                iconColor: 'text-yellow-900',
                icon: '🏆'
            },
             locked: {
                base: 'bg-gradient-to-br from-slate-300 to-slate-400',
                bottom: 'bg-slate-500',
                iconColor: 'text-slate-600',
                icon: ICONS.lock
            },
        };

        const style = isBadge ? badgeStatusStyles[item.status === 'current' ? 'completed' : item.status] : statusStyles[item.status];
        const buttonClasses = `relative rounded-full cursor-pointer transition-transform duration-200 ease-out drop-shadow-lg group-hover:-translate-y-1 active:translate-y-0.5 active:shadow-none`;
        
        return (
            <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isCurrent ? 'animate-floating z-10' : ''}`} style={{ top: item.position.top, left: item.position.left }}>
                 <p className={`absolute bottom-full mb-4 w-40 text-center text-sm font-semibold text-slate-600 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1`}>{item.title}</p>
                 <button className={`${buttonClasses} ${isBadge ? 'w-20 h-20' : 'w-16 h-16'}`}>
                    <span className={`absolute inset-0 rounded-full ${style.bottom} transform translate-y-1.5`}></span>
                    <span className={`absolute inset-0 rounded-full flex items-center justify-center ${style.base} shadow-inner shadow-white/20 ${isCurrent ? 'animate-glowing' : ''}`}>
                      <span className={`text-2xl ${style.iconColor}`}>
                        {style.icon}
                      </span>
                    </span>
                </button>
            </div>
        );
    };

    const CourseModuleCard: React.FC<{ module: CourseModule }> = ({ module }) => (
        <div className="bg-slate-50 p-4 rounded-xl flex items-center space-x-4 border border-slate-200/50 hover:bg-white hover:shadow-lg hover:border-slate-200 transition-all duration-300">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-500">{module.icon}</div>
            <div className="flex-grow">
                <h4 className="font-bold text-slate-800">{module.title}</h4>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${module.progress}%` }}></div>
                </div>
            </div>
            <span className="font-bold text-cyan-500 text-sm">{module.progress}%</span>
        </div>
    );
    
    return (
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200">
                     <h2 className="text-3xl font-bold text-slate-900 mb-1">Khóa học của bạn</h2>
                     <p className="text-slate-500 mb-6">Hãy cùng khám phá những kiến thức bổ ích nhé!</p>
                     <div className="grid md:grid-cols-2 gap-4">
                        {courses.map(course => <CourseModuleCard key={course.id} module={course} />)}
                     </div>
                </div>
                 <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">Lộ trình Khám phá</h2>
                    <p className="text-slate-500 mb-8">Hoàn thành các bài học để nhận huy hiệu và thăng hạng!</p>
                    <div className="relative w-full h-[800px]">
                        <RoadmapPath />
                        {ROADMAP_DATA.map((item) => (
                            <RoadmapNode key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200">
                    <h3 className="font-bold text-xl text-slate-900 mb-4">Bảng xếp hạng</h3>
                     <div className="space-y-3">
                        {LEADERBOARD_DATA.map((user, index) => {
                             const rankStyles: { [key: number]: string } = {
                                0: 'border-yellow-400',
                                1: 'border-slate-300',
                                2: 'border-yellow-600/70',
                            };
                            return (
                                <div key={user.id} className={`flex items-center p-3 rounded-lg ${user.isCurrentUser ? 'bg-cyan-100 border-2 border-cyan-500' : 'bg-slate-50'}`}>
                                    <span className="font-bold text-slate-400 text-sm w-6 text-center">{index + 1}</span>
                                    <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full mx-3 border-2 ${rankStyles[index] || 'border-transparent'}`} />
                                    <p className={`flex-grow font-semibold ${user.isCurrentUser ? 'text-cyan-600' : 'text-slate-800'}`}>{user.name}</p>
                                    <p className="font-bold text-sm text-slate-500">{user.xp} XP</p>
                                </div>
                            )
                        })}
                     </div>
                </div>
            </div>
        </div>
    );
};

const ParentDashboard: React.FC<{setView: (view: View) => void;}> = ({setView}) => (
     <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Công cụ cho Phụ huynh</h2>
            <p className="text-slate-500 mb-4">Đồng hành và trò chuyện cởi mở cùng con.</p>
            <div className="divide-y divide-slate-200 -mx-4 sm:-mx-6">
                {PARENT_RESOURCES.map(res => <ParentResourceItem key={res.id} resource={res} />)}
            </div>
        </div>
        <div className="lg:col-span-2">
           <div onClick={() => setView(View.QA)} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border-2 border-dashed border-slate-200 hover:border-cyan-500 transition-colors duration-300 cursor-pointer text-center">
                <div className="text-cyan-500 text-4xl mb-3 flex justify-center">{ICONS.question}</div>
                <h3 className="font-bold text-lg text-slate-900">Những điều con băn khoăn</h3>
                <p className="text-slate-500 mt-1 text-sm">Đọc các câu hỏi phổ biến (ẩn danh) để hiểu hơn về suy nghĩ của con trẻ.</p>
            </div>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const StatCard: React.FC<{ title: string; value: string; change: number; icon: React.ReactNode; color: string; }> = ({ title, value, change, icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{title}</p>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${color}/20 text-${color}`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            <div className={`flex items-center mt-1 text-sm font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% so với tháng trước
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">Bảng điều khiển Admin</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* FIX: Replaced non-existent ICONS.users with ICONS.body */}
                <StatCard title="Tổng số học sinh" value={ADMIN_STATS_DATA.totalStudents.value.toLocaleString('vi-VN')} change={ADMIN_STATS_DATA.totalStudents.change} icon={ICONS.users} color="cyan-500" />
                {/* FIX: Replaced non-existent ICONS.users with ICONS.body */}
                <StatCard title="Tổng số phụ huynh" value={ADMIN_STATS_DATA.totalParents.value.toLocaleString('vi-VN')} change={ADMIN_STATS_DATA.totalParents.change} icon={ICONS.users} color="accent-purple" />
                <StatCard title="Tỷ lệ hoàn thành" value={`${ADMIN_STATS_DATA.completionRate.value}%`} change={ADMIN_STATS_DATA.completionRate.change} icon={ICONS.check} color="accent-orange" />
                <StatCard title="Mức độ tương tác" value={`${ADMIN_STATS_DATA.engagementRate.value}%`} change={ADMIN_STATS_DATA.engagementRate.change} icon={ICONS.heart} color="red-500" />
            </div>
            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Tiến độ hoàn thành Module</h3>
                    <div className="space-y-4">
                        {MODULE_COMPLETION_DATA.map(module => (
                            <div key={module.id}>
                                <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                                    <span>{module.title}</span>
                                    <span>{module.completion}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${module.completion}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Phân bổ người dùng</h3>
                    <div className="space-y-3">
                         {USER_DISTRIBUTION_DATA.map((item, index) => {
                             const colors = ['bg-cyan-500', 'bg-accent-purple', 'bg-accent-orange'];
                             const total = USER_DISTRIBUTION_DATA.reduce((sum, i) => sum + i.count, 0);
                             const percentage = ((item.count / total) * 100).toFixed(1);
                             return (
                                 <div key={item.role}>
                                    <div className="flex justify-between font-semibold text-slate-800">
                                        <span>{item.role}</span>
                                        <span>{item.count.toLocaleString('vi-VN')}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
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
      if (role === UserRole.ADMIN) {
        setView(View.ADMIN_DASHBOARD);
      } else {
        const isStudentRole = role === UserRole.STUDENT_MS || role === UserRole.STUDENT_HS;
        setView(isStudentRole ? View.STUDENT_DASHBOARD : View.PARENT_DASHBOARD);
      }
  };
  
  const renderView = () => {
    const isStudent = userRole === UserRole.STUDENT_MS || userRole === UserRole.STUDENT_HS;
    switch(currentView) {
      case View.STUDENT_DASHBOARD:
        return isStudent ? <StudentDashboard userRole={userRole} /> : <ParentDashboard setView={setView} />;
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
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT_MS);
  const [currentView, setCurrentView] = useState<View>(View.STUDENT_DASHBOARD);
  const [showSplash, setShowSplash] = useState(true);

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
    window.history.replaceState({ login: false, role: UserRole.STUDENT_MS, view: View.STUDENT_DASHBOARD }, '');
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
    if (target === 'Phụ huynh' || target === 'Dành cho phụ huynh') {
      pushAppState(true, UserRole.PARENT, View.PARENT_DASHBOARD);
    } else {
      pushAppState(true, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD);
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
    return <LandingPageExternal onNavigate={handleNavigate} />;
  }

  return <MainApp 
    userRole={userRole} 
    currentView={currentView}
    setUserRole={handleSetUserRoleAndSwitchView}
    setView={(view) => pushAppState(true, userRole, view)}
    onLogoClick={() => pushAppState(false, UserRole.STUDENT_MS, View.STUDENT_DASHBOARD)}
  />;
}