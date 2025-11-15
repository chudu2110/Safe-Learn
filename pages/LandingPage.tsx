import React, { useEffect, useState } from 'react';
import { LANDING_ICONS, ICONS } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LandingHeader } from '../components/LandingHeader';
import { LandingIllustration } from '../components/LandingIllustration';
import { ContactForm } from '../components/ContactForm';
import { CountUp } from '../components/CountUp';

export const LandingPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
  useScrollAnimation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const [showTag, setShowTag] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowTag(true), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-slate-50 font-sans">
      <LandingHeader onNavigate={onNavigate} />
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 font-semibold px-3.5 py-1.5 rounded-full text-sm mb-6 ring-1 ring-cyan-200 shadow-md shadow-cyan-500/20 transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
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
                <div className="flex items-center space-x-2 text-slate-500 transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
                  <span className="text-cyan-500">{LANDING_ICONS.shield}</span>
                  <span>100% Ẩn danh</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
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
            <div className="relative">
              <LandingIllustration />
              <div className="group absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 w-64 border border-slate-200 transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 animate-floating transition-opacity duration-500" style={{ opacity: showTag ? 1 : 0 }}>
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
                { icon: LANDING_ICONS.path, title: 'Lộ trình học cá nhân', desc: 'Các bài học được thiết kế phù hợp với độ tuổi và nhu cầu riêng của bạn.' },
                { icon: LANDING_ICONS.anonymousQA, title: 'Hỏi đáp ẩn danh', desc: 'Đặt bất kỳ câu hỏi nào và nhận câu trả lời từ chuyên gia mà không sợ bị phán xét.' },
                { icon: LANDING_ICONS.scenarios, title: 'Tình huống tương tác', desc: 'Thực hành các kỹ năng ứng xử qua các tình huống mô phỏng thực tế.' },
                { icon: LANDING_ICONS.mapSupport, title: 'Bản đồ hỗ trợ', desc: 'Dễ dàng tìm kiếm các địa chỉ tư vấn và hỗ trợ sức khỏe sinh sản tin cậy.' }
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
                <div className="mt-6">
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