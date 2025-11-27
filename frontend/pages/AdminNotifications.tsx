import React, { useEffect, useMemo, useState } from 'react';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';

type AnonItem = { id: number; role: UserRole; text: string; createdAt: number; reviewed?: boolean; answer?: string };

export const AdminNotifications: React.FC = () => {
  const STORAGE_KEY = 'anonymous_questions';
  const [items, setItems] = useState<AnonItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'student' | 'parent' | 'unreviewed'>('all');
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: AnonItem[] = raw ? JSON.parse(raw) : [];
      setItems(list.sort((a,b) => b.createdAt - a.createdAt));
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  useEffect(() => {
    const onCustom = () => load();
    window.addEventListener('anonymous_questions_updated', onCustom as EventListener);
    return () => window.removeEventListener('anonymous_questions_updated', onCustom as EventListener);
  }, []);

  const filtered = useMemo(() => {
    switch(filter) {
      case 'student':
        return items.filter(i => i.role === UserRole.STUDENT_MS || i.role === UserRole.STUDENT_HS);
      case 'parent':
        return items.filter(i => i.role === UserRole.PARENT);
      case 'unreviewed':
        return items.filter(i => !i.reviewed);
      default:
        return items;
    }
  }, [items, filter]);

  const markReviewed = (id: number, reviewed: boolean) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, reviewed } : i);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const saveAnswer = (id: number) => {
    const value = (replyInputs[id] || '').trim();
    if (!value) return;
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, answer: value, reviewed: true } : i);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setReplyInputs(prev => ({ ...prev, [id]: '' }));
  };

  const deleteReviewed = () => {
    setItems(prev => {
      const next = prev.filter(i => !i.reviewed);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      setShowConfirm(false);
      try { window.dispatchEvent(new CustomEvent('anonymous_questions_updated')); } catch {}
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Thông báo</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {ICONS.chat}
            <span>{items.length} câu hỏi ẩn danh</span>
          </span>
          <button
            aria-label="Xóa tin đã xử lý"
            onClick={() => setShowConfirm(true)}
            className="ml-2 flex items-center justify-center w-9 h-9 rounded-full border border-red-300 text-red-600 bg-white dark:bg-slate-800 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {ICONS.trash}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all', label: 'Tất cả' },
          { key: 'student', label: 'Học sinh' },
          { key: 'parent', label: 'Phụ huynh' },
          { key: 'unreviewed', label: 'Chưa xử lý' },
        ] as const).map(it => (
          <button
            key={it.key}
            onClick={() => setFilter(it.key)}
            className={`px-3 py-1.5 text-sm font-bold rounded-full border transition-colors ${filter === it.key ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            {it.label}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto px-3 py-1.5 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Làm mới
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="md:col-span-2 p-6 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            Chưa có câu hỏi nào.
          </div>
        )}
        {filtered.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.reviewed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {new Date(item.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {item.role === UserRole.PARENT ? 'Phụ huynh' : 'Học sinh'}
              </span>
            </div>
            <p className="mt-3 text-slate-900 dark:text-white leading-relaxed">{item.text}</p>
            {item.answer ? (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Trả lời của Admin</div>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line">{item.answer}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <textarea
                  rows={3}
                  value={replyInputs[item.id] || ''}
                  onChange={(e) => setReplyInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-900 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Nhập câu trả lời cho câu hỏi này"
                />
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
              <button
                onClick={() => markReviewed(item.id, !item.reviewed)}
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${item.reviewed ? 'bg-white dark:bg-slate-900 text-green-600 border border-green-300 dark:border-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {item.reviewed ? 'Đánh dấu chưa xử lý' : 'Đánh dấu đã xử lý'}
              </button>
              </div>
              {!item.answer && (
                <button
                  onClick={() => saveAnswer(item.id)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg"
                >
                  Gửi câu trả lời
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[92%] max-w-md bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Xóa tin nhắn đã xử lý?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">Hệ thống sẽ xóa {items.filter(i => i.reviewed).length} tin đã xử lý khỏi danh sách.</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={deleteReviewed}
                disabled={items.filter(i => i.reviewed).length === 0}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 disabled:bg-slate-400 disabled:dark:bg-slate-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
