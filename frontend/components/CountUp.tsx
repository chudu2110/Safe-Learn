import React, { useEffect, useState } from 'react';

export const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 1.2, suffix = '' }) => {
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