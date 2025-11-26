import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LessonPlayer } from '../components/LessonPlayer';
import { getLessonSections } from '../video-sources';
import { ICONS, LEADERBOARD_DATA, ROADMAP_HS_DATA, ROADMAP_MS_DATA, STUDENT_HS_COURSES, STUDENT_MS_COURSES } from '../constants';
import { CourseModule, UserRole, RoadmapItem } from '../types';

export const StudentDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const courses = userRole === UserRole.STUDENT_HS ? STUDENT_HS_COURSES : STUDENT_MS_COURSES;
  const roadmap = userRole === UserRole.STUDENT_HS ? ROADMAP_HS_DATA : ROADMAP_MS_DATA;
  const [selectedLesson, setSelectedLesson] = useState<RoadmapItem | null>(null);
  const [playing, setPlaying] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showCollection, setShowCollection] = useState(false);
  const overall = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);
  const yGap = 120;
  const lanes = [0, 100, 0, 100];
  const progressKey = useMemo(() => selectedLesson ? `progress:${userRole}:${selectedLesson.id}` : '', [userRole, selectedLesson]);
  const sectionsMemo = useMemo(() => selectedLesson ? (getLessonSections(userRole, selectedLesson.id, selectedLesson.title) as any) : [], [userRole, selectedLesson]);

  useEffect(() => {
    if (selectedLesson) {
      try {
        const raw = localStorage.getItem(`progress:${userRole}:${selectedLesson.id}`);
        const val = raw ? parseInt(raw) : 0;
        setLessonProgress(Number.isFinite(val) ? Math.max(0, Math.min(100, val)) : 0);
      } catch {}
    }
  }, [selectedLesson, userRole]);
  const MEDAL_ICONS = ['🏅','🎖️','⭐','🎯','🏆','🥇','🥈','🥉'];

  const startLesson = (lesson?: RoadmapItem) => {
    let target = lesson || roadmap.find(r => r.status === 'current') || roadmap.find(r => r.status === 'completed');
    if (!target) {
      const firstUnlocked = roadmap.find(r => r.status !== 'locked');
      if (firstUnlocked) target = firstUnlocked;
    }
    if (target) {
      setSelectedLesson(target);
      setPlaying(true);
    }
  };

  const toneForModule = (p: number): 'cyan'|'emerald'|'slate' => p>=100?'emerald':p>0?'cyan':'slate';

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
    } as const;

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
    } as const;

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
          <span className={`absolute inset-0 rounded-full ring-4 bg-gradient-to-br ${style.base} ${style.ring} flex items-center justify-center shadow-2xl ${isCurrent ? 'animate-glowing' : ''}`}>
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
          <button onClick={()=>startLesson()} className="px-4 py-2 bg-white text-cyan-600 font-bold rounded-lg shadow hover:bg-slate-100">Tiếp tục học</button>
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
        <div className="flex items-center justify_between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tổng kinh nghiệm</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalXp} XP</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Huy hiệu đang sở hữu</p>
            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-300">{owned.length} / {badges.length}</p>
          </div>
        </div>
        <h4 className="mt-6 mb-2 text_sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Huy hiệu khóa học</h4>
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
                    <div className="absolute -inset-8 bg-gradient-to-r from-transparent via_white/20 to-transparent animate-shimmer"></div>
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
                {isOwned && (<div className="absolute -bottom-2 -right-3 w-16 h-16 rounded_full bg-accent-purple/20 blur-xl"></div>)}
                {isOwned && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute -inset-8 bg-gradient-to-r from-transparent via_white/20 to-transparent animate-shimmer"></div>
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
    const btnBase = 'inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm';
    const btnOutline = `${btnBase} font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 hover:dark:bg-slate-700`;
    const btnPrimaryEnabled = `${btnBase} font-bold min-w-[96px] bg-cyan-600 hover:bg-cyan-700 text-white`;
    const btnPrimaryDisabled = `${btnBase} font-bold min-w-[96px] bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-white`;
    return (
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button onClick={()=>setTab('all')} className={`${btnOutline} ${tab==='all'?'ring-2 ring-cyan-300':''}`}>Tất cả</button>
            <button onClick={()=>setTab('current')} className={`${btnOutline} ${tab==='current'?'ring-2 ring-cyan-300':''}`}>Đang học</button>
            <button onClick={()=>setTab('completed')} className={`${btnOutline} ${tab==='completed'?'ring-2 ring-cyan-300':''}`}>Đã hoàn thành</button>
            <button onClick={()=>setTab('locked')} className={`${btnOutline} ${tab==='locked'?'ring-2 ring-cyan-300':''}`}>Chưa mở</button>
          </div>
          <div className="relative">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm bài học..." className="w-full sm:w-72 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"/>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          {filtered.map((it) => {
            const isOpen = open.includes(it.id);
            const primaryLabel = it.status === 'completed' ? 'Ôn lại' : 'Bắt đầu';
            return (
              <div key={it.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items_center justify_center text-lg">{lessonEmoji(it.title)}</div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{label(it.status)}</p>
                      <h4 className="font-bold text-slate-900 dark:text-white">{it.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>{ if(it.status!=='locked'){ setSelectedLesson(it); setPlaying(true); } }} className={it.status==='locked'?btnPrimaryDisabled:btnPrimaryEnabled}>{primaryLabel}</button>
                    <button onClick={()=>toggle(it.id)} className={btnOutline}>{isOpen?'Đóng':'Chi tiết'}</button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-4 space-y-3">
                    {[1,2,3].map((n) => (
                      <div key={n} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <div className="w-8 h-8 rounded-full bg_white dark:bg-slate-900 flex items-center justify-center text-cyan-600">{n}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Nội dung {n}: {it.title.replace('Bài','Phần')}</p>
                          <p className="text-xs text-slate-5 00 dark:text-slate-400">3–6 phút • Câu hỏi tương tác</p>
                        </div>
                        <button className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Xem</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length===0 && (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">Không tìm thấy bài học phù hợp</div>
          )}
        </div>
      </div>
    );
  };

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
              <button onClick={()=>startLesson()} className="px-3 py-2 bg-cyan-600 text-white rounded-lg font-bold text-sm hover:bg-cyan-700">Tiếp tục học</button>
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
            <button onClick={()=>setPlaying(true)} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl">{lessonProgress>=100 ? 'Ôn lại' : lessonProgress===0 ? 'Bắt đầu học' : 'Tiếp tục học'}</button>
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

      {playing && selectedLesson && (
        <LessonPlayer
          title={selectedLesson.title}
          sections={sectionsMemo}
          onClose={()=>setPlaying(false)}
          onNext={()=>{
            if (!selectedLesson) { setPlaying(false); return; }
            const idx = roadmap.findIndex(r => r.id === selectedLesson.id);
            const next = idx>=0 ? roadmap.slice(idx+1).find(r => r.status !== 'locked') : null as any;
            if (next) {
              setSelectedLesson(next);
              setPlaying(true);
              setLessonProgress(0);
              try { localStorage.setItem(`progress:${userRole}:${next.id}`, '0'); } catch {}
            } else {
              setPlaying(false);
            }
          }}
          onProgress={(p)=>{
            setLessonProgress(p);
            try {
              localStorage.setItem(`progress:${userRole}:${selectedLesson.id}`, String(p));
            } catch {}
            if (p>=100) setSelectedLesson((l)=> l ? { ...l, status: 'completed' } : l);
          }}
        />
      )}
    </div>
  );
};
