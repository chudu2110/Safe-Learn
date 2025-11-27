import React, { useEffect, useMemo, useRef, useState } from 'react';
import { READING_TOPICS, getReadingTopicByKey } from '../content/reading';
import { QUIZ_QUESTIONS, getThcsQuizByLesson } from '../content/quiz';
import { getThptQuizByLesson } from '../content/quiz/thpt';
import { UserRole } from '../types';

type LessonSection = {
  id: string;
  title: string;
  kind: 'video' | 'reading' | 'quiz' | 'foundation' | 'quick';
  durationLabel: string;
  src?: string;
  readingId?: string;
};

export const LessonPlayer: React.FC<{
  title: string;
  sections: LessonSection[];
  userRole?: UserRole;
  initialIndex?: number;
  onClose?: () => void;
  onNext?: () => void;
  onProgress?: (percent: number) => void;
}> = ({ title, sections, userRole, initialIndex = 0, onClose, onNext, onProgress }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const [seeking, setSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>(() => sections.map(() => false));
  const [showModal, setShowModal] = useState(false);
  const percent = Math.round((completed.filter(Boolean).length / sections.length) * 100);
  const [subView, setSubView] = useState<null | { type: 'foundation' | 'quick'; id?: string }>(null);

  const active = sections[activeIndex];
  const isVideo = active?.kind === 'video';
  const isYouTube = typeof active?.src === 'string' && (active.src.includes('youtube.com') || active.src.includes('youtu.be'));
  const canNext = activeIndex < sections.length - 1;
  const playerId = useMemo(() => (isYouTube ? `yt-${active.id}` : ''), [isYouTube, active?.id]);
  const ytRef = useRef<any>(null);
  const ytTimer = useRef<number | null>(null);
  const [ytReady, setYtReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (onProgress) onProgress(percent);
  }, [percent]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
  }, [volume]);

  const speedOptions = useMemo(() => [0.75, 1, 1.25, 1.5, 1.75], []);
  const kindLabel = (k: LessonSection['kind']) => {
    if (k === 'video') return 'Video';
    if (k === 'reading') return 'Đọc';
    if (k === 'quiz') return 'Quiz';
    if (k === 'foundation') return 'Kiến thức';
    if (k === 'quick') return 'Câu hỏi nhanh';
    return 'Nội dung';
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => { setDuration(v.duration || 0); setPaused(v.paused); };
    const onTime = () => {
      const t = v.currentTime || 0;
      setCurrent(t);
      if (isVideo && duration && !completed[activeIndex] && duration - t <= 10) {
        setCompleted(prev => {
          const next = [...prev];
          next[activeIndex] = true;
          const newPercent = Math.round((next.filter(Boolean).length / sections.length) * 100);
          if (onProgress) onProgress(newPercent);
          return next;
        });
        setShowModal(true);
      }
    };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    const onEnded = () => {
      setCompleted(prev => {
        const next = [...prev];
        next[activeIndex] = true;
        const newPercent = Math.round((next.filter(Boolean).length / sections.length) * 100);
        if (onProgress) onProgress(newPercent);
        return next;
      });
      setShowModal(true);
    };
    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
    };
  }, [activeIndex]);

  useEffect(() => {
    setCompleted(sections.map(() => false));
    setActiveIndex(initialIndex);
  }, [sections]);

  useEffect(() => {
    const html = document.documentElement as HTMLElement;
    const body = document.body as HTMLElement;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => { html.style.overflow = prevHtml; body.style.overflow = prevBody; };
  }, []);

  useEffect(() => {
    if (!active) return;
    if (active.kind !== 'foundation' && active.kind !== 'quick') setSubView(null);
  }, [activeIndex]);

  

  useEffect(() => {
    if (!subView) return;
    try { videoRef.current?.pause(); } catch {}
    try { if (ytRef.current && typeof ytRef.current.pauseVideo === 'function') ytRef.current.pauseVideo(); } catch {}
  }, [subView]);

  useEffect(() => {
    if (!active) return;
    if (active.kind === 'reading') {
      const t = window.setTimeout(() => {
        setCompleted(prev => {
          const next = [...prev];
          next[activeIndex] = true;
          const newPercent = Math.round((next.filter(Boolean).length / sections.length) * 100);
          if (onProgress) onProgress(newPercent);
          return next;
        });
      }, 5000);
      return () => window.clearTimeout(t);
    }
  }, [activeIndex]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    if (!zoom) return;
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowControls(false), 2000);
  };

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = ratio * duration;
  };

  const QuizBlock: React.FC<{ onComplete: () => void; questions: { q: string; options: string[]; correct: number }[] }> = ({ onComplete, questions }) => {
    const qs = useMemo(() => questions, [questions]);
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const total = qs.length;
    const currentQ = qs[idx];

    const submit = () => {
      if (selected === null) return;
      const ok = selected === currentQ.correct;
      setFeedback(ok ? 'Chính xác!' : 'Chưa đúng, thử lại.');
      if (ok) {
        setScore(s => s + 1);
      }
    };
    const next = () => {
      setFeedback(null);
      setSelected(null);
      if (idx < total - 1) {
        setIdx(i => i + 1);
      } else {
        onComplete();
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Câu hỏi ôn tập</h2>
          <p className="text-slate-600 dark:text-slate-300">Câu {idx + 1} / {total} • Điểm: {score}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{currentQ.q}</p>
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selected===i ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" name="quiz" checked={selected===i} onChange={() => setSelected(i)} />
                <span className="text-slate-700 dark:text-slate-200">{opt}</span>
              </label>
            ))}
          </div>
          {feedback && (<p className={`mt-4 text-sm font-medium ${feedback.includes('Chính xác') ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>{feedback}</p>)}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition">Xác nhận</button>
            <button onClick={next} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition">Tiếp tục</button>
          </div>
        </div>
      </div>
    );
  };

  const updateHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setHoverTime(ratio * duration);
    setHoverX((e.clientX - rect.left));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  const rewind = (sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(v.currentTime - sec, 0);
  };

  const forward = (sec: number) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = Math.min(v.currentTime + sec, duration);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current as any;
    if (!document.fullscreenElement) {
      if (el && el.requestFullscreen) await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (!isYouTube) return;
    const ensureAPI = () => {
      if ((window as any).YT && (window as any).YT.Player) return Promise.resolve();
      return new Promise<void>((resolve) => {
        (window as any).onYouTubeIframeAPIReady = () => resolve();
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(s);
      });
    };
    const createPlayer = async () => {
      await ensureAPI();
      const raw = active.src || '';
      const url = new URL(raw);
      let vid = '';
      if (url.hostname.includes('youtu.be')) vid = url.pathname.replace('/', '');
      else vid = url.searchParams.get('v') || '';
      const list = url.searchParams.get('list') || undefined;
      ytRef.current = new (window as any).YT.Player(playerId, {
        videoId: vid,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 1,
          list: list,
        },
        events: {
          onReady: (e: any) => {
            setYtReady(true);
            try { setDuration(e.target.getDuration() || 0); } catch {}
          },
          onStateChange: (e: any) => {
            const s = e.data;
            setPaused(!(s === 1));
            if (s === 1) {
              if (ytTimer.current) window.clearInterval(ytTimer.current);
              ytTimer.current = window.setInterval(() => {
                try {
                  const t = ytRef.current.getCurrentTime() || 0;
                  setCurrent(t);
                  const d = ytRef.current.getDuration() || duration;
                  if (d && !completed[activeIndex] && d - t <= 10) {
                    setCompleted(prev => {
                      const next = [...prev];
                      next[activeIndex] = true;
                      const newPercent = Math.round((next.filter(Boolean).length / sections.length) * 100);
                      if (onProgress) onProgress(newPercent);
                      return next;
                    });
                    setShowModal(true);
                  }
                } catch {}
              }, 250);
            } else {
              if (ytTimer.current) { window.clearInterval(ytTimer.current); ytTimer.current = null; }
            }
          },
        }
      });
    };
    createPlayer();
    return () => {
      if (ytTimer.current) { window.clearInterval(ytTimer.current); ytTimer.current = null; }
      ytRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, playerId, activeIndex]);

  

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Thoát</button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate max-w-[50vw]">{title}</h1>
        </div>
        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div style={{ width: `${percent}%` }} className="h-2 bg-cyan-600"></div>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{percent}%</span>
        </div>
      </div>

      <div className={`${zoom ? 'grid grid-cols-[1fr]' : 'grid grid-cols-1 lg:grid-cols-[280px,1fr]'} flex-1 gap-3 lg:gap-4 p-3 sm:p-5`}>
        <aside className={`${zoom ? 'hidden' : ''} rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col`}>
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mục lục</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sections.map((s, i) => (
              <button type="button"
                key={s.id}
                onClick={() => { 
                  setActiveIndex(i); 
                  if (s.kind==='foundation') setSubView({ type: 'foundation', id: s.readingId || READING_TOPICS[0]?.id });
                  else if (s.kind==='quick') setSubView({ type: 'quick' });
                  else setSubView(null);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:dark:bg-slate-700 ${i===activeIndex?'bg-cyan-50 dark:bg-cyan-500/10':''}`}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: s.kind==='video' ? 'linear-gradient(135deg,#0ea5e9,#8b5cf6)' : (s.kind==='reading' || s.kind==='foundation') ? 'linear-gradient(135deg,#10b981,#0ea5e9)' : 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                  {s.kind==='video' ? '▶' : (s.kind==='reading' || s.kind==='foundation') ? '📖' : '❓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{s.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{kindLabel(s.kind)} • {s.durationLabel}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative">
            {isVideo && isYouTube ? (
              <div id={playerId} className={zoom ? 'w-full h-[calc(100vh-56px-2rem)] bg-black' : 'w-full h-[78vh] sm:h-[75vh] bg-black'} />
            ) : isVideo ? (
              <video
                ref={videoRef}
                key={active.id}
                src={active.src || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                controls={!zoom}
                className={zoom ? 'w-full h-[calc(100vh-56px-2rem)] bg-black object-contain' : 'w-full h-[78vh] sm:h-[75vh] bg-black object-contain'}
              />
            ) : active.kind === 'foundation' ? (
              <div className="p-6 min-h-[45vh]">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Kiến thức nền tảng</h2>
                  <p className="text-slate-600 dark:text-slate-300">Tìm kiếm, lọc theo tag, xem thẻ nội dung. Bạn sẽ bổ sung nội dung sau.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input placeholder="Tìm chủ đề..." className="flex-1 p-3 bg-white dark:bg-slate-800 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" />
                    <div className="flex items-center gap-2">
                      {['Tất cả','Cơ bản','Kỹ năng','Sức khỏe'].map(t => (
                        <button key={t} className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {READING_TOPICS.map((t,i)=>(
                    <div key={i} className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-400 transition-shadow shadow-md">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">{t.blocks[0]?.text || ''}</p>
                      <div className="flex items-center justify-between">
                        <button onClick={()=>setSubView({ type: 'foundation', id: t.id })} className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition">Xem chi tiết</button>
                        <button className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition">Lưu</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : active.kind === 'quick' ? (
              <div className="p-6 min-h-[45vh]">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Câu hỏi nhanh</h2>
                  <p className="text-slate-600 dark:text-slate-300">Chọn chip chủ đề hoặc nhập câu hỏi ngắn.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Đồng thuận','Dậy thì','Mối quan hệ','An toàn','Bản dạng giới','Sức khỏe'].map(c => (
                      <button key={c} className="px-3 py-2 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{c}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input placeholder="Nhập câu hỏi ngắn..." className="flex-1 p-3 bg-white dark:bg-slate-800 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" />
                    <button onClick={()=>setSubView({ type: 'quick' })} className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition">Gợi ý</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Mẹo nhanh về Đồng thuận', desc: 'Tôn trọng ranh giới, nói rõ ràng.' },
                    { title: 'Dậy thì an toàn', desc: 'Chuẩn bị kiến thức, trao đổi cởi mở.' },
                    { title: 'Quan hệ lành mạnh', desc: 'Tin tưởng, tôn trọng, giao tiếp.' },
                    { title: 'An toàn trên mạng', desc: 'Nhận diện nội dung độc hại.' },
                  ].map((b,i)=>(
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{b.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : active.kind === 'reading' ? (
              <div className="p-6 min-h-[45vh]">
                {(() => {
                  const topic = getReadingTopicByKey(active.title);
                  return (
                    <div className="max-w-4xl mx-auto">
                      <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Bài đọc tương tác.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          {topic.blocks.map((b, i) => (
                            <section key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{b.heading}</h3>
                              <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">{b.text}</p>
                              {b.bullets && (
                                <ul className="mt-3 list-disc list-inside text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                  {b.bullets.map((it, j) => (<li key={j}>{it}</li>))}
                                </ul>
                              )}
                            </section>
                          ))}
                        </div>
                        <aside className="space-y-4">
                          {(topic.aside || []).map((a, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{a.title}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.text}</p>
                            </div>
                          ))}
                        </aside>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : active.kind === 'quiz' ? (
              <div className="p-6 min-h-[45vh]">
                <QuizBlock questions={(userRole===UserRole.STUDENT_HS? getThptQuizByLesson : getThcsQuizByLesson)(parseInt(((sections[0]?.id || '').split('-')[1]) || '1'))} onComplete={() => {
                  setCompleted(prev => {
                    const next = [...prev];
                    next[activeIndex] = true;
                    const newPercent = Math.round((next.filter(Boolean).length / sections.length) * 100);
                    if (onProgress) onProgress(newPercent);
                    return next;
                  });
                  setShowModal(true);
                }} />
              </div>
            ) : (
              <div className="p-6 min-h-[45vh]">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{active.title}</h2>
                <p className="text-slate-600 dark:text-slate-300">Nội dung đọc tương tác sẽ hiển thị tại đây.</p>
              </div>
            )}
            {subView && (
              <div className="absolute inset-0 z-[30] bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-4 sm:p-6 pb-10 pr-2 custom-scroll max-h-[80vh] overflow-y-auto overscroll-y-contain scroll-smooth">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{subView.type === 'foundation' ? 'Chi tiết kiến thức' : 'Gợi ý câu hỏi nhanh'}</h3>
                    <button onClick={()=>setSubView(null)} className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Đóng</button>
                  </div>
                  {subView.type === 'foundation' ? (
                    (() => {
                      const topic = READING_TOPICS.find(t => t.id === subView.id) || READING_TOPICS[0];
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-6">
                            {topic.blocks.map((b, i) => (
                              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{b.heading}</h4>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">{b.text}</p>
                                {b.bullets && (
                                  <ul className="mt-2 list-disc list-inside text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                    {b.bullets.map((it, j) => (<li key={j}>{it}</li>))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                          <aside className="space-y-4">
                            {(topic.aside || []).map((a, i) => (
                              <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{a.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.text}</p>
                              </div>
                            ))}
                          </aside>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="max-w-3xl mx-auto">
                      <QuizBlock questions={(userRole===UserRole.STUDENT_HS? getThptQuizByLesson : getThcsQuizByLesson)(parseInt(((sections[0]?.id || '').split('-')[1]) || '1'))} onComplete={() => setSubView(null)} />
                    </div>
                  )}
                </div>
              </div>
            )}
            {zoom && !isYouTube ? (
              <div className={`absolute bottom-0 left-0 right-0 px-4 pb-3 transition-opacity ${showControls ? '' : 'opacity-0 pointer-events-none'}`}>
                <div
                  ref={progressRef}
                  onMouseDown={(e)=>{ setSeeking(true); seekFromEvent(e); }}
                  onMouseUp={()=>setSeeking(false)}
                  onMouseMove={(e)=>{ updateHover(e); if(seeking) seekFromEvent(e); }}
                  onMouseLeave={()=>{ setHoverTime(null); setSeeking(false); }}
                  className="relative h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer"
                >
                  <div style={{ width: `${duration ? (current/duration)*100 : 0}%` }} className="h-1.5 bg-red-500 rounded-full"></div>
                  <div style={{ left: `${duration ? (current/duration)*100 : 0}%` }} className="absolute -top-1.5 h-4 w-4 rounded-full bg-red-500 translate-x-[-50%]"></div>
                  {hoverTime!==null && (
                    <div style={{ left: `${hoverX}px` }} className="absolute -top-8 px-2 py-1 rounded bg-slate-900 text-white text-xs translate-x-[-50%]">
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={()=>togglePlay()} className="w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                    {paused ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                    )}
                  </button>
                  <button onClick={()=>rewind(10)} className="w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 19l-9-7 9-7v14zm2-14v14l9-7-9-7z"/></svg>
                  </button>
                  <button onClick={()=>forward(10)} className="w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l9 7-9 7V5zm-2 14V5L2 12l9 7z"/></svg>
                  </button>
                  <button onClick={()=>toggleMute()} className="w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10v4h4l5 4V6l-5 4H3zm13.59 1.41L15 10.83 12.83 13l1.41 1.41L16.41 14.41 17.83 13l-1.41-1.59z"/></svg>
                  </button>
                  <span className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-white">{formatTime(current)} / {formatTime(duration)}</span>
                  <select value={speed} onChange={e=>setSpeed(parseFloat(e.target.value))} className="px-2 py-1 rounded-md text-sm bg-slate-900/80 text-white">
                    {speedOptions.map(s=> (<option key={s} value={s}>{s}x</option>))}
                  </select>
                  <div className="flex-1"></div>
                  <button onClick={()=>toggleFullscreen()} className="w-9 h-9 rounded-md bg-slate-900/80 text-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm12 5h-5v-2h3v-3h2v5zM7 5h3V3H5v5h2V5zm7-2v2h3v3h2V3h-5z"/></svg>
                  </button>
                  <button onClick={()=>setZoom(false)} className="w-9 h-9 rounded-md bg-slate-900/80 text-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h3v2H9v1H7V7zm10 0v3h-2V9h-1V7h3zM7 17h3v-2H9v-1H7v3zm10-3h-2v1h-1v2h3v-3z"/></svg>
                  </button>
                </div>
              </div>
            ) : null}
            {showModal && (
              <div className="absolute inset-0 z-[90] flex items-center justify-center">
                <div className="w-[90%] max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-700">
                  <h3 className="-mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{percent>=100 ? 'Hoàn thành bài học' : 'Hoàn thành nội dung'}</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce translate-y-1">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify_center gap-3">
                    <button onClick={()=>{ setShowModal(false); setSubView(null); if (activeIndex < sections.length - 1) setActiveIndex(i=>i+1); else onNext && onNext(); }} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold">Tiếp theo</button>
                    <button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">Đóng</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        
      </div>
    </div>
  );
};
