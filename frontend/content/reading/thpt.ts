import { RB, RA, RT } from './index';

export const THPT_READING_TOPICS: RT[] = [
  new RT('thpt-bai1','THPT • Bài 1 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai2','THPT • Bài 2 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai3','THPT • Bài 3 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai4','THPT • Bài 4 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai5','THPT • Bài 5 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai6','THPT • Bài 6 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai7','THPT • Bài 7 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ]),
  new RT('thpt-bai8','THPT • Bài 8 • Kiến thức nền tảng',[ new RB('Bài đọc','Nội dung sẽ được cập nhật.') ],[ new RA('Gợi ý','Bổ sung mục tiêu bài học và tài liệu.') ])
];

export const getThptReadingTopicByLesson = (lessonId: number) => {
  const id = `thpt-bai${lessonId}`;
  return THPT_READING_TOPICS.find(t => t.id === id) || THPT_READING_TOPICS[0];
};

