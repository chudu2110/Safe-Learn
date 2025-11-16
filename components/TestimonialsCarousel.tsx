import React, { useEffect, useRef, useState } from 'react';
import { LANDING_ICONS } from '../constants';

type Testimonial = {
  quote: string;
  author: string;
};

export const TestimonialsCarousel: React.FC<{ items: Testimonial[]; intervalMs?: number }> = ({ items, intervalMs = 3500 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const first = el.querySelector('.testimonial-card') as HTMLElement | null;
    if (!first) return;
    const w = first.getBoundingClientRect().width;
    const gap = 32;
    setStep(Math.round(w + gap));
  }, [items.length]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || step === 0) return;
    const id = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = Math.min(el.scrollLeft + step, maxScroll);
      if (next >= maxScroll) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' });
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [step, intervalMs]);

  return (
    <div className="mt-12 overflow-hidden" ref={containerRef}>
      <div className="flex gap-8">
        {items.map((it, idx) => (
          <div key={idx} className="testimonial-card bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 dark:shadow-[0_0_12px_rgba(15,23,42,0.35)] scroll-animate transition-transform duration-300 filter hover:brightness-105 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-200 dark:hover:border-cyan-400 min-w-[320px] md:min-w-[420px]">
            <div className="flex items-start">
              {LANDING_ICONS.quotes}
              <p className="ml-4 text-slate-500 dark:text-slate-300 italic">{it.quote}</p>
            </div>
            <p className="text-right mt-4 font-bold text-slate-900 dark:text-white">{it.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};