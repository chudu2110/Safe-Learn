// Định nghĩa kiểu dữ liệu cho một câu hỏi Quiz
export type QuizQuestion = {
  // q: Câu hỏi (question)
  q: string;
  // options: Các lựa chọn đáp án
  options: string[];
  // correct: Chỉ số của đáp án đúng (0, 1, hoặc 2)
  correct: number;
};

// Bộ dữ liệu chứa tất cả các câu hỏi quiz, được phân loại theo chủ đề
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  // Bài 1: Tuổi dậy thì bé gái mong muốn khám phá cơ thể
  day_thi_be_gai: [
    { q: 'Dấu hiệu thể chất đầu tiên của tuổi dậy thì ở bé gái thường là gì?', options: ['Vỡ giọng', 'Phát triển ngực (tuyến vú)', 'Mọc ria mép'], correct: 1 },
    { q: 'Chu kỳ kinh nguyệt đánh dấu điều gì?', options: ['Khả năng học tập bị giảm sút', 'Cơ thể đã trưởng thành về mặt sinh sản', 'Dấu hiệu cơ thể bị bệnh'], correct: 1 },
    { q: 'Khi bắt đầu dậy thì, ngực của bé gái có thể phát triển như thế nào?', options: ['Luôn phát triển đều đặn và cân đối', 'Có thể phát triển không đồng đều lúc ban đầu', 'Phát triển rất nhanh trong 1 tháng'], correct: 1 },
    { q: 'Trong kỳ kinh nguyệt, việc vệ sinh cá nhân quan trọng như thế nào?', options: ['Không cần thiết, vì là quá trình tự nhiên', 'Rất quan trọng để đảm bảo sạch sẽ và ngăn ngừa nhiễm trùng', 'Chỉ cần thay quần áo sạch'], correct: 1 },
    { q: 'Bộ phận nào của cơ thể bé gái nở rộng hơn khi dậy thì?', options: ['Vai', 'Hông và đùi', 'Cổ tay'], correct: 1 },
    { q: 'Hóc-môn chính chi phối sự phát triển của bé gái là gì?', options: ['Testosterone', 'Estrogen', 'Insulin'], correct: 1 },
    { q: 'Tuổi dậy thì ở bé gái thường bắt đầu trong khoảng nào?', options: ['Từ 16 đến 20 tuổi', 'Từ 8 đến 16 tuổi', 'Trước 5 tuổi'], correct: 1 },
    { q: 'Việc tò mò và khám phá cơ thể mình khi dậy thì là hành vi thế nào?', options: ['Là điều phải che giấu', 'Là hành vi hoàn toàn tự nhiên và lành mạnh', 'Là dấu hiệu của sự hư hỏng'], correct: 1 },
    { q: 'Da dầu và mụn trứng cá ở tuổi dậy thì là do đâu?', options: ['Ăn quá nhiều đồ ngọt', 'Thay đổi hóc-môn và tăng tiết bã nhờn', 'Không chịu tắm rửa'], correct: 1 },
    { q: 'Nếu bé gái có thắc mắc về cơ thể mình, nên tìm kiếm sự giúp đỡ từ ai?', options: ['Người lạ trên mạng xã hội', 'Bố mẹ hoặc người lớn tin cậy', 'Bạn cùng lớp'], correct: 1 }
  ],

  // Bài 2: Tuổi dậy thì bé trai mong muốn khám phá cơ thể
  day_thi_be_trai: [
    { q: 'Mộng tinh ở bé trai là gì?', options: ['Một căn bệnh nguy hiểm', 'Hiện tượng xuất tinh không chủ ý khi ngủ, hoàn toàn bình thường', 'Dấu hiệu cơ thể quá nóng'], correct: 1 },
    { q: 'Vỡ giọng ở bé trai là dấu hiệu của điều gì?', options: ['Sự thay đổi cơ quan hô hấp', 'Sự phát triển của dây thanh âm, khiến giọng nói trầm hơn', 'Ăn quá nhiều thức ăn cay'], correct: 1 },
    { q: 'Hóc-môn chính chi phối sự phát triển của bé trai là gì?', options: ['Estrogen', 'Testosterone', 'Thyroxine'], correct: 1 },
    { q: 'Bộ phận nào của bé trai bắt đầu lớn hơn khi dậy thì?', options: ['Mũi và tai', 'Tinh hoàn và dương vật', 'Ngón tay'], correct: 1 },
    { q: 'Bé trai có thể phát triển thêm đặc điểm gì ngoài lông mu và lông nách?', options: ['Lông mày rậm hơn', 'Ria mép và râu', 'Lông mi dài ra'], correct: 1 },
    { q: 'Khi dậy thì, cơ thể bé trai thường có sự thay đổi nào về vóc dáng?', options: ['Vai hẹp lại', 'Vai rộng ra và cơ bắp phát triển hơn', 'Lưng gù hơn'], correct: 1 },
    { q: 'Tuổi dậy thì ở bé trai thường bắt đầu trong khoảng nào?', options: ['Từ 15 đến 18 tuổi', 'Từ 9 đến 14 tuổi', 'Sau 20 tuổi'], correct: 1 },
    { q: 'Khi mộng tinh xảy ra, bé trai nên làm gì?', options: ['Cảm thấy xấu hổ và giữ bí mật', 'Hiểu rằng đó là bình thường và vệ sinh sạch sẽ', 'Ngừng uống nước trước khi ngủ'], correct: 1 },
    { q: 'Việc vệ sinh cơ quan sinh dục hàng ngày có mục đích gì?', options: ['Chỉ để làm đẹp', 'Giữ sạch sẽ, ngăn mùi hôi và nhiễm trùng', 'Chỉ để người khác nhìn thấy'], correct: 1 },
    { q: 'Tốc độ phát triển của các bé trai trong tuổi dậy thì là:', options: ['Giống hệt nhau', 'Khác nhau tùy từng người', 'Chỉ phụ thuộc vào chế độ ăn'], correct: 1 }
  ],

  // Bài 3: Hành vi quấy rối xâm hại
  quấy_rối_xâm_hại: [
    { q: 'Hành vi quấy rối là gì?', options: ['Một lời khen lịch sự', 'Hành vi không mong muốn, khiến người khác khó chịu, sợ hãi, bị đe dọa', 'Một cử chỉ thân mật'], correct: 1 },
    { q: 'Quy tắc Đồ Lót (The Underwear Rule) là quy tắc về việc gì?', options: ['Cách mặc đồ lót', 'Không ai được chạm vào vùng cơ thể được đồ lót che phủ một cách không phù hợp', 'Quy tắc về cách mua đồ lót'], correct: 1 },
    { q: 'Điều con nên làm đầu tiên nếu bị chạm vào không mong muốn là gì?', options: ['Mỉm cười và lịch sự từ chối', 'Nói "KHÔNG" dứt khoát, bỏ đi và kể lại', 'Giữ bí mật'], correct: 1 },
    { q: 'Hành vi xâm hại có thể xảy ra qua hình thức nào?', options: ['Chỉ là đụng chạm thể xác', 'Lời nói khiếm nhã, hình ảnh khiêu dâm, hoặc đụng chạm', 'Chỉ xảy ra ở nơi vắng người'], correct: 1 },
    { q: 'Khi bị quấy rối hoặc xâm hại, điều quan trọng nhất con cần làm là gì?', options: ['Im lặng và giải quyết một mình', 'Kể lại cho người lớn tin cậy ngay lập tức', 'Trả thù kẻ xâm hại'], correct: 1 },
    { q: 'Ai là người con có thể tin cậy để kể chuyện xâm hại?', options: ['Người lạ trên đường', 'Người thân, giáo viên, bác sĩ hoặc cán bộ xã hội', 'Bất cứ ai hứa cho con tiền'], correct: 1 },
    { q: 'Kẻ xâm hại có thể là ai?', options: ['Luôn là người lạ trông đáng sợ', 'Thường là người quen hoặc người thân tín', 'Chỉ là người lớn tuổi'], correct: 1 },
    { q: 'Tại sao kẻ xâm hại lại yêu cầu trẻ giữ bí mật?', options: ['Vì họ muốn bảo vệ trẻ', 'Vì bí mật giúp chúng tiếp tục hành vi xấu mà không bị phát hiện', 'Vì đó là một trò chơi'], correct: 1 },
    { q: 'Việc xem hình ảnh hoặc video khiêu dâm không mong muốn có được coi là quấy rối không?', options: ['Không', 'Có, đây là một hình thức quấy rối và xâm hại phi đụng chạm', 'Chỉ khi con nhìn thấy trên điện thoại'], correct: 1 },
    { q: 'Khi cảm thấy sợ hãi hoặc không thoải mái, con cần thực hiện quy tắc nào?', options: ['Quy tắc "Chấp nhận"', 'Quy tắc "KHÔNG – BỎ ĐI – KỂ VỚI NGƯỜI LỚN"', 'Quy tắc "Im lặng"'], correct: 1 }
  ],

  // Bài 4: Em bé được sinh ra thế nào
  em_be_sinh_ra: [
    { q: 'Em bé được hình thành khi yếu tố nào kết hợp với nhau?', options: ['Máu và nước', 'Tinh trùng (bố) và Trứng (mẹ)', 'Không khí và ánh sáng'], correct: 1 },
    { q: 'Sau khi tinh trùng và trứng kết hợp, chúng tạo thành gì?', options: ['Phôi thai', 'Hợp tử', 'Túi nước'], correct: 1 },
    { q: 'Hợp tử sẽ di chuyển đến đâu để phát triển thành thai nhi?', options: ['Dạ dày', 'Tử cung', 'Buồng trứng'], correct: 1 },
    { q: 'Thai nhi nhận dinh dưỡng và oxy từ người mẹ qua đâu?', options: ['Da', 'Dây rốn nối với nhau thai', 'Miệng'], correct: 1 },
    { q: 'Thời gian em bé phát triển trong tử cung của người mẹ là khoảng bao lâu?', options: ['3 tháng', '9 tháng 10 ngày', '1 năm'], correct: 1 },
    { q: 'Cách sinh em bé qua đường âm đạo được gọi là gì?', options: ['Sinh mổ', 'Sinh thường', 'Sinh non'], correct: 1 },
    { q: 'Sinh mổ là gì?', options: ['Em bé được sinh ra qua âm đạo', 'Em bé được lấy ra qua vết mổ ở bụng và tử cung của mẹ', 'Em bé được sinh ra dưới nước'], correct: 1 },
    { q: 'Trứng được sản xuất bởi bộ phận nào của người nữ?', options: ['Tử cung', 'Âm đạo', 'Buồng trứng'], correct: 2 },
    { q: 'Tinh trùng được sản xuất bởi bộ phận nào của người nam?', options: ['Dương vật', 'Tinh hoàn', 'Bàng quang'], correct: 1 },
    { q: 'Em bé trong bụng mẹ được bảo vệ bởi chất lỏng và túi chứa nào?', options: ['Túi máu', 'Nước ối và túi ối', 'Nước bọt'], correct: 1 }
  ],

  // Bài 5: Bị xâm hại trong gia đình
  xam_hai_gia_dinh: [
    { q: 'Thực tế cho thấy, hầu hết các trường hợp xâm hại trẻ em đều do ai thực hiện?', options: ['Luôn là người lạ hoàn toàn', 'Người quen, người thân tín hoặc thành viên trong gia đình', 'Chỉ là bạn bè của trẻ'], correct: 1 },
    { q: 'Kẻ xâm hại trong gia đình thường lợi dụng điều gì để thực hiện hành vi?', options: ['Sự giàu có của gia đình', 'Lòng tin, quyền lực và sự đe dọa giữ bí mật', 'Tài năng của trẻ'], correct: 1 },
    { q: 'Khi bị người thân xâm hại, trách nhiệm thuộc về ai?', options: ['Hoàn toàn thuộc về nạn nhân', 'Thuộc về kẻ xâm hại', 'Thuộc về những người xung quanh không phát hiện ra'], correct: 1 },
    { q: 'Việc "giữ bí mật" theo yêu cầu của kẻ xâm hại có phải là điều tốt không?', options: ['Tốt, vì giữ được hòa khí gia đình', 'Rất nguy hiểm, vì nó cho phép kẻ xâm hại tiếp tục hành vi', 'Không quan trọng'], correct: 1 },
    { q: 'Nếu bố mẹ là kẻ xâm hại, nạn nhân nên kể với ai?', options: ['Im lặng', 'Người lạ', 'Một người lớn tin cậy khác (giáo viên, họ hàng, cảnh sát)', ''], correct: 2 },
    { q: 'Nạn nhân bị xâm hại trong gia đình có nên tự trách mình không?', options: ['Nên, vì nạn nhân đã làm sai điều gì đó', 'Không, đó hoàn toàn không phải lỗi của nạn nhân', 'Chỉ nên tự trách khi không chống cự'], correct: 1 },
    { q: 'Cách kẻ xâm hại tạo lòng tin với trẻ là gì?', options: ['Thường xuyên giúp trẻ làm bài tập', 'Cho trẻ quà cáp, nói lời yêu thương giả dối, hứa hẹn', 'Luôn luôn nghiêm khắc với trẻ'], correct: 1 },
    { q: 'Ý nghĩa của việc tìm đến Đường dây nóng hỗ trợ trẻ em là gì?', options: ['Để nhận được đồ chơi miễn phí', 'Nhận được sự hỗ trợ tâm lý và pháp lý một cách an toàn', 'Để hỏi về bài tập về nhà'], correct: 1 },
    { q: 'Việc xâm hại trong gia đình có thể bị coi là "trò chơi" hay "tình yêu đặc biệt" không?', options: ['Có, nếu người thân nói vậy', 'Không, bất kỳ hành vi xâm hại nào cũng là sai trái và không phải tình yêu', 'Chỉ khi nó không gây đau đớn'], correct: 1 },
    { q: 'Nếu bị đe dọa không được nói ra, nạn nhân nên làm gì?', options: ['Nghe lời và giữ bí mật', 'Bỏ qua lời đe dọa và nói ra ngay khi an toàn', 'Chỉ nói ra khi đã chuyển nhà'], correct: 1 }
  ],

  // Bài 6: Bản dạng Giới và Sự Đa dạng Giới
  ban_dang_gioi: [
    { q: 'Bản dạng Giới là gì?', options: ['Giới tính được nhìn thấy khi sinh', 'Cảm nhận nội tại của một người về bản thân mình là nam, nữ hay khác', 'Vai trò xã hội của một người'], correct: 1 },
    { q: 'Giới tính sinh học (Sex) được xác định dựa trên cơ sở nào?', options: ['Trang phục mặc hàng ngày', 'Cơ quan sinh dục, nhiễm sắc thể và hóc-môn khi sinh', 'Sở thích'], correct: 1 },
    { q: 'Người hợp giới (Cisgender) là gì?', options: ['Người có bản dạng giới khác với giới tính sinh học', 'Người có bản dạng giới phù hợp với giới tính sinh học khi sinh', 'Người không có bản dạng giới'], correct: 1 },
    { q: 'Người chuyển giới (Transgender) là gì?', options: ['Người có bản dạng giới khác với giới tính sinh học khi sinh', 'Người thay đổi giới tính sinh học', 'Người không có xu hướng tình dục'], correct: 0 },
    { q: 'Bản dạng giới có độc lập với giới tính sinh học không?', options: ['Không, chúng luôn phải giống nhau', 'Có, một người nữ sinh học vẫn có thể có bản dạng giới nam', 'Chỉ ở người lớn'], correct: 1 },
    { q: 'Thế nào là Phi nhị nguyên giới (Non-binary)?', options: ['Người cảm thấy mình là cả nam và nữ cùng lúc', 'Người không cảm nhận mình hoàn toàn thuộc về nhị nguyên nam hoặc nữ', 'Người không thể quyết định'], correct: 1 },
    { q: 'Bản dạng giới của một người có thể bị thay đổi bởi người khác không?', options: ['Có, nếu bị ép buộc', 'Không, đó là cảm nhận nội tại và cố định', 'Chỉ khi uống thuốc'], correct: 1 },
    { q: 'Điều cơ bản nhất để tôn trọng Bản dạng Giới của một người là gì?', options: ['Chỉ nói chuyện khi cần', 'Tôn trọng tên gọi và đại từ nhân xưng họ sử dụng', 'Mặc quần áo giống họ'], correct: 1 },
    { q: 'Bản dạng Giới có phải là một bệnh lý cần "chữa trị" không?', options: ['Có, theo định nghĩa cũ', 'Không, sự đa dạng giới là một phần tự nhiên của con người', 'Chỉ khi họ cảm thấy khó chịu'], correct: 1 },
    { q: 'Bản dạng Giới là một phần của con người được hình thành khi nào?', options: ['Khi trưởng thành', 'Sớm, ngay từ khi còn nhỏ', 'Khi đi học đại học'], correct: 1 }
  ],

  // Bài 7: Dị tính (và các xu hướng tình dục khác)
  xu_huong_tinh_duc: [
    { q: 'Xu hướng Tình dục (Sexual Orientation) là gì?', options: ['Tính cách của một người', 'Sự hấp dẫn bền vững về tình cảm, lãng mạn hoặc tình dục đối với người khác', 'Màu sắc yêu thích'], correct: 1 },
    { q: 'Xu hướng Tình dục có phải là một sự lựa chọn không?', options: ['Có, người ta có thể chọn bất cứ lúc nào', 'Không, đó là một phần tự nhiên, không thể thay đổi', 'Chỉ thay đổi khi bị ép buộc'], correct: 1 },
    { q: 'Người Dị tính (Heterosexual) bị hấp dẫn bởi ai?', options: ['Người cùng giới tính', 'Người khác giới tính', 'Không bị hấp dẫn bởi ai cả'], correct: 1 },
    { q: 'Người Đồng tính (Homosexual) bị hấp dẫn bởi ai?', options: ['Người khác giới tính', 'Người cùng giới tính', 'Chỉ người lớn tuổi'], correct: 1 },
    { q: 'Người Song tính (Bisexual) bị hấp dẫn bởi ai?', options: ['Chỉ người đã kết hôn', 'Cả hai giới tính nam và nữ', 'Chỉ người lạ'], correct: 1 },
    { q: 'Người Vô tính (Asexual) là gì?', options: ['Người ghét tất cả mọi người', 'Người không hoặc ít có sự hấp dẫn tình dục đối với bất kỳ giới nào', 'Người không bao giờ ra khỏi nhà'], correct: 1 },
    { q: 'Việc chế giễu hoặc kỳ thị Xu hướng Tình dục của người khác là hành vi thế nào?', options: ['Được chấp nhận trong một số trường hợp', 'Hoàn toàn sai trái và không thể chấp nhận được', 'Chỉ là một trò đùa vô hại'], correct: 1 },
    { q: 'Xu hướng Tình dục của một người có liên quan đến Bản dạng Giới của họ không?', options: ['Có, chúng là một', 'Không, chúng là hai khái niệm độc lập', 'Chỉ khi họ là người đồng tính'], correct: 1 },
    { q: 'Nguyên tắc cốt lõi khi tìm hiểu về sự đa dạng là gì?', options: ['Cố gắng thuyết phục họ thay đổi', 'Tôn trọng và chấp nhận sự khác biệt', 'Lờ đi họ'], correct: 1 },
    { q: 'Tình yêu có phải chỉ dành cho người Dị tính không?', options: ['Đúng, theo luật', 'Sai, tình yêu tồn tại ở mọi xu hướng tình dục', 'Chỉ khi có tiền'], correct: 1 }
  ],
  ton_trong: [
   { q: 'Ngủ chung giường (Co-sleeping) với trẻ sơ sinh tiềm ẩn nguy cơ lớn nhất nào?', options: ['Trẻ ngủ không ngon giấc', 'Hội chứng đột tử ở trẻ sơ sinh (SIDS) và nguy cơ ngạt thở', 'Trẻ bị lạnh'], correct: 1 },
    { q: 'Học viện Nhi khoa Hoa Kỳ (AAP) khuyến nghị gì cho trẻ sơ sinh?', options: ['Ngủ chung giường với bố mẹ', 'Ngủ trong cũi riêng, đặt cùng phòng với bố mẹ (Room-sharing)', 'Ngủ một mình trong phòng riêng'], correct: 1 },
    { q: 'Ưu điểm chính của việc ngủ chung đối với bố mẹ cho con bú là gì?', options: ['Tiết kiệm chi phí mua cũi', 'Thuận tiện hơn cho việc cho con bú đêm và gắn kết tình cảm', 'Giúp bố mẹ ngủ sâu hơn'], correct: 1 },
    { q: 'Với trẻ đã lớn (mẫu giáo, tiểu học), việc ngủ chung giường có thể ảnh hưởng đến:', options: ['Thành tích học tập', 'Tính độc lập và ý thức về ranh giới cá nhân', 'Sự phát triển chiều cao'], correct: 1 },
    { q: 'Việc ngủ riêng từ độ tuổi thích hợp giúp trẻ xây dựng điều gì?', options: ['Khả năng nấu ăn', 'Ý thức về không gian riêng tư và ranh giới cơ thể', 'Thói quen dậy sớm'], correct: 1 },
    { q: 'Bố mẹ nên tránh những điều gì khi ngủ chung giường với trẻ sơ sinh?', options: ['Dùng chăn gối mềm, bố mẹ uống rượu bia, hoặc hút thuốc', 'Mở đèn khi ngủ', 'Đọc truyện trước khi ngủ'], correct: 0 },
    { q: 'Việc ngủ riêng (trong phòng riêng) nên được bắt đầu khi nào?', options: ['Ngay sau khi sinh', 'Khi trẻ đã lớn hơn (tùy thuộc vào văn hóa và quyết định gia đình), nhưng nên khuyến khích khi trẻ đã qua giai đoạn sơ sinh', 'Sau 18 tuổi'], correct: 1 },
    { q: 'Ngủ chung giường với con đang tuổi dậy thì có thể gây ra vấn đề gì?', options: ['Thiếu không gian', 'Gây nhầm lẫn về ranh giới cơ thể và sự riêng tư', 'Bị cảm lạnh'], correct: 1 },
    { q: 'Mục tiêu chính của việc sắp xếp chỗ ngủ cho trẻ là gì?', options: ['Tiết kiệm không gian', 'Ưu tiên sự an toàn, sau đó là sự phát triển tâm lý độc lập', 'Theo ý thích của bố mẹ'], correct: 1 },
    { q: 'Lời khuyên "Room-sharing" (Ngủ cùng phòng) khác gì với "Co-sleeping" (Ngủ chung giường)?', options: ['Chúng hoàn toàn giống nhau', 'Room-sharing là ngủ cùng phòng nhưng cũi riêng, Co-sleeping là ngủ chung giường', 'Room-sharing là ngủ trong phòng riêng của trẻ'], correct: 1 }
  ],
};

export const QUIZ_THCS_MAP: Record<number, string> = {
  1: 'day_thi_be_gai',
  2: 'day_thi_be_trai',
  3: 'quấy_rối_xâm_hại',
  4: 'em_be_sinh_ra',
  5: 'xam_hai_gia_dinh',
  6: 'ban_dang_gioi',
  7: 'xu_huong_tinh_duc',
  8: 'ton_trong',
};

export const getThcsQuizByLesson = (lessonId: number): QuizQuestion[] => {
  const key = QUIZ_THCS_MAP[lessonId];
  return QUIZ_QUESTIONS[key] || QUIZ_QUESTIONS['day_thi_be_gai'];
};
export * from './thpt';
