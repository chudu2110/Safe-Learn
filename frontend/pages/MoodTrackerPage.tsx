import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../constants';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'angry' | 'awful';
type Entry = { mood?: Mood; activities: string[]; sleepHours?: number; note?: string };

const MOOD_STICKERS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'great', emoji: '😀', label: 'Rất tốt' },
  { key: 'good', emoji: '🙂', label: 'Tốt' },
  { key: 'neutral', emoji: '😐', label: 'Bình thường' },
  { key: 'bad', emoji: '🙁', label: 'Chưa ổn' },
  { key: 'awful', emoji: '😢', label: 'Tệ' },
  { key: 'angry', emoji: '😡', label: 'Giận' },
];

const DEFAULT_ACTIVITY_PRESETS = ['học', 'thể thao', 'bạn bè', 'gia đình', 'mạng xã hội', 'âm nhạc', 'đọc sách'];
const CATEGORY_GROUPS: { key: string; title: string; items: { tag: string; label: string; emoji: string }[] }[] = [
  {
    key: 'people',
    title: 'Hôm nay bạn dành thời gian cho ai?',
    items: [
      { tag: 'friends', label: 'bạn bè', emoji: '⭐' },
      { tag: 'family', label: 'gia đình', emoji: '👨‍👩‍👧' },
      { tag: 'partner', label: 'người yêu', emoji: '💞' },
      { tag: 'alone', label: 'một mình', emoji: '🧍' },
    ],
  },
  {
    key: 'weather',
    title: 'Thời tiết hôm nay thế nào?',
    items: [
      { tag: 'sunny', label: 'nắng', emoji: '☀️' },
      { tag: 'cloudy', label: 'mây', emoji: '⛅' },
      { tag: 'rainy', label: 'mưa', emoji: '🌧️' },
      { tag: 'windy', label: 'gió', emoji: '🌬️' },
    ],
  },
  {
    key: 'emotions',
    title: 'Bạn đã cảm thấy những gì trong này hôm nay?',
    items: [
      { tag: 'excited', label: 'háo hức', emoji: '🎉' },
      { tag: 'relaxed', label: 'thư giãn', emoji: '🛋️' },
      { tag: 'proud', label: 'tự hào', emoji: '🏆' },
      { tag: 'hopeful', label: 'hy vọng', emoji: '🎈' },
      { tag: 'anxious', label: 'lo âu', emoji: '😟' },
      { tag: 'angry', label: 'giận', emoji: '😠' },
    ],
  },
  {
    key: 'meals',
    title: 'Bạn đã ăn những bữa nào cho hôm nay?',
    items: [
      { tag: 'breakfast', label: 'sáng', emoji: '🥐' },
      { tag: 'lunch', label: 'trưa', emoji: '🍱' },
      { tag: 'dinner', label: 'tối', emoji: '🍜' },
      { tag: 'snack', label: 'ăn vặt', emoji: '🍪' },
      { tag: 'healthy', label: 'lành mạnh', emoji: '🥗' },
      { tag: 'junk', label: 'đồ ăn nhanh', emoji: '🍟' },
    ],
  },
  {
    key: 'activities',
    title: 'Bạn đã có những hoạt động gì trong ngày?',
    items: [
      { tag: 'study', label: 'học', emoji: '📚' },
      { tag: 'work', label: 'làm việc', emoji: '💼' },
      { tag: 'exercise', label: 'thể thao', emoji: '🏃' },
      { tag: 'travel', label: 'đi lại', emoji: '🚌' },
      { tag: 'music', label: 'âm nhạc', emoji: '🎵' },
      { tag: 'reading', label: 'đọc sách', emoji: '📖' },
      { tag: 'movie', label: 'xem phim', emoji: '🎬' },
      { tag: 'gaming', label: 'game', emoji: '🎮' },
      { tag: 'chores', label: 'việc nhà', emoji: '🧹' },
      { tag: 'meditation', label: 'thiền', emoji: '🧘' },
    ],
  },
];
const STICKER_LIBRARY: string[] = ['😀','🙂','😐','🙁','😢','😡','🤩','🥰','😴','🤔','😭','😷','😎','🤗','😤','😇','👀','✨','⭐','🌈','☀️','⛅','🌧️','🌬️','🌙','🍀','🍎','🍔','🍕','🍰','🍪','☕','🍵','🎵','🎬','🎮','📚','💼','🏃','🧘','📖'];

type ThemePalette = { bg: string; cardBg: string; border: string; text: string; subtext: string; accent: string; name?: string; group?: 'sticky' | 'vintage' };
const THEMES: ThemePalette[] = [
  // Sticky Sunflower (vàng giấy ghi chú)
  { bg: '#fff8c2', cardBg: '#fff3a6', border: '#e6d780', text: '#584a2e', subtext: '#7a6a43', accent: '#ffd34d', name: 'Sunflower', group: 'sticky' },
  // Mint Note
  { bg: '#e8fff2', cardBg: '#dffaea', border: '#bde5cc', text: '#3b5f56', subtext: '#5f7c74', accent: '#9ce3bd', name: 'Mint', group: 'sticky' },
  // Sky Note
  { bg: '#eaf6ff', cardBg: '#e1f0ff', border: '#bcd8f0', text: '#3f556a', subtext: '#62768b', accent: '#8ec8ff', name: 'Sky', group: 'sticky' },
  // Lavender Note
  { bg: '#f5eafe', cardBg: '#efe1fd', border: '#d9c3f5', text: '#5a4a6b', subtext: '#76648a', accent: '#c7a3f0', name: 'Lavender', group: 'sticky' },
  // Peach Note
  { bg: '#fff0e6', cardBg: '#ffe6d6', border: '#f5c7a6', text: '#6b4e3e', subtext: '#8a6a56', accent: '#ffb48a', name: 'Peach', group: 'sticky' },
  // Kraft Sepia (giấy nâu)
  { bg: '#f2e9de', cardBg: '#f6ede3', border: '#e1d1bd', text: '#5f513b', subtext: '#806f53', accent: '#c9b79a', name: 'Kraft', group: 'vintage' },
  // Classic Beige (giữ lại 1 be cổ điển)
  { bg: '#f7f4e8', cardBg: '#faf7ec', border: '#e6dcc2', text: '#6b5e46', subtext: '#8a7a58', accent: '#d8c9a5', name: 'Classic', group: 'vintage' },
  // Dark column
  { bg: '#1f1d1a', cardBg: '#25221e', border: '#3a3328', text: '#f1e9da', subtext: '#d3c7b5', accent: '#a88a5d', name: 'Night Ink', group: 'dark' },
  { bg: '#1d2321', cardBg: '#232a27', border: '#3a4640', text: '#e6f3ec', subtext: '#c8ddd2', accent: '#7fc8a9', name: 'Charcoal Mint', group: 'dark' },
  { bg: '#0f1a24', cardBg: '#13202c', border: '#2a3b4a', text: '#e7eef6', subtext: '#cbd7e1', accent: '#6fa8dc', name: 'Midnight Sky', group: 'dark' },
  { bg: '#1c1722', cardBg: '#221b2a', border: '#3a2d4a', text: '#efeaf6', subtext: '#d7cee6', accent: '#b39ddb', name: 'Deep Lavender', group: 'dark' },
];

const VintageCard: React.FC<{ children: React.ReactNode; className?: string; vintage?: boolean; palette?: ThemePalette }> = ({ children, className, vintage, palette }) => (
  <div className={`rounded-2xl border ${className || ''}`}
       style={{ backgroundColor: vintage ? (palette?.cardBg || '#faf7ec') : '#ffffff', borderColor: vintage ? (palette?.border || '#e6dcc2') : '#e2e8f0', boxShadow: vintage ? '0 6px 20px rgba(150,135,100,0.15)' : undefined }}>
    {children}
  </div>
);

const StickerIcon: React.FC<{ emoji: string; size?: 'sm' | 'md'; palette: ThemePalette; active?: boolean }> = ({ emoji, size = 'sm', palette, active }) => {
  const dim = size === 'md' ? 36 : 28;
  const fontSize = size === 'md' ? 20 : 16;
  const isDark = (palette as any)?.group === 'dark';
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{
        width: dim,
        height: dim,
        backgroundColor: palette.cardBg,
        backgroundImage: isDark ? 'none' : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0) 40%), linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%)',
        border: `1px solid ${active ? (palette.accent) : (palette.border)}`,
        boxShadow: isDark ? 'none' : '0 2px 0 rgba(0,0,0,0.03), 0 6px 12px rgba(0,0,0,0.08)',
        filter: isDark ? 'none' : 'saturate(1.05)'
      }}
    >
      <span style={{ fontSize }}>{emoji}</span>
    </span>
  );
};

const SparkLine: React.FC<{
  values: (number | null)[];
  min: number;
  max: number;
  color: string;
  width?: number;
  height?: number;
  secondary?: { y: number; color: string } | null;
  showGrid?: boolean;
  yTicks?: number[];
  labelY?: (v: number) => string;
  labelX?: (i: number) => string;
  gridColor?: string;
  padLeft?: number;
  padBottom?: number;
  xLabelEvery?: number;
}> = ({ values, min, max, color, width = Math.max(480, (values.length - 1) * 24), height = 120, secondary, showGrid, yTicks, labelY, labelX, gridColor, padLeft = 28, padBottom = 22, xLabelEvery = 3 }) => {
  const chartW = width - padLeft;
  const chartH = height - padBottom;
  const step = (values.length > 1) ? (chartW / (values.length - 1)) : chartW;
  let d = '';
  let prev = false;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) { prev = false; continue; }
    const x = padLeft + i * step;
    const y = ((max - v) / (max - min)) * chartH;
    d += (prev ? 'L' : 'M') + x + ' ' + y + ' ';
    prev = true;
  }
  const secY = secondary ? (((max - secondary.y) / (max - min)) * chartH) : null;
  return (
    <div className="overflow-hidden">
      <svg style={{ width: '100%', height }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {showGrid && (
          <g>
            {Array.from({ length: values.length }).map((_, i) => (
              <path key={`vx-${i}`} d={`M${padLeft + i * step} 0 L${padLeft + i * step} ${chartH}`} stroke={gridColor || '#ddd'} strokeWidth={0.5} />
            ))}
            {(yTicks || []).map((t, idx) => {
              const yy = ((max - t) / (max - min)) * chartH;
              return <path key={`vy-${idx}`} d={`M${padLeft} ${yy} L${padLeft + chartW} ${yy}`} stroke={gridColor || '#ddd'} strokeWidth={0.5} />;
            })}
          </g>
        )}
        {secondary && secY !== null ? (
          <path d={`M${padLeft} ${secY} L${padLeft + chartW} ${secY}`} stroke={secondary.color} strokeWidth={1} strokeDasharray="4 4" fill="none" />
        ) : null}
        <path d={d.trim()} stroke={color} strokeWidth={2} fill="none" />
        {showGrid && labelY && (yTicks || []).map((t, idx) => {
          const yy = ((max - t) / (max - min)) * chartH;
          return <text key={`ly-${idx}`} x={4} y={yy - 2} fill={gridColor || '#888'} fontSize={12}>{labelY(t)}</text>;
        })}
        {showGrid && labelX && values.map((v, i) => (
          i % xLabelEvery === 0 ? <text key={`lx-${i}`} x={padLeft + i * step} y={chartH + padBottom - 6} fill={gridColor || '#888'} fontSize={11}>{labelX(i)}</text> : null
        ))}
      </svg>
    </div>
  );
};

const MonthSelector: React.FC<{ value: Date; onChange: (d: Date) => void; vintage?: boolean; palette?: ThemePalette }> = ({ value, onChange, vintage, palette }) => {
  const months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const prev = () => onChange(new Date(value.getFullYear(), value.getMonth() - 1, 1));
  const next = () => onChange(new Date(value.getFullYear(), value.getMonth() + 1, 1));
  return (
    <div className={`flex items-center justify-between ${vintage ? '' : 'text-slate-700'} px-3 py-2`} style={{ color: vintage ? (palette?.text || '#6b5e46') : undefined }}>
      <button onClick={prev} className={`w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-105`}
        style={{ backgroundColor: vintage ? (palette?.cardBg || '#efe8d5') : '#f1f5f9', border: `1px solid ${palette?.border || '#e6dcc2'}` }}
        aria-label="Tháng trước"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 6l-6 6 6 6" stroke={palette?.text || '#6b5e46'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="text-center mx-3 md:mx-4">
        <p className={`${vintage ? 'font-serif' : 'font-extrabold'} text-xl`}>{months[value.getMonth()]} {value.getFullYear()}</p>
        <p className={`text-xs`} style={{ color: vintage ? (palette?.subtext || '#8a7a58') : undefined }}>Nhật ký cảm xúc</p>
      </div>
      <button onClick={next} className={`w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-105`}
        style={{ backgroundColor: vintage ? (palette?.cardBg || '#efe8d5') : '#f1f5f9', border: `1px solid ${palette?.border || '#e6dcc2'}` }}
        aria-label="Tháng sau"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6l6 6-6 6" stroke={palette?.text || '#6b5e46'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

const DayEditor: React.FC<{
  date: string;
  value: Entry;
  onChange: (e: Entry) => void;
  onClose: () => void;
  vintage?: boolean;
  palette?: ThemePalette;
}> = ({ date, value, onChange, onClose, vintage, palette }) => {
  const [activityInput, setActivityInput] = useState('');
  const addActivity = (s: string) => {
    const t = s.trim();
    if (!t) return;
    onChange({ ...value, activities: Array.from(new Set([...(value.activities || []), t])) });
    setActivityInput('');
  };
  const removeActivity = (s: string) => onChange({ ...value, activities: (value.activities || []).filter(a => a !== s) });
  const hasTag = (t: string) => (value.activities || []).includes(t);
  const toggleTag = (t: string) => hasTag(t) ? removeActivity(t) : addActivity(t);
  const [open, setOpen] = useState<Record<string, boolean>>({ people: false, weather: false, emotions: false, meals: false, activities: false });
  const [customOpen, setCustomOpen] = useState<Record<string, boolean>>({});
  const [customItemsByGroup, setCustomItemsByGroup] = useState<Record<string, { tag: string; label: string; emoji: string }[]>>(() => {
    try {
      const raw = localStorage.getItem('mood_custom_items');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [pickerOpen, setPickerOpen] = useState<Record<string, boolean>>({});
  const [customEmoji, setCustomEmoji] = useState<Record<string, string>>({});
  const saveCustom = (next: Record<string, { tag: string; label: string; emoji: string }[]>) => {
    setCustomItemsByGroup(next);
    try { localStorage.setItem('mood_custom_items', JSON.stringify(next)); } catch {}
  };
  const slug = (s: string) => s.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const addCustomItem = (group: string, emoji: string, label: string) => {
    const e = (emoji || '').trim();
    const l = (label || '').trim();
    if (!l) return;
    const t = `custom:${group}:${slug(l)}`;
    const next = { ...customItemsByGroup };
    const arr = next[group] || [];
    if (!arr.find(x => x.tag === t)) arr.push({ tag: t, label: l, emoji: e || '✨' });
    next[group] = arr;
    saveCustom(next);
  };
  const removeCustomItem = (group: string, tag: string) => {
    const next = { ...customItemsByGroup };
    next[group] = (next[group] || []).filter(x => x.tag !== tag);
    saveCustom(next);
  };
  const Icon: React.FC<{ name: string; color?: string }> = ({ name, color }) => {
    const c = color || '#6b5e46';
    const sw = 1.6;
    if (name === 'friends') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="9" cy="10" r="2.5" fill="none" stroke={c} strokeWidth={sw}/><circle cx="15" cy="10" r="2.5" fill="none" stroke={c} strokeWidth={sw}/><path d="M5 18c3-3 11-3 14 0" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'family') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 19s-6-4.5-6-8a3.5 3.5 0 0 1 6-2 3.5 3.5 0 0 1 6 2c0 3.5-6 8-6 8z" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'partner') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 19s-6-4-6-7a4 4 0 0 1 8 0c0 3-6 7-6 7z" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'alone') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="8" r="2" fill="none" stroke={c} strokeWidth={sw}/><path d="M6 19c2.5-4 9.5-4 12 0" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'sunny') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="none" stroke={c} strokeWidth={sw}/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'cloudy') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 15a4 4 0 1 1 2-7 5 5 0 0 1 9 3h1a3 3 0 0 1 0 6H8" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'rainy') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M7 14a4 4 0 1 1 2-7 5 5 0 0 1 9 3h1a3 3 0 0 1 0 6H9" fill="none" stroke={c} strokeWidth={sw}/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'windy') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 12h9a3 3 0 1 0-3-3" fill="none" stroke={c} strokeWidth={sw}/><path d="M6 16h10a3 3 0 1 1-3 3" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'excited') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 17l6-10 6 10" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'relaxed') return (<svg width="20" height="20" viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="8" rx="2" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'proud') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth={sw}/><path d="M8 13l2 2 6-6" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'hopeful') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 5v14M7 10l5-5 5 5" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'anxious') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 18c3-4 9-4 12 0" fill="none" stroke={c} strokeWidth={sw}/><circle cx="10" cy="10" r="1" fill="none" stroke={c} strokeWidth={sw}/><circle cx="14" cy="10" r="1" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'angry') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 9l2 1M16 9l-2 1M8 16c2-1 6-1 8 0" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'breakfast') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 14c2-4 6-4 8 0" fill="none" stroke={c} strokeWidth={sw}/><path d="M7 16h10" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'lunch') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth={sw}/><path d="M6 16h12" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'dinner') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 16h14M7 16l2-4h6l2 4" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    if (name === 'snack') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth={sw}/><circle cx="10" cy="12" r="0.8" fill="none" stroke={c} strokeWidth={1.2}/><circle cx="13" cy="10" r="0.8" fill="none" stroke={c} strokeWidth={1.2}/></svg>);
    if (name === 'healthy') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 19s-6-4-6-7a4 4 0 0 1 8 0c0 3-6 7-6 7z" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'junk') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 9h12l-1 8H7z" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'study') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 8l7-3 7 3-7 3-7-3v8" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'work') return (<svg width="20" height="20" viewBox="0 0 24 24"><rect x="6" y="9" width="12" height="9" rx="2" fill="none" stroke={c} strokeWidth={sw}/><path d="M9 9V7h6v2" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'exercise') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M7 12h10M9 10v4M15 10v4" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'travel') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 16h16M8 16l2-7h4l2 7" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'music') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 6v10a3 3 0 1 0 2-3V7h6" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'reading') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 7h8a4 4 0 0 1 4 4v6H6z" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'movie') return (<svg width="20" height="20" viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="8" rx="1" fill="none" stroke={c} strokeWidth={sw}/><path d="M6 8l3-3M12 8l3-3M9 16l-3 3M15 16l-3 3" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'gaming') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 14l-2 2M10 12l-2 2M16 12h2M18 14h2" fill="none" stroke={c} strokeWidth={sw}/><path d="M7 16l4-2h2l4 2" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'chores') return (<svg width="20" height="20" viewBox="0 0 24 24"><path d="M7 6h10M9 9h6M8 12h8M7 18h10" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    if (name === 'meditation') return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="8" r="2" fill="none" stroke={c} strokeWidth={sw}/><path d="M6 18c2-3 10-3 12 0" fill="none" stroke={c} strokeWidth={sw}/></svg>);
    return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke={c} strokeWidth={sw}/></svg>);
  };
  const MoodIcon: React.FC<{ mood: Mood; color?: string }> = ({ mood, color }) => {
    const c = color || '#6b5e46';
    if (mood === 'great') return (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 10h.5M14.5 10H15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M8 14c2 2 6 2 8 0" fill="none" stroke={c} strokeWidth="1.8"/></svg>);
    if (mood === 'good') return (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 10h.5M14.5 10H15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M9 14c1.5 1.2 4.5 1.2 6 0" fill="none" stroke={c} strokeWidth="1.8"/></svg>);
    if (mood === 'neutral') return (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 10h.5M14.5 10H15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M9 14h6" fill="none" stroke={c} strokeWidth="1.8"/></svg>);
    if (mood === 'bad') return (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 10h.5M14.5 10H15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M8 15c2-2 6-2 8 0" fill="none" stroke={c} strokeWidth="1.8"/></svg>);
    return (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M9 10h.5M14.5 10H15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M8 16c2-3 6-3 8 0" fill="none" stroke={c} strokeWidth="1.8"/></svg>);
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
      <style>
        {`
        .custom-scroll-y { scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) var(--scroll-bg); }
        .custom-scroll-y::-webkit-scrollbar { width: 8px; }
        .custom-scroll-y::-webkit-scrollbar-track { background: var(--scroll-bg); border-radius: 8px; }
        .custom-scroll-y::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 8px; border: 2px solid var(--scroll-bg); }
        .custom-scroll-y:hover::-webkit-scrollbar-thumb { background: var(--scroll-thumb-hover); }

        .custom-scroll-x { scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) transparent; }
        .custom-scroll-x::-webkit-scrollbar { height: 6px; }
        .custom-scroll-x::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll-x::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 8px; }
        .custom-scroll-x:hover::-webkit-scrollbar-thumb { background: var(--scroll-thumb-hover); }
        .range-themed { -webkit-appearance: none; appearance: none; width: 100%; background: transparent; }
        .range-themed::-webkit-slider-runnable-track { height: 8px; background: var(--range-track); border: 1px solid var(--range-border); border-radius: 999px; }
        .range-themed::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: var(--range-thumb); border: 2px solid var(--range-border); border-radius: 50%; margin-top: -5px; box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
        .range-themed:hover::-webkit-slider-thumb { background: var(--range-hover); }
        .range-themed::-moz-range-track { height: 8px; background: var(--range-track); border: 1px solid var(--range-border); border-radius: 999px; }
        .range-themed::-moz-range-thumb { width: 18px; height: 18px; background: var(--range-thumb); border: 2px solid var(--range-border); border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
        `}
      </style>
      <VintageCard vintage={vintage} palette={palette} className={`w-full md:w-[720px] max-w-[90vw] p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-9 h-9 rounded-full flex items-center justify-center`} style={{ backgroundColor: palette?.cardBg }}>🗓️</span>
            <p className={`${vintage ? 'font-serif' : 'font-bold'}`} style={{ color: palette?.text }}>{date}</p>
          </div>
          <button onClick={onClose} className={`px-3 py-1 rounded-lg font-semibold`} style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}`, color: palette?.text }}>Đóng</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3 max-h-[70vh] overflow-y-auto pr-1 custom-scroll-y" style={{
          ['--scroll-bg' as any]: palette?.bg,
          ['--scroll-thumb' as any]: palette?.border,
          ['--scroll-thumb-hover' as any]: palette?.accent,
        }}>
          <VintageCard vintage={vintage} palette={palette} className="p-4">
            <p className={`${vintage ? 'font-serif' : 'font-bold'}`} style={{ color: palette?.text }}>Ngày hôm nay của bạn thế nào?</p>
            <div className="mt-2 flex items-center gap-2 overflow-x-auto custom-scroll-x" style={{
              ['--scroll-bg' as any]: 'transparent',
              ['--scroll-thumb' as any]: palette?.border,
              ['--scroll-thumb-hover' as any]: palette?.accent,
            }}>
              {MOOD_STICKERS.map(ms => {
                const active = value.mood === ms.key;
                return (
                  <button key={ms.key} onClick={() => onChange({ ...value, mood: ms.key })} className={`min-w-[72px] flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition` }
                    style={{ backgroundColor: active ? (palette?.cardBg) : (palette?.bg), border: active ? `1px solid ${palette?.accent}` : `1px solid ${palette?.border}` }}
                  >
                    <StickerIcon emoji={ms.emoji} size="md" palette={palette as ThemePalette} active={active} />
                    <span className={`text-xs whitespace-nowrap`} style={{ color: palette?.subtext }}>{ms.label}</span>
                  </button>
                );
              })}
            </div>
          </VintageCard>
          {CATEGORY_GROUPS.map(g => (
            <VintageCard key={g.key} vintage={vintage} palette={palette} className="p-4">
              <div className="flex items-center justify-between">
                <p className={`${vintage ? 'font-serif' : 'font-bold'}`} style={{ color: palette?.text }}>{g.title}</p>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setCustomOpen(co=>({ ...co, [g.key]: !co[g.key] }))} className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}`, color: palette?.text }} aria-label="Chỉnh sửa">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4l10-10-4-4L4 16v4z" stroke={palette?.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={()=>setOpen(o=>({ ...o, [g.key]: !o[g.key] }))} className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}`, color: palette?.text }}
                  >{open[g.key] ? '−' : '+'}</button>
                </div>
              </div>
              {customOpen[g.key] && (
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 relative">
                    <button onClick={()=>setPickerOpen(p=>({ ...p, [g.key]: !p[g.key] }))} className="w-9 h-9 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: palette?.bg, border: `1px solid ${palette?.border}` }}>
                      <StickerIcon emoji={customEmoji[g.key] || '🙂'} size="sm" palette={palette as ThemePalette} />
                    </button>
                    <input id={`label-${g.key}`} placeholder="Tên nhãn" className="flex-1 px-2 py-1 rounded-md text-sm" style={{ backgroundColor: palette?.bg, border: `1px solid ${palette?.border}`, color: palette?.text }}/>
                    {pickerOpen[g.key] && (
                      <div className="absolute top-11 left-0 z-50 p-2 rounded-lg grid grid-cols-7 gap-2" style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}` }}>
                        {STICKER_LIBRARY.map(em => (
                          <button key={em} onClick={()=>{ setCustomEmoji(prev => ({ ...prev, [g.key]: em })); setPickerOpen(p=>({ ...p, [g.key]: false })); }} className="w-7 h-7 rounded-md flex items-center justify-center"
                            style={{ border: `1px solid ${palette?.border}` }}>
                            <span>{em}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(customItemsByGroup[g.key]||[]).map(it => (
                      <div key={it.tag} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: palette?.bg, border: `1px solid ${palette?.border}`, color: palette?.text }}>
                        <StickerIcon emoji={it.emoji} size="sm" palette={palette as ThemePalette} />
                        <span className="text-sm break-words">{it.label}</span>
                        <button onClick={()=>removeCustomItem(g.key, it.tag)} className="ml-auto w-6 h-6 rounded-md flex items-center justify-center" style={{ border: `1px solid ${palette?.border}` }} aria-label="Xóa">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12M9 7v10M15 7v10M8 7l1-2h6l1 2" stroke={palette?.text} strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={()=>{
                      const labelEl = document.getElementById(`label-${g.key}`) as HTMLInputElement | null;
                      addCustomItem(g.key, customEmoji[g.key] || '', labelEl?.value || '');
                      if (labelEl) labelEl.value = '';
                    }} className="px-3 py-1 rounded-md text-sm font-semibold" style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}`, color: palette?.text }}>Thêm</button>
                  </div>
                </div>
              )}
              {open[g.key] && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[...g.items, ...((customItemsByGroup[g.key]||[]))].map(it => {
                    const active = hasTag(it.tag);
                    return (
                      <button key={it.tag} onClick={()=>toggleTag(it.tag)} className="flex items-center gap-2 px-3 py-2 rounded-xl transition"
                        style={{ backgroundColor: active ? palette?.cardBg : palette?.bg, border: active ? `1px solid ${palette?.accent}` : `1px solid ${palette?.border}`, color: palette?.text }}
                      >
                        <StickerIcon emoji={it.emoji} size="sm" palette={palette as ThemePalette} active={active} />
                        <span className="text-sm break-words">{it.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </VintageCard>
          ))}
          
          <VintageCard vintage={vintage} palette={palette} className="p-4">
            <p className={`${vintage ? 'font-serif' : 'font-bold'}`} style={{ color: palette?.text }}>Bạn có muốn viết 1 chút gì đó về hôm nay cho bản thân không?</p>
            <textarea value={value.note || ''} onChange={e => onChange({ ...value, note: e.target.value })} placeholder="Viết vài dòng..." className={`mt-3 w-full h-24 px-3 py-2 rounded-lg text-sm`}
              style={{ backgroundColor: palette?.bg, border: `1px solid ${palette?.border}`, color: palette?.text }}/>
          </VintageCard>
          <VintageCard vintage={vintage} palette={palette} className="p-4">
            <p className={`${vintage ? 'font-serif' : 'font-bold'}`} style={{ color: palette?.text }}>Bạn có được một giấc ngủ tốt hôm nay chứ?</p>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={14}
                value={value.sleepHours || 0}
                onChange={e => onChange({ ...value, sleepHours: parseInt(e.target.value) })}
                className="range-themed flex-1"
                style={{
                  ['--range-track' as any]: palette?.bg,
                  ['--range-thumb' as any]: palette?.cardBg,
                  ['--range-border' as any]: palette?.border,
                  ['--range-hover' as any]: palette?.accent,
                }}
              />
              <span className={`font-semibold`} style={{ color: palette?.text }}>{value.sleepHours || 0}h</span>
            </div>
          </VintageCard>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className={`px-4 py-2 rounded-lg font-bold`} style={{ backgroundColor: palette?.cardBg, border: `1px solid ${palette?.border}`, color: palette?.text }}>Hoàn tất</button>
        </div>
      </VintageCard>
    </div>
  );
};

export const MoodTrackerPage: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [themeIdx, setThemeIdx] = useState<number>(() => {
    const s = localStorage.getItem('mood_theme_id');
    const n = s ? parseInt(s) : 0;
    return Number.isFinite(n) ? n % THEMES.length : 0;
  });
  const [themeOpen, setThemeOpen] = useState(false);
  const vintage = true;
  const palette = THEMES[themeIdx];
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [chartOpen, setChartOpen] = useState<null | 'mood' | 'sleep' | 'meals' | 'activities'>(null);
  const [chartType, setChartType] = useState<'mood'|'sleep'|'meals'|'activities'>('mood');
  const [chartFilterOpen, setChartFilterOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('mood_entries');
    if (raw) setEntries(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem('mood_entries', JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem('mood_theme_id', String(themeIdx));
  }, [themeIdx]);

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const grid: (Date | null)[] = Array.from({ length: 42 }).map((_, i) => {
    const idx = i - (startWeekday === 0 ? 6 : startWeekday - 1);
    if (idx < 0 || idx >= daysInMonth) return null;
    return new Date(month.getFullYear(), month.getMonth(), idx + 1);
  });

  const setEntry = (d: string, e: Entry) => setEntries(prev => ({ ...prev, [d]: e }));

  const moodScore = (m?: Mood) => m === 'great' ? 2 : m === 'good' ? 1 : m === 'neutral' ? 0 : m === 'bad' ? -1 : m === 'angry' ? -2 : m === 'awful' ? -2 : 0;
  const monthStats = useMemo(() => {
    const days = grid.filter(Boolean) as Date[];
    const keys = days.map(formatDate);
    const moods = keys.map(k => entries[k]?.mood).filter(Boolean) as Mood[];
    const score = moods.reduce((s, m) => s + moodScore(m), 0);
    const sleepVals = keys.map(k => entries[k]?.sleepHours || 0);
    const avgSleep = sleepVals.length ? Math.round((sleepVals.reduce((a,b)=>a+b,0) / sleepVals.length) * 10) / 10 : 0;
    const activityCounts: Record<string, number> = {};
    keys.forEach(k => (entries[k]?.activities || []).forEach(a => { activityCounts[a] = (activityCounts[a] || 0) + 1; }));
    const topActs = Object.entries(activityCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const moodCounts: Record<Mood, number> = { great:0, good:0, neutral:0, bad:0, angry:0, awful:0 };
    moods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
    const seriesMood = keys.map(k => {
      const m = entries[k]?.mood;
      return m ? moodScore(m) : null;
    });
    const seriesSleep = keys.map(k => {
      const v = entries[k]?.sleepHours;
      return typeof v === 'number' ? v : null;
    });
    return { score, avgSleep, topActs, moodCounts, seriesMood, seriesSleep, keys };
  }, [grid, entries]);

  const barForMood = (m: Mood) => monthStats.moodCounts[m] || 0;

  return (
    <div className={`min-h-screen pb-10 font-serif`} style={{ backgroundColor: palette.bg }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <VintageCard vintage={vintage} palette={palette} className={`p-3 mt-2`}>
          <div className="relative flex items-center justify-between">
            <MonthSelector value={month} onChange={setMonth} vintage={vintage} palette={palette} />
            <div className="flex items-center gap-2">
              <button onClick={()=>setThemeOpen(o=>!o)} className={`px-3 py-2 rounded-lg font-semibold`} style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.text }}>Nền mới</button>
              {themeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={()=>setThemeOpen(false)}></div>
                  <div className="absolute right-3 top-12 z-50 rounded-xl shadow" style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}` }}>
                    <div className="p-2 w-[360px] max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'thin' as any, scrollbarColor: `${palette.subtext} ${palette.cardBg}` }}>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                          {THEMES.filter(t=>t.group!=='dark').map((p) => (
                            <button key={p.name} onClick={()=>{ setThemeIdx(THEMES.findIndex(t=>t.name===p.name)); setThemeOpen(false); }} className="flex items-center gap-2 px-2 py-1 rounded-md hover:opacity-90">
                              <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: p.bg, borderColor: p.border }}>
                                <div className="w-full h-2 rounded-t-md" style={{ backgroundColor: p.cardBg }}></div>
                              </div>
                              <span className="text-xs" style={{ color: palette.text }}>{p.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2">
                          {THEMES.filter(t=>t.group==='dark').map((p) => (
                            <button key={p.name} onClick={()=>{ setThemeIdx(THEMES.findIndex(t=>t.name===p.name)); setThemeOpen(false); }} className="flex items-center gap-2 px-2 py-1 rounded-md hover:opacity-90">
                              <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: p.bg, borderColor: p.border }}>
                                <div className="w-full h-2 rounded-t-md" style={{ backgroundColor: p.cardBg }}></div>
                              </div>
                              <span className="text-xs" style={{ color: palette.text }}>{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </VintageCard>

        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          <VintageCard vintage={vintage} palette={palette} className="lg:col-span-2 p-4">
            <div className="grid grid-cols-7 gap-2">
              {['T2','T3','T4','T5','T6','T7','CN'].map(w => (
                <div key={w} className={`text-center text-xs`} style={{ color: palette.subtext }}>{w}</div>
              ))}
              {grid.map((d, i) => {
                if (!d) return <div key={i} className="h-20"/>;
                const k = formatDate(d);
                const e = entries[k];
                const mood = MOOD_STICKERS.find(ms => ms.key === e?.mood)?.emoji;
                const isToday = formatDate(today) === k;
                return (
                  <button key={k} onClick={() => setEditingDay(k)}
                    className={`relative h-20 rounded-xl flex flex-col items-center justify-center transition hover:scale-[1.01]`}
                    style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}` }}
                  >
                    <span className={`absolute top-2 left-2 text-xs`} style={{ color: palette.subtext }}>{d.getDate()}</span>
                    {mood ? (
                      <span className="text-2xl">{mood}</span>
                    ) : (
                      <span className={`w-9 h-9 border-2 border-dashed rounded-full`} style={{ borderColor: palette.accent }}></span>
                    )}
                    {isToday && (
                      <span className={`absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full shadow`} style={{ backgroundColor: palette.accent }} title="Hôm nay"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </VintageCard>
          <VintageCard vintage={vintage} palette={palette} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className={`font-serif`} style={{ color: palette.text }}>Thống kê tháng</p>
              </div>
              <div className="relative">
                <button onClick={()=>setChartFilterOpen(o=>!o)} aria-label="Bộ lọc biểu đồ" className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.text }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={palette.text} strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                {chartFilterOpen && (
                  <div className="absolute right-0 mt-2 z-50 w-44 rounded-lg" style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}` }}>
                    <button onClick={()=>{ setChartType('mood'); setChartFilterOpen(false); }} className="w-full text-left px-3 py-2 hover:opacity-90" style={{ color: palette.text }}>Mood theo ngày</button>
                    <button onClick={()=>{ setChartType('sleep'); setChartFilterOpen(false); }} className="w-full text-left px-3 py-2 hover:opacity-90" style={{ color: palette.text }}>Giấc ngủ theo ngày</button>
                    <button onClick={()=>{ setChartType('meals'); setChartFilterOpen(false); }} className="w-full text-left px-3 py-2 hover:opacity-90" style={{ color: palette.text }}>Bữa ăn theo ngày</button>
                    <button onClick={()=>{ setChartType('activities'); setChartFilterOpen(false); }} className="w-full text-left px-3 py-2 hover:opacity-90" style={{ color: palette.text }}>Hoạt động theo ngày</button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className={`text-xs`} style={{ color: palette.subtext }}>
                  {chartType==='mood' ? 'Mood theo ngày' : chartType==='sleep' ? 'Giấc ngủ (giờ/ngày)' : chartType==='meals' ? 'Bữa ăn theo ngày (số bữa)' : 'Hoạt động theo ngày (số loại)'}
                </p>
              </div>
              <div className="mt-2">
                {chartType==='mood' && (
                  <SparkLine
                    values={monthStats.seriesMood}
                    min={-2}
                    max={2}
                    color={palette.accent}
                    secondary={{ y: 0, color: palette.border }}
                    height={100}
                    showGrid
                    yTicks={[-2,-1,0,1,2]}
                    labelY={(v)=>String(v + 2)}
                    labelX={(i)=> i === 0 ? '' : String(new Date(monthStats.keys[i]).getDate())}
                    gridColor={palette.border}
                    padLeft={40}
                    padBottom={28}
                    xLabelEvery={3}
                  />
                )}
                {chartType==='sleep' && (
                  <SparkLine
                    values={monthStats.seriesSleep}
                    min={0}
                    max={14}
                    color={palette.accent}
                    secondary={{ y: 8, color: palette.border }}
                    height={100}
                    showGrid
                    yTicks={[0,4,8,12,14]}
                    labelY={(v)=>`${v}h`}
                    labelX={(i)=> i === 0 ? '' : String(new Date(monthStats.keys[i]).getDate())}
                    gridColor={palette.border}
                    padLeft={40}
                    padBottom={28}
                    xLabelEvery={3}
                  />
                )}
                {chartType==='meals' && (
                  (()=>{
                    const mealTags = CATEGORY_GROUPS.find(g=>g.key==='meals')?.items.map(i=>i.tag) || [];
                    const series = monthStats.keys.map(k => {
                      const acts = entries[k]?.activities || [];
                      return acts.filter(a => mealTags.includes(a)).length || 0;
                    });
                    return (
                      <SparkLine
                        values={series}
                        min={0}
                        max={4}
                        color={palette.accent}
                        secondary={{ y: 3, color: palette.border }}
                        height={90}
                        showGrid
                        yTicks={[0,1,2,3,4]}
                        labelY={(v)=>String(v)}
                        labelX={(i)=>String(new Date(monthStats.keys[i]).getDate())}
                        gridColor={palette.border}
                      />
                    );
                  })()
                )}
                {chartType==='activities' && (
                  (()=>{
                    const actTags = CATEGORY_GROUPS.find(g=>g.key==='activities')?.items.map(i=>i.tag) || [];
                    const series = monthStats.keys.map(k => {
                      const acts = entries[k]?.activities || [];
                      return acts.filter(a => actTags.includes(a)).length || 0;
                    });
                    const maxVal = Math.max(4, ...series);
                    const ticks = Array.from({length:5}, (_,i)=> Math.round((i*maxVal)/4));
                    return (
                      <SparkLine
                        values={series}
                        min={0}
                        max={maxVal}
                        color={palette.accent}
                        secondary={null}
                        height={90}
                        showGrid
                        yTicks={ticks}
                        labelY={(v)=>String(v)}
                        labelX={(i)=>String(new Date(monthStats.keys[i]).getDate())}
                        gridColor={palette.border}
                      />
                    );
                  })()
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <button onClick={()=>setChartOpen(chartType)} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ border: `1px solid ${palette.border}`, backgroundColor: palette.cardBg }} aria-label="Phóng to biểu đồ">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 10h6V4M14 20v-6h6" fill="none" stroke={palette.text} strokeWidth="1.6"/></svg>
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className={`font-serif`} style={{ color: palette.text }}>Mood flow</p>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {MOOD_STICKERS.map(ms => (
                  <div key={ms.key} className="flex items-center gap-2">
                    <span className="text-xl">{ms.emoji}</span>
                    <div className={`h-2 flex-1 rounded-full`}
                      style={{ width: `${Math.min(100, barForMood(ms.key) * 10)}%`, backgroundColor: palette.cardBg }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className={`font-serif`} style={{ color: palette.text }}>Hoạt động nổi bật</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {monthStats.topActs.length === 0 ? (
                    <span className={`text-xs`} style={{ color: palette.subtext }}>Chưa có dữ liệu</span>
                  ) : (
                    monthStats.topActs.map(([a, c]) => (
                      <span key={a} className={`px-3 py-1 rounded-full text-xs`} style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.text }}>{a} • {c}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </VintageCard>
        </div>

        {editingDay && (
          <DayEditor
            date={editingDay}
            value={entries[editingDay] || { activities: [], sleepHours: 0, note: '' }}
            onChange={(e)=>setEntry(editingDay, e)}
            onClose={()=>setEditingDay(null)}
            vintage={vintage}
            palette={palette}
          />
        )}
        {chartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <VintageCard vintage={vintage} palette={palette} className="p-4 w-[92vw] max-w-[1000px]">
              <div className="flex items-center justify-between">
                <p className={`font-serif`} style={{ color: palette.text }}>
                  {chartOpen === 'mood' ? 'Mood theo ngày' : chartOpen === 'sleep' ? 'Giấc ngủ theo ngày' : chartOpen === 'meals' ? 'Bữa ăn theo ngày' : 'Hoạt động theo ngày'}
                </p>
                <button onClick={()=>setChartOpen(null)} className="px-3 py-1 rounded-md" style={{ border: `1px solid ${palette.border}`, backgroundColor: palette.cardBg, color: palette.text }}>Đóng</button>
              </div>
              <div className="mt-3">
                {chartOpen === 'mood' ? (
                  <SparkLine
                    values={monthStats.seriesMood}
                    min={-2}
                    max={2}
                    color={palette.accent}
                    secondary={{ y: 0, color: palette.border }}
                    showGrid
                    yTicks={[-2,-1,0,1,2]}
                    labelY={(v)=>String(v + 2)}
                    labelX={(i)=> i === 0 ? '' : String(new Date(monthStats.keys[i]).getDate())}
                    gridColor={palette.border}
                    height={240}
                    padLeft={48}
                    padBottom={36}
                    xLabelEvery={2}
                  />
                ) : chartOpen === 'sleep' ? (
                  <SparkLine
                    values={monthStats.seriesSleep}
                    min={0}
                    max={14}
                    color={palette.accent}
                    secondary={{ y: 8, color: palette.border }}
                    showGrid
                    yTicks={[0,4,8,12,14]}
                    labelY={(v)=>`${v}h`}
                    labelX={(i)=> i === 0 ? '' : String(new Date(monthStats.keys[i]).getDate())}
                    gridColor={palette.border}
                    height={240}
                    padLeft={48}
                    padBottom={36}
                    xLabelEvery={2}
                  />
                ) : chartOpen === 'meals' ? (
                  (()=>{
                    const mealTags = CATEGORY_GROUPS.find(g=>g.key==='meals')?.items.map(i=>i.tag) || [];
                    const series = monthStats.keys.map(k => {
                      const acts = entries[k]?.activities || [];
                      return acts.filter(a => mealTags.includes(a)).length || 0;
                    });
                    return (
                      <SparkLine
                        values={series}
                        min={0}
                        max={4}
                        color={palette.accent}
                        secondary={{ y: 3, color: palette.border }}
                        showGrid
                        yTicks={[0,1,2,3,4]}
                        labelY={(v)=>String(v)}
                        labelX={(i)=>String(new Date(monthStats.keys[i]).getDate())}
                        gridColor={palette.border}
                        height={220}
                      />
                    );
                  })()
                ) : (
                  (()=>{
                    const actTags = CATEGORY_GROUPS.find(g=>g.key==='activities')?.items.map(i=>i.tag) || [];
                    const series = monthStats.keys.map(k => {
                      const acts = entries[k]?.activities || [];
                      return acts.filter(a => actTags.includes(a)).length || 0;
                    });
                    const maxVal = Math.max(4, ...series);
                    const ticks = Array.from({length:5}, (_,i)=> Math.round((i*maxVal)/4));
                    return (
                      <SparkLine
                        values={series}
                        min={0}
                        max={maxVal}
                        color={palette.accent}
                        secondary={null}
                        showGrid
                        yTicks={ticks}
                        labelY={(v)=>String(v)}
                        labelX={(i)=>String(new Date(monthStats.keys[i]).getDate())}
                        gridColor={palette.border}
                        height={220}
                      />
                    );
                  })()
                )}
              </div>
            </VintageCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTrackerPage;
