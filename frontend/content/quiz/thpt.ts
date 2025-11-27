import type { QuizQuestion } from './index';

export const QUIZ_THPT_QUESTIONS: Record<string, QuizQuestion[]> = {
  thpt_bai1: [
    { q: 'Công bằng giới nghĩa là gì?', options: ['Mọi người giống hệt nhau', 'Tôn trọng và tạo cơ hội công bằng cho mọi giới', 'Chỉ ưu tiên một giới'], correct: 1 },
    { q: 'Ví dụ về bất công giới?', options: ['Phân công việc theo năng lực', 'Định kiến nghề nghiệp theo giới', 'Đánh giá năng lực cá nhân'], correct: 1 },
    { q: 'Cách thúc đẩy công bằng?', options: ['Kỳ thị', 'Lắng nghe và tôn trọng', 'Phớt lờ khác biệt'], correct: 1 }
  ],
  thpt_bai2: [
    { q: 'Động chạm không an toàn là gì?', options: ['Chạm khi có đồng thuận', 'Chạm vào vùng riêng tư khi không có sự đồng ý', 'Bắt tay thân thiện'], correct: 1 },
    { q: 'Quy tắc xử lý khi bị chạm không mong muốn?', options: ['Im lặng', 'Nói không, bỏ đi, kể với người lớn tin cậy', 'Giữ bí mật'], correct: 1 },
    { q: 'Vùng riêng tư thường được mô tả là?', options: ['Khuỷu tay', 'Khu vực được đồ lót che phủ', 'Bàn tay'], correct: 1 }
  ],
  thpt_bai3: [
    { q: 'Bao quy đầu có vai trò gì?', options: ['Trang trí', 'Bảo vệ quy đầu và giảm ma sát', 'Không có chức năng'], correct: 1 },
    { q: 'Vệ sinh bao quy đầu nên như thế nào?', options: ['Không cần', 'Rửa sạch nhẹ nhàng hằng ngày', 'Chỉ khi bị đau'], correct: 1 },
    { q: 'Cắt bao quy đầu là?', options: ['Luôn bắt buộc', 'Thủ thuật y khoa có chỉ định', 'Tự thực hiện'], correct: 1 }
  ],
  thpt_bai4: [
    { q: 'Mang thai tuổi vị thành niên rủi ro gì?', options: ['Không có', 'Nguy cơ sức khỏe và xã hội cao', 'Chỉ ảnh hưởng học tập'], correct: 1 },
    { q: 'Phòng ngừa mang thai ngoài ý muốn?', options: ['Không cần kiến thức', 'Giáo dục, tránh thai, đồng thuận', 'Giấu thông tin'], correct: 1 },
    { q: 'Hỗ trợ phù hợp là?', options: ['Kỳ thị', 'Tư vấn y tế và tâm lý', 'Phớt lờ'], correct: 1 }
  ],
  thpt_bai5: [
    { q: 'Ví dụ xâm hại trên mạng?', options: ['Chia sẻ kiến thức', 'Gửi hình ảnh nhạy cảm trái ý', 'Khen ngợi lịch sự'], correct: 1 },
    { q: 'Bảo vệ an toàn số?', options: ['Mật khẩu yếu', 'Cài đặt riêng tư, không chia sẻ dữ liệu nhạy cảm', 'Chia sẻ công khai'], correct: 1 },
    { q: 'Xử lý khi bị quấy rối online?', options: ['Im lặng', 'Chặn, báo cáo, lưu bằng chứng', 'Tranh cãi công khai'], correct: 1 }
  ],
  thpt_bai6: [
    { q: 'Thay đồ nơi công cộng an toàn là?', options: ['Ở nơi mở', 'Chọn phòng thay kín đáo', 'Bất kỳ đâu'], correct: 1 },
    { q: 'Tôn trọng riêng tư nghĩa là?', options: ['Quay phim lén', 'Không nhìn trộm, không chụp ảnh', 'Bình luận cơ thể'], correct: 1 },
    { q: 'Xử lý khi bị quay lén?', options: ['Bỏ qua', 'Báo bảo vệ/cơ quan chức năng', 'Chia sẻ lại'], correct: 1 }
  ],
  thpt_bai7: [
    { q: 'Xâm hại ở trường học có thể là?', options: ['Chỉ đánh nhau', 'Lời nói, hình ảnh, đụng chạm trái ý', 'Không xảy ra'], correct: 1 },
    { q: 'Vai trò nhà trường?', options: ['Không liên quan', 'Xây chính sách, kênh báo cáo, hỗ trợ', 'Chỉ kỷ luật'], correct: 1 },
    { q: 'Học sinh nên làm gì?', options: ['Giữ bí mật', 'Kể với người tin cậy, báo cáo', 'Trả đũa'], correct: 1 }
  ],
  thpt_bai8: [
    { q: 'Huy hiệu “Phòng Tránh Xâm Hại” ghi nhận điều gì?', options: ['Thành tích thể thao', 'Kiến thức và kỹ năng an toàn', 'Số lượng bạn bè'], correct: 1 },
    { q: 'Để đạt huy hiệu cần?', options: ['Không học', 'Hoàn thành học tập, thực hành kỹ năng', 'Giấu thông tin'], correct: 1 },
    { q: 'Kỹ năng cốt lõi?', options: ['Giữ bí mật', 'Nhận diện nguy cơ, nói không, tìm hỗ trợ', 'Bắt chước người khác'], correct: 1 }
  ]
};

export const QUIZ_THPT_MAP: Record<number, string> = {
  1: 'thpt_bai1',
  2: 'thpt_bai2',
  3: 'thpt_bai3',
  4: 'thpt_bai4',
  5: 'thpt_bai5',
  6: 'thpt_bai6',
  7: 'thpt_bai7',
  8: 'thpt_bai8'
};

export const getThptQuizByLesson = (lessonId: number): QuizQuestion[] => {
  const key = QUIZ_THPT_MAP[lessonId];
  return QUIZ_THPT_QUESTIONS[key] || QUIZ_THPT_QUESTIONS['thpt_bai1'];
};

