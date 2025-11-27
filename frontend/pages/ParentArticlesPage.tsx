import React, { useEffect, useMemo, useState } from 'react';

type ArticleItem = {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  contentHtml?: string;
  url?: string;
};

const fetchArticles = async (): Promise<ArticleItem[]> => {
  const base = (import.meta.env.VITE_PARENT_ARTICLES_API ?? '').toString().trim();
  const url = base ? `${base.replace(/\/$/, '')}/articles?topic=sex-talk-with-kids` : '';
  try {
    if (!url) throw new Error('Missing API');
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items: ArticleItem[] = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
    return items.map((it, idx) => ({
      id: String(it.id ?? idx + 1),
      title: String(it.title ?? `Bài ${idx + 1}`),
      summary: it.summary ?? '',
      content: it.content ?? '',
      contentHtml: it.contentHtml ?? undefined,
      url: it.url ?? it.link ?? undefined,
    }));
  } catch {
    return [
      
      
      { id: 'p1-a5', title: 'Trò chuyện với con về 5 chủ đề trước khi ngủ', summary: '5 chủ đề gợi ý trao đổi trước giờ ngủ để gắn kết.', url: 'https://cafef.vn/tro-chuyen-voi-con-ve-5-chu-de-nay-truoc-khi-ngu-con-se-ngay-cang-yeu-thuong-me-nhieu-hon-188240828112355341.chn' },
      { id: 'p1-a6', title: 'Cách nói chuyện với con cởi mở và những điều cần nên tránh', summary: 'Lợi ích giao tiếp và các nguyên tắc cha mẹ cần ghi nhớ.', url: 'https://nhathuoclongchau.com.vn/bai-viet/cach-noi-chuyen-voi-con-tro-chuyen-coi-mo-va-nhung-dieu-can-tranh.html' },
      { id: 'p1-a7', title: 'Mách cha mẹ cách nói chuyện với con tuổi dậy thì', summary: 'Chủ đề phù hợp, bình đẳng trong đối thoại, hỏi ý kiến thay vì ra lệnh.', url: 'https://nhathuoclongchau.com.vn/bai-viet/mach-cha-me-cach-noi-chuyen-voi-con-tuoi-day-thi.html' },
      
      { id: 'p1-a10', title: 'Cách để phụ huynh nói chuyện về sức khỏe tâm lý với trẻ', summary: 'Chăm sóc, nói chuyện thường xuyên và hành động sớm để hỗ trợ trẻ.', url: 'https://nhathuoclongchau.com.vn/bai-viet/cach-de-phu-huynh-noi-chuyen-ve-suc-khoe-tam-ly-voi-tre-54855.html' },
      { id: 'p1-a11', title: 'Hướng dẫn cho các bậc cha mẹ: Trò chuyện cùng con', summary: 'Gợi ý giao tiếp theo từng độ tuổi, giảm sợ hãi khi điều trị.', url: 'https://nhathuoclongchau.com.vn/bai-viet/huong-dan-cho-cac-bac-cha-me-tro-chuyen-cung-con-58932.html' },
      { id: 'p1-a12', title: 'Phát triển kỹ năng giao tiếp tự tin ở trẻ', summary: 'Cha mẹ làm hình mẫu, khuyến khích con nói lên chính kiến và tham gia hoạt động.', url: 'https://nhathuoclongchau.com.vn/bai-viet/phat-trien-ky-nang-giao-tiep-tu-tin-o-tre-hanh-trang-cho-tuong-lai-46675.html' },
    ];
  }
};

export const ParentArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const active = useMemo(() => articles.find(a => a.id === activeId) ?? articles[0], [articles, activeId]);

  useEffect(() => {
    let mounted = true;
    fetchArticles().then(items => {
      if (!mounted) return;
      setArticles(items);
      if (items.length > 0) setActiveId(items[0].id);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <aside className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] p-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nói chuyện về giới tính với con</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">Các kịch bản hội thoại nhẹ nhàng, hiệu quả</p>
        <div className="divide-y divide-slate-200 dark:divide-slate-700 -mx-4">
          {articles.length === 0 && (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Đang tải mục lục…</div>
          )}
          {articles.map(it => (
            <button
              key={it.id}
              onClick={() => setActiveId(it.id)}
              className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${active?.id === it.id ? 'bg-slate-100 dark:bg-slate-700/60' : ''}`}
            >
              <div className="font-semibold text-slate-900 dark:text-white">{it.title}</div>
              {it.summary && <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">{it.summary}</div>}
            </button>
          ))}
        </div>
      </aside>

      <section className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] p-6">
        {active ? (
          active.url ? (
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{active.title}</h1>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe src={active.url} title={active.title} className="w-full h-[72vh]" />
              </div>
            </div>
          ) : (
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{active.title}</h1>
              {active.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: active.contentHtml }} />
              ) : (
                <div className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {String(active.content ?? '')
                    .split(/\n\n+/)
                    .map((para, idx) => (
                      <p key={idx} className="mb-4">{para}</p>
                    ))}
                </div>
              )}
            </article>
          )
        ) : (
          <div className="text-slate-500 dark:text-slate-400">Chọn bài báo ở khung bên trái để bắt đầu đọc.</div>
        )}
      </section>
    </div>
  );
};
