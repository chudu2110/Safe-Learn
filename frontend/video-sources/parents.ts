export const getParentSections = (lessonId: number, title: string) => {
  return [
    { id: `s1-${lessonId}`, title: 'Giới thiệu chủ đề', kind: 'video', durationLabel: '3 phút', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: `s2-${lessonId}`, title: 'Gợi ý trao đổi với con', kind: 'reading', durationLabel: '7 phút' },
    { id: `s3-${lessonId}`, title: 'Tình huống thực tế', kind: 'video', durationLabel: '4 phút', src: 'https://www.w3schools.com/html/movie.mp4' },
    { id: `s4-${lessonId}`, title: 'Checklist phụ huynh', kind: 'quiz', durationLabel: '5 phút' },
  ] as const;
};

