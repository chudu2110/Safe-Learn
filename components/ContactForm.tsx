import React, { useState } from 'react';

export const ContactForm: React.FC = () => {
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
    <form onSubmit={handleSubmit} className="scroll-animate bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-1">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 dark:text-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 dark:text-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số điện thoại (tuỳ chọn)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 dark:text-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiêu đề</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 dark:text-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nội dung</label>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 dark:text-slate-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      {submitted && <p className="mt-3 text-sm font-medium text-green-600">Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất!</p>}
      <button type="submit" disabled={isSubmitting} className="mt-4 bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple hover:bg-cyan-600 dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
        {isSubmitting ? 'Đang gửi...' : 'Gửi email'}
      </button>
    </form>
  );
};