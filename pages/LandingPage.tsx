import React, { useEffect, useState } from 'react';
import { LANDING_ICONS, ICONS } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LandingHeader } from '../components/LandingHeader';
import { LandingIllustration } from '../components/LandingIllustration';
import { ContactForm } from '../components/ContactForm';
import { CountUp } from '../components/CountUp';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';

export const LandingPage: React.FC<{ onNavigate: (target: string) => void; isLoggedIn?: boolean; userName?: string }> = ({ onNavigate, isLoggedIn = false, userName }) => {
  useScrollAnimation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const [showTag, setShowTag] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setShowTag(true), 850);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : false;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);
  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 dark:text-slate-100 font-sans">
      <LandingHeader onNavigate={onNavigate} isLoggedIn={isLoggedIn} userName={userName} isDark={isDark} onToggleDark={toggleDark} />
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 ring-1 ring-cyan-200 shadow-md shadow-cyan-500/20 px-3.5 py-1.5 rounded-full text-sm mb-6 transition-opacity duration-500 dark:from-cyan-500 dark:to-accent-purple dark:text-white dark:ring-white/20 dark:shadow-[0_0_18px_rgba(6,182,212,0.45)]" style={{ opacity: showTag ? 1 : 0 }}>
                {LANDING_ICONS.star}
                <span>Giáo dục an toàn, khoa học & thân thiện</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight scroll-animate transition-all duration-700" style={{ transitionDelay: '0ms' }}>
                Hiểu về <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-accent-purple filter drop-shadow-sm transition-transform duration-300 hover:brightness-110 hover:scale-[1.02]">cơ thể</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-orange filter drop-shadow-sm transition-transform duration-300 hover:brightness-110 hover:scale-[1.02]">tâm lý</span> và giới tính
              </h1>
              <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 scroll-animate transition-all duration-700" style={{ transitionDelay: '120ms' }}>
                Nền tảng giáo dục giới tính và sinh sản toàn diện cho học sinh THCS, THPT và phụ huynh. Kiến thức khoa học, môi trường an toàn, không phán xét.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
                  <span className="text-cyan-500">{LANDING_ICONS.shield}</span>
                  <span>100% Ẩn danh</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
                  <span className="text-accent-orange">{LANDING_ICONS.expert}</span>
                  <span>Chuyên gia hỗ trợ</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isLoggedIn ? (
                  <button onClick={() => onNavigate('Khóa học')} className="flex items-center justify-center text-base font-bold text-white bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-6 py-3 rounded-lg hover:bg-cyan-700 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors shadow-lg shadow-cyan-600/30">
                    Xin chào, {userName || 'bạn'}
                  </button>
                ) : (
                  <button onClick={() => onNavigate('Bắt đầu học')} className="flex items-center justify-center text-base font-bold text-white bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-6 py-3 rounded-lg hover:bg-cyan-600 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors shadow-lg shadow-cyan-500/30">
                    Bắt đầu học ngay {LANDING_ICONS.arrow}
                  </button>
                )}
                <button onClick={() => onNavigate('Dành cho phụ huynh')} className="text-base font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-6 py-3 rounded-lg hover:bg-slate-100 hover:dark:bg-slate-700 transition-colors border-2 border-slate-200 dark:border-slate-700">
                  Dành cho phụ huynh
                </button>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-cyan-500"><CountUp end={10000} duration={1.4} suffix="+" /></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Học sinh tin tưởng</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-orange"><CountUp end={50} duration={1.2} suffix="+" /></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bài học tương tác</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-purple"><CountUp end={24} duration={1.2} suffix="/7" /></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Hỗ trợ ẩn danh</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <LandingIllustration />
              <div className="group absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 w-64 border border-slate-200 transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 animate-floating transition-opacity duration-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple dark:border-transparent dark:text-white dark:shadow-[0_0_18px_rgba(6,182,212,0.45)]" style={{ opacity: showTag ? 1 : 0 }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600 transition-transform duration-300 group-hover:scale-110 dark:bg-white/20 dark:text-white">
                  {LANDING_ICONS.shield}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white tracking-wide">An toàn 100%</p>
                  <p className="text-sm text-slate-500 dark:text-white/90">Bảo mật tuyệt đối</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto scroll-animate">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tại sao chọn SafeLearn?</h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Chúng tôi mang đến một môi trường học tập hiện đại, an toàn và hiệu quả, giúp bạn tự tin làm chủ kiến thức.</p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="group text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 dark:bg-white/10 mx-auto mb-4 ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] group-hover:bg-cyan-500/20 transition-all duration-300">{LANDING_ICONS.privacy}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">An toàn & Riêng tư</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Mọi thông tin và câu hỏi đều được bảo mật tuyệt đối. Học tập trong không gian ẩn danh, không phán xét.</p>
              </div>
              <div className="group text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1" style={{transitionDelay: '150ms'}}>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 dark:bg-white/10 mx-auto mb-4 ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] group-hover:bg-cyan-500/20 transition-all duration-300">{LANDING_ICONS.science}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Khoa học & Tin cậy</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Nội dung được biên soạn và kiểm duyệt bởi các chuyên gia y tế và giáo dục hàng đầu.</p>
              </div>
              <div className="group text-center p-8 scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1" style={{transitionDelay: '300ms'}}>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 dark:bg-white/10 mx-auto mb-4 ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] group-hover:bg-cyan-500/20 transition-all duration-300">{LANDING_ICONS.interactive}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tương tác & Dễ hiểu</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Học qua video, trò chơi, tình huống mô phỏng giúp kiến thức không còn khô khan.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto scroll-animate">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tính năng nổi bật</h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Khám phá các công cụ được thiết kế để hỗ trợ tối đa cho hành trình học tập của bạn.</p>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: LANDING_ICONS.path, title: 'Lộ trình học cá nhân', desc: 'Các bài học được thiết kế phù hợp với độ tuổi và nhu cầu riêng của bạn.' },
                { icon: LANDING_ICONS.anonymousQA, title: 'Hỏi đáp ẩn danh', desc: 'Đặt bất kỳ câu hỏi nào và nhận câu trả lời từ chuyên gia mà không sợ bị phán xét.' },
                { icon: LANDING_ICONS.scenarios, title: 'Tình huống tương tác', desc: 'Thực hành các kỹ năng ứng xử qua các tình huống mô phỏng thực tế.' },
                { icon: LANDING_ICONS.mapSupport, title: 'Bản đồ hỗ trợ', desc: 'Dễ dàng tìm kiếm các địa chỉ tư vấn và hỗ trợ sức khỏe sinh sản tin cậy.' }
              ].map((feature, index) => (
                <div key={feature.title} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 dark:shadow-[0_0_12px_rgba(15,23,42,0.35)] scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-200 dark:hover:border-cyan-400" style={{ transitionDelay: `${index * 150}ms`}}>
                  {feature.icon}
                  <h3 className="font-bold text-slate-900 dark:text-white mt-4">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-300 text-sm mt-2">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto scroll-animate">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Học viên nói gì về chúng tôi</h2>
            </div>
            <TestimonialsCarousel
              items={[
                { quote: 'Nhờ SafeLearn, em không còn ngại ngùng khi nói về những thay đổi của cơ thể mình. Các bài học rất dễ hiểu và không hề khô khan như em nghĩ.', author: '- An Nhiên, Học sinh lớp 8' },
                { quote: 'Ứng dụng này là một công cụ tuyệt vời. Tôi đã biết cách trò chuyện với con trai về các vấn đề nhạy cảm một cách cởi mở và khoa học hơn.', author: '- Anh Minh, Phụ huynh' },
                { quote: 'Các tình huống mô phỏng giúp em biết cách ứng xử phù hợp. Em thấy tự tin hơn rất nhiều.', author: '- Tuấn Khoa, Học sinh lớp 9' },
                { quote: 'Nội dung có tính khoa học, dễ hiểu và phù hợp với lứa tuổi. Tôi yên tâm khi con học trên SafeLearn.', author: '- Chị Hà, Phụ huynh' },
                { quote: 'Phần hỏi đáp ẩn danh thật sự hữu ích, em có thể hỏi những điều khó nói một cách thoải mái.', author: '- Minh Châu, Học sinh lớp 10' },
                { quote: 'SafeLearn giúp tôi có thêm kiến thức để đồng hành cùng con một cách đúng đắn.', author: '- Anh Phúc, Phụ huynh' }
              ]}
              intervalMs={3500}
            />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-cyan-600 text-white p-12 rounded-2xl text-center relative overflow-hidden scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_0_24px_rgba(6,182,212,0.45)]">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
              <h2 className="text-4xl font-extrabold relative">Sẵn sàng bắt đầu hành trình của bạn?</h2>
              <p className="mt-4 max-w-2xl mx-auto opacity-80 relative">Trang bị kiến thức, xây dựng sự tự tin và vững bước vào tương lai cùng SafeLearn.</p>
              <button onClick={() => onNavigate('Bắt đầu học')} className="mt-8 flex items-center justify-center mx-auto text-base font-bold text-cyan-600 bg-white dark:text-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple px-8 py-4 rounded-xl hover:bg-slate-200 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 transition-colors shadow-2xl">
                Bắt đầu học ngay {LANDING_ICONS.arrow}
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Liên hệ</h2>
                <ContactForm />
              </div>
              <div className="scroll-animate bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-cyan-100 animate-glowing"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Chúng tôi sẵn sàng hỗ trợ và lắng nghe bạn.</p>
                <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                  <p><span className="font-semibold">Email:</span> support@safelearn.vn</p>
                  <p><span className="font-semibold">Hotline:</span> 024-1234-5678</p>
                  <p><span className="font-semibold">Thời gian:</span> 08:00–17:30 (T2–T6)</p>
                  <p><span className="font-semibold">Địa chỉ:</span> Km 2, Quốc lộ 2B, xã Định Trung, thành phố Vĩnh Yên, tỉnh Vĩnh Phúc</p>
                </div>
                <div className="mt-6">
                  <a href="tel:02412345678" className="px-4 py-2 rounded-lg bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple text-white font-semibold hover:bg-cyan-600 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90">Gọi Hotline</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SafeLearn. Mọi quyền được bảo lưu.</p>
          <p className="mt-2">Một sản phẩm vì cộng đồng, giúp thế hệ trẻ Việt Nam tự tin và an toàn hơn.</p>
        </div>
      </footer>
    </div>
  );
};