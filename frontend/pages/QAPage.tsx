import React, { useState } from 'react';
import { QA_DATA, QA_PARENTS_DATA } from '../constants';
import { UserRole } from '../../types';
import { moderateQuestion } from '../services/geminiService';

export const QAPage: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const popular = userRole === UserRole.PARENT ? QA_PARENTS_DATA : QA_DATA;
  const placeholder = userRole === UserRole.PARENT
    ? 'Ví dụ: Nói chuyện về giới tính với con 10 tuổi như thế nào?'
    : 'Ví dụ: Làm sao để từ chối khi bạn bè rủ xem phim người lớn?';

  const saveAnonymousQuestion = (role: UserRole, text: string) => {
    try {
      const key = 'anonymous_questions';
      const raw = localStorage.getItem(key);
      const list: Array<{ id: number; role: UserRole; text: string; createdAt: number; reviewed?: boolean }>
        = raw ? JSON.parse(raw) : [];
      const id = list.length ? list[list.length - 1].id + 1 : 1;
      const item = { id, role, text: text.trim(), createdAt: Date.now(), reviewed: false };
      list.push(item);
      localStorage.setItem(key, JSON.stringify(list));
      try { window.dispatchEvent(new CustomEvent('anonymous_questions_updated')); } catch {}
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsSubmitting(true);
    setMessage(null);
    const result = await moderateQuestion(question);
    if (result.isAppropriate) {
      setMessage({ text: result.reason, type: 'success' });
      saveAnonymousQuestion(userRole, question);
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
            placeholder={placeholder}
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
          {popular.filter(q => q.isPopular).map(q => (
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
