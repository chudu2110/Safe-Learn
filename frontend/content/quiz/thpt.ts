// Định nghĩa kiểu dữ liệu cho một câu hỏi Quiz
export type QuizQuestion = {
  // q: Câu hỏi (question)
  q: string;
  // options: Các lựa chọn đáp án
  options: string[];
  // correct: Chỉ số của đáp án đúng (0, 1, hoặc 2)
  correct: number;
};

// Bộ dữ liệu chứa tất cả các câu hỏi quiz cho cấp THPT
export const QUIZ_THPT_QUESTIONS: Record<string, QuizQuestion[]> = {
  // Bài 1 (Bài 9 cũ): Con trai con gái và sự công bằng
  thpt_bai1: [
    { q: 'Công bằng giới nghĩa là gì?', options: ['Mọi người giống hệt nhau', 'Tôn trọng và tạo cơ hội công bằng cho mọi giới', 'Chỉ ưu tiên một giới'], correct: 1 },
    { q: 'Ví dụ về bất công giới phổ biến?', options: ['Phân công việc theo năng lực', 'Định kiến nghề nghiệp theo giới (VD: con gái phải làm y tá)', 'Đánh giá năng lực cá nhân'], correct: 1 },
    { q: 'Cách thúc đẩy công bằng trong giao tiếp?', options: ['Kỳ thị', 'Lắng nghe và tôn trọng lựa chọn của người khác', 'Phớt lờ khác biệt'], correct: 1 },
    { q: 'Định kiến giới là gì?', options: ['Sự thật không thể chối cãi về giới tính', 'Các suy nghĩ rập khuôn cứng nhắc về vai trò giới', 'Ý kiến cá nhân không ảnh hưởng đến ai'], correct: 1 },
    { q: 'Ai cần học kỹ năng nấu ăn và dọn dẹp nhà cửa?', options: ['Chỉ con gái', 'Chỉ con trai', 'Cả con trai và con gái'], correct: 2 },
    { q: 'Định kiến giới có ảnh hưởng xấu đến trẻ không?', options: ['Không, nó giúp trẻ biết giới hạn', 'Có, nó giới hạn tiềm năng và sở thích của trẻ', 'Chỉ ảnh hưởng đến con gái'], correct: 1 },
    { q: 'Thúc đẩy công bằng giới bắt đầu từ đâu?', options: ['Chính phủ ban hành luật', 'Trong gia đình và trường học, qua cách dạy dỗ và đối xử', 'Trên các phương tiện truyền thông'], correct: 1 },
    { q: 'Con trai có nên khóc khi buồn không?', options: ['Không, con trai phải mạnh mẽ', 'Có, thể hiện cảm xúc là bình thường với tất cả mọi người', 'Chỉ nên khóc khi không có ai nhìn thấy'], correct: 1 },
    { q: 'Công bằng giới có nghĩa là loại bỏ sự khác biệt giữa nam và nữ không?', options: ['Có', 'Không, công bằng là tôn trọng sự khác biệt nhưng đảm bảo bình đẳng cơ hội', 'Chỉ loại bỏ những khác biệt không cần thiết'], correct: 1 },
    { q: 'Việc tôn trọng sở thích của trẻ, bất kể giới tính, giúp trẻ phát triển như thế nào?', options: ['Trẻ dễ bị bắt nạt', 'Trẻ tự tin, phát triển toàn diện và hạnh phúc hơn', 'Trẻ trở nên khó bảo'], correct: 1 }
  ],

  // Bài 2 (Bài 10 cũ): Động chạm không an toàn
  thpt_bai2: [
    { q: 'Động chạm không an toàn là gì?', options: ['Chạm khi có đồng thuận', 'Bất kỳ hành vi đụng chạm nào vào vùng riêng tư khi không có sự đồng ý', 'Bắt tay thân thiện'], correct: 1 },
    { q: 'Quy tắc xử lý khi bị chạm không mong muốn?', options: ['Im lặng', 'Nói không, bỏ đi, kể với người lớn tin cậy', 'Giữ bí mật'], correct: 1 },
    { q: 'Vùng riêng tư thường được mô tả là?', options: ['Khuỷu tay', 'Khu vực được đồ lót che phủ', 'Bàn tay'], correct: 1 },
    { q: 'Thế nào là động chạm an toàn?', options: ['Đụng chạm khiến con cảm thấy sợ hãi', 'Đụng chạm thể hiện sự yêu thương, chăm sóc và khiến con cảm thấy vui vẻ', 'Đụng chạm chỉ xảy ra với người lạ'], correct: 1 },
    { q: 'Ai có quyền chạm vào Vùng Đồ Lót của con?', options: ['Bất kỳ người lớn nào con quen', 'Chỉ người lớn tin cậy giúp vệ sinh, hoặc bác sĩ có mặt bố mẹ khi khám bệnh', 'Bạn thân của con'], correct: 1 },
    { q: 'Nếu con không thích cái ôm của một người thân, con nên làm gì?', options: ['Vẫn phải ôm để người đó không buồn', 'Từ chối lịch sự và giải thích rằng con không thoải mái', 'Chịu đựng và khóc thầm'], correct: 1 },
    { q: 'Quyền tự quyết đối với cơ thể của con nghĩa là gì?', options: ['Con có thể làm bất cứ điều gì con muốn', 'Con có quyền quyết định ai được và không được chạm vào cơ thể mình', 'Chỉ người lớn có quyền quyết định'], correct: 1 },
    { q: 'Điều gì KHÔNG phải là động chạm an toàn?', options: ['Hôn vào má', 'Vỗ vai', 'Ôm ghì lấy khi con đã nói "dừng lại"'], correct: 2 },
    { q: 'Tại sao con phải kể lại ngay khi bị động chạm không an toàn?', options: ['Để người đó bị phạt ngay lập tức', 'Để ngăn chặn hành vi xâm hại tiếp diễn và con nhận được sự bảo vệ', 'Để người đó xin lỗi'], correct: 1 },
    { q: 'Hậu quả tâm lý của động chạm không an toàn là gì?', options: ['Sống vui vẻ, hạnh phúc', 'Sợ hãi, lo lắng, xấu hổ, mất lòng tin', 'Trở nên mạnh mẽ hơn'], correct: 1 }
  ],

  // Bài 3 (Bài 11 cũ): Con trai và bao quy đầu
  thpt_bai3: [
    { q: 'Bao quy đầu có vai trò gì?', options: ['Trang trí', 'Bảo vệ quy đầu và giảm ma sát', 'Không có chức năng'], correct: 1 },
    { q: 'Vệ sinh bao quy đầu nên như thế nào?', options: ['Không cần', 'Rửa sạch nhẹ nhàng hằng ngày, đặc biệt sau khi lột', 'Chỉ khi bị đau'], correct: 1 },
    { q: 'Cắt bao quy đầu là?', options: ['Luôn bắt buộc', 'Thủ thuật y khoa có chỉ định (chủ yếu khi hẹp gây viêm nhiễm)', 'Tự thực hiện'], correct: 1 },
    { q: 'Hẹp bao quy đầu sinh lý ở trẻ nhỏ là bình thường hay bất thường?', options: ['Bất thường, cần phẫu thuật ngay', 'Bình thường và thường tự lột khi trẻ lớn lên', 'Chỉ xảy ra ở trẻ sơ sinh'], correct: 1 },
    { q: 'Tại sao việc vệ sinh bao quy đầu lại quan trọng?', options: ['Để trông đẹp hơn', 'Để tránh tích tụ bựa sinh dục, vi khuẩn và ngăn ngừa viêm nhiễm', 'Chỉ cần rửa bằng nước lã'], correct: 1 },
    { q: 'Nếu bao quy đầu không tự lột được khi đã lớn và gây khó khăn, cần làm gì?', options: ['Tự cố gắng lột xuống bằng mọi cách', 'Tham khảo ý kiến bác sĩ hoặc bố mẹ', 'Không cần làm gì cả'], correct: 1 },
    { q: 'Bựa sinh dục (Smegma) là gì?', options: ['Chất lỏng màu xanh', 'Chất tiết màu trắng tích tụ dưới bao quy đầu, cần được vệ sinh sạch sẽ', 'Một loại hóc-môn'], correct: 1 },
    { q: 'Phẫu thuật cắt bao quy đầu thường được thực hiện khi nào?', options: ['Bắt buộc phải cắt khi mới sinh', 'Chỉ khi hẹp bao quy đầu gây viêm nhiễm, đau đớn hoặc khó khăn khi tiểu tiện', 'Chỉ khi trẻ yêu cầu'], correct: 1 },
    { q: 'Đa số các bé trai sẽ tự lột bao quy đầu hoàn toàn khi nào?', options: ['Lúc 1 tuổi', 'Trước hoặc trong độ tuổi dậy thì', 'Sau 25 tuổi'], correct: 1 },
    { q: 'Nếu trẻ thấy đau hoặc sưng tấy ở bao quy đầu, cần làm gì?', options: ['Chịu đựng và không nói với ai', 'Báo ngay cho bố mẹ hoặc người lớn tin cậy', 'Tự mua thuốc về bôi'], correct: 1 }
  ],

  // Bài 4 (Bài 12 cũ): Trẻ vị thành niên mang thai
  thpt_bai4: [
    { q: 'Mang thai tuổi vị thành niên rủi ro gì?', options: ['Không có', 'Nguy cơ sức khỏe, tâm lý và xã hội cao', 'Chỉ ảnh hưởng học tập'], correct: 1 },
    { q: 'Phòng ngừa mang thai ngoài ý muốn?', options: ['Không cần kiến thức', 'Giáo dục giới tính, tránh thai an toàn, đồng thuận có trách nhiệm', 'Giấu thông tin'], correct: 1 },
    { q: 'Hỗ trợ phù hợp cho vị thành niên mang thai là?', options: ['Kỳ thị và xa lánh', 'Tư vấn y tế, tâm lý và hỗ trợ giáo dục/nghề nghiệp', 'Phớt lờ'], correct: 1 },
    { q: 'Mang thai ở tuổi vị thành niên là mang thai trong độ tuổi nào?', options: ['Dưới 10 tuổi', 'Từ 10 đến 19 tuổi', 'Từ 20 đến 25 tuổi'], correct: 1 },
    { q: 'Rủi ro sức khỏe lớn nhất đối với mẹ vị thành niên là gì?', options: ['Tăng nguy cơ bị mụn trứng cá', 'Biến chứng thai kỳ (tiền sản giật, thiếu máu) và nguy hiểm khi sinh nở', 'Mất ngủ'], correct: 1 },
    { q: 'Hậu quả xã hội phổ biến của việc mang thai sớm là gì?', options: ['Được đi du lịch miễn phí', 'Phải bỏ học, mất cơ hội học tập và nghề nghiệp', 'Được mọi người tôn trọng'], correct: 1 },
    { q: 'Việc kiêng quan hệ tình dục có phải là một biện pháp tránh thai không?', options: ['Không, nó không hiệu quả', 'Có, là biện pháp tránh thai 100% hiệu quả', 'Chỉ hiệu quả vào ban đêm'], correct: 1 },
    { q: 'Nếu đã có quan hệ, việc sử dụng biện pháp tránh thai an toàn là đúng hay sai?', options: ['Sai, vì nó không cần thiết', 'Đúng, để tránh thai ngoài ý muốn và các bệnh lây truyền qua đường tình dục', 'Chỉ cần dùng thuốc bắc'], correct: 1 },
    { q: 'Cơ thể vị thành niên đã phát triển hoàn thiện để mang thai chưa?', options: ['Hoàn toàn rồi', 'Chưa, vẫn đang trong quá trình phát triển, tiềm ẩn nhiều rủi ro', 'Chỉ hoàn thiện một nửa'], correct: 1 },
    { q: 'Trẻ sinh ra từ mẹ vị thành niên thường có nguy cơ gì?', options: ['Rất thông minh', 'Sinh non và nhẹ cân', 'Quá cân'], correct: 1 }
  ],

  // Bài 5 (Bài 13 cũ): Xâm hại trên mạng xã hội
  thpt_bai5: [
    { q: 'Ví dụ xâm hại trên mạng?', options: ['Chia sẻ kiến thức', 'Gửi hình ảnh/video nhạy cảm trái ý người khác', 'Khen ngợi lịch sự'], correct: 1 },
    { q: 'Bảo vệ an toàn số tốt nhất là gì?', options: ['Mật khẩu yếu', 'Cài đặt riêng tư, không chia sẻ dữ liệu nhạy cảm cho người lạ', 'Chia sẻ công khai'], correct: 1 },
    { q: 'Xử lý khi bị quấy rối online?', options: ['Im lặng', 'Chặn, báo cáo, lưu bằng chứng và tìm hỗ trợ người lớn', 'Tranh cãi công khai'], correct: 1 },
    { q: 'Xâm hại trên mạng xã hội là gì?', options: ['Nhắn tin cho bạn bè', 'Sử dụng thiết bị điện tử để quấy rối, đe dọa, làm nhục người khác', 'Chơi game online'], correct: 1 },
    { q: 'Lan truyền tin đồn thất thiệt trên mạng có phải là xâm hại không?', options: ['Không, đó chỉ là nói chuyện phiếm', 'Có, đó là một hình thức xâm hại tâm lý nghiêm trọng', 'Chỉ khi tin đồn đó là thật'], correct: 1 },
    { q: 'Thiết lập tài khoản ở chế độ Riêng tư (Private) giúp gì?', options: ['Không ai xem được bài đăng của con', 'Chỉ những người con chấp nhận mới xem được nội dung, giúp kiểm soát thông tin', 'Khiến con nổi tiếng hơn'], correct: 1 },
    { q: 'Bóc mẽ (Doxing) là hành vi gì?', options: ['Làm thơ về người khác', 'Tiết lộ thông tin cá nhân hoặc hình ảnh riêng tư của người khác mà không được phép', 'Viết nhật ký'], correct: 1 },
    { q: 'Nếu bị đe dọa trên mạng, con có nên giữ im lặng không?', options: ['Nên, để sự việc lắng xuống', 'Không, phải báo cáo ngay cho người lớn để được bảo vệ', 'Chỉ báo cáo khi bị đe dọa lần thứ ba'], correct: 1 },
    { q: 'Con có nên gửi ảnh riêng tư cho người yêu không?', options: ['Nên, để thể hiện tình cảm', 'Không, vì hình ảnh đó có thể bị lan truyền ngoài ý muốn và bị lợi dụng', 'Chỉ gửi vào ngày lễ tình nhân'], correct: 1 },
    { q: 'Tại sao việc chặn (Block) kẻ quấy rối lại hiệu quả?', options: ['Làm họ tức giận', 'Ngăn chặn họ tiếp tục gửi tin nhắn và xem nội dung của con', 'Giúp họ thay đổi hành vi'], correct: 1 }
  ],

  // Bài 6 (Bài 14 cũ): Thay đồ nơi công cộng
  thpt_bai6: [
    { q: 'Thay đồ nơi công cộng an toàn là?', options: ['Ở nơi mở', 'Chọn phòng thay kín đáo, kiểm tra xung quanh có camera/lỗ hổng', 'Bất kỳ đâu'], correct: 1 },
    { q: 'Tôn trọng riêng tư nghĩa là?', options: ['Quay phim lén', 'Không nhìn trộm, không chụp ảnh/quay video người khác khi họ thay đồ', 'Bình luận cơ thể'], correct: 1 },
    { q: 'Xử lý khi bị quay lén?', options: ['Bỏ qua', 'Báo bảo vệ/cơ quan chức năng ngay lập tức', 'Chia sẻ lại'], correct: 1 },
    { q: 'Quyền riêng tư cơ thể là gì?', options: ['Quyền được mặc bất cứ thứ gì con muốn', 'Quyền được giữ kín và bảo vệ cơ thể mình, đặc biệt là các vùng riêng tư', 'Quyền được nhìn trộm người khác'], correct: 1 },
    { q: 'Việc nhìn trộm, chụp ảnh hoặc quay video người khác khi họ thay đồ là hành vi gì?', options: ['Một trò đùa vô hại', 'Xâm hại quyền riêng tư và có thể bị coi là phạm pháp', 'Một hành động bình thường'], correct: 1 },
    { q: 'Nếu không có phòng thay đồ cá nhân, con nên làm gì?', options: ['Thay đồ ngay tại chỗ, bất kể có ai nhìn thấy', 'Tìm một góc kín đáo nhất hoặc sử dụng nhà vệ sinh để thay đồ', 'Về nhà thay đồ'], correct: 1 },
    { q: 'Phòng thay đồ có thể là nơi xảy ra vấn đề về quyền riêng tư không?', options: ['Không, vì đó là nơi công cộng', 'Có, vì dễ xảy ra hành vi nhìn trộm hoặc xâm hại', 'Chỉ khi con thay đồ một mình'], correct: 1 },
    { q: 'Tại sao con cần phải tôn trọng sự riêng tư của người khác khi họ thay đồ?', options: ['Vì con không tò mò', 'Vì mọi người đều có quyền bảo vệ cơ thể và sự riêng tư của mình', 'Vì người khác sẽ làm vậy với con'], correct: 1 },
    { q: 'Sự riêng tư cơ thể có còn quan trọng khi con đã lớn không?', options: ['Không, vì con đã trưởng thành', 'Rất quan trọng, nó là một quyền cơ bản của con người', 'Chỉ quan trọng khi còn nhỏ'], correct: 1 },
    { q: 'Con có nên thay đồ chung với bạn thân (cùng giới tính) khi đã dậy thì không?', options: ['Nên, để thể hiện sự thân thiết', 'Nên tránh, ngay cả với bạn thân cũng cần có ranh giới riêng tư cơ thể', 'Chỉ khi bạn thân yêu cầu'], correct: 1 }
  ],

  // Bài 7 (Bài 15 cũ): Xâm hại ở trường học
  thpt_bai7: [
    { q: 'Xâm hại ở trường học có thể là?', options: ['Chỉ đánh nhau', 'Lời nói, hình ảnh, đụng chạm trái ý, bắt nạt thể chất/tinh thần', 'Không xảy ra'], correct: 1 },
    { q: 'Vai trò nhà trường trong phòng chống xâm hại?', options: ['Không liên quan', 'Xây dựng chính sách, kênh báo cáo an toàn và hỗ trợ nạn nhân', 'Chỉ kỷ luật'], correct: 1 },
    { q: 'Học sinh nên làm gì khi chứng kiến/bị xâm hại?', options: ['Giữ bí mật', 'Kể với người tin cậy, báo cáo cho giáo viên/ban giám hiệu', 'Trả đũa'], correct: 1 },
    { q: 'Ai có thể là thủ phạm xâm hại ở trường học?', options: ['Chỉ có giáo viên', 'Học sinh khác (bạn bè, học sinh lớn tuổi) hoặc nhân viên nhà trường', 'Chỉ có người lạ đột nhập'], correct: 1 },
    { q: 'Để phòng tránh xâm hại, con có nên đi đến các khu vực vắng vẻ (nhà vệ sinh, góc khuất) một mình không?', options: ['Nên, để rèn luyện sự dũng cảm', 'Không, nên đi theo nhóm hoặc ở gần khu vực đông người', 'Không quan trọng'], correct: 1 },
    { q: 'Nếu bị bạn bè đụng chạm không phù hợp, con nên làm gì?', options: ['Cố gắng làm ngơ', 'Nói to "DỪNG LẠI" và báo cáo ngay cho giáo viên', 'Đợi đến khi về nhà mới kể'], correct: 1 },
    { q: 'Khi bị xâm hại, điều quan trọng nhất con cần làm với người lớn tin cậy là gì?', options: ['Giữ bí mật để bảo vệ trường học', 'Báo cáo lại sự việc và yêu cầu được bảo vệ', 'Chỉ nói chuyện phiếm'], correct: 1 },
    { q: 'Bắt nạt (Bullying) có được coi là một hình thức xâm hại không?', options: ['Không, đó chỉ là trò đùa', 'Có, bắt nạt thể chất, lời nói đều là xâm hại và làm tổn thương trẻ', 'Chỉ khi gây chảy máu'], correct: 1 },
    { q: 'Khu vực nào ở trường học thường có nguy cơ xảy ra xâm hại cao hơn?', options: ['Sân trường vào giờ ra chơi', 'Các góc khuất, nhà vệ sinh vắng vẻ, cầu thang ít người qua lại', 'Phòng hiệu trưởng'], correct: 1 },
    { q: 'Xâm hại có thể xảy ra trong các hoạt động ngoại khóa ở trường không?', options: ['Không, hoạt động ngoại khóa rất vui', 'Có, rủi ro có thể xảy ra ở mọi nơi và mọi hoạt động', 'Chỉ khi không có giáo viên'], correct: 1 }
  ],

  // Bài 8 (Bài 16 cũ): Xâm hại bằng phim ảnh
  thpt_bai8: [
    { q: 'Xâm hại bằng phim ảnh (CSAM) là gì?', options: ['Phim hoạt hình giáo dục', 'Tạo, sở hữu hoặc lan truyền hình ảnh/video khiêu dâm có trẻ em tham gia', 'Phim tài liệu về trẻ em'], correct: 1 },
    { q: 'Để đạt huy hiệu/chứng nhận an toàn số cần?', options: ['Không học', 'Hoàn thành học tập, thực hành kỹ năng an toàn số', 'Giấu thông tin'], correct: 1 },
    { q: 'Kỹ năng cốt lõi phòng tránh xâm hại phim ảnh?', options: ['Giữ bí mật', 'Nhận diện nguy cơ, nói không, KHÔNG GỬI ảnh riêng tư, tìm hỗ trợ', 'Bắt chước người khác'], correct: 1 },
    { q: 'Quy tắc KHÔNG GỬI ẢNH RIÊNG TƯ nghĩa là gì?', options: ['Không gửi ảnh cho bố mẹ', 'Không bao giờ gửi ảnh hoặc video riêng tư của bản thân cho bất kỳ ai', 'Chỉ gửi ảnh chân dung'], correct: 1 },
    { q: 'Hành vi ép buộc trẻ em tạo ra hình ảnh khiêu dâm của chính mình được gọi là gì?', options: ['Trò chơi selfie', 'Sản xuất Tài liệu Xâm hại Tình dục Trẻ em (CSAM)', 'Chụp ảnh nghệ thuật'], correct: 1 },
    { q: 'Ngay cả khi tin tưởng, ảnh riêng tư có thể bị lan truyền không?', options: ['Không, nếu đã xóa khỏi điện thoại', 'Có, vì dữ liệu có thể bị đánh cắp, sao chép hoặc chia sẻ ngoài ý muốn', 'Chỉ khi gửi qua email'], correct: 1 },
    { q: 'Việc tạo, sở hữu hoặc lan truyền CSAM là hành vi thế nào?', options: ['Một sở thích cá nhân', 'Phạm pháp hình sự nghiêm trọng', 'Một lỗi lầm nhỏ'], correct: 1 },
    { q: 'Nếu bị đe dọa lan truyền ảnh riêng tư (Revenge Porn), con nên làm gì?', options: ['Thỏa hiệp với kẻ đe dọa', 'Báo cáo ngay cho bố mẹ, cảnh sát, hoặc Đường dây nóng Bảo vệ Trẻ em', 'Tự mình xóa hình ảnh trên mạng'], correct: 1 },
    { q: 'An toàn kỹ thuật số (Digital Safety) là gì?', options: ['Việc sử dụng điện thoại mới nhất', 'Các biện pháp bảo vệ bản thân và thông tin cá nhân trên môi trường mạng', 'Lắp đặt camera an ninh'], correct: 1 },
    { q: 'Việc báo cáo tội phạm xâm hại bằng phim ảnh cho cơ quan chức năng có ý nghĩa gì?', options: ['Khiến kẻ đó bị xấu hổ', 'Bảo vệ bản thân, ngăn chặn tội phạm tiếp tục hại người khác và giúp cơ quan điều tra', 'Không có tác dụng gì'], correct: 1 }
  ],
};

// Ánh xạ ID bài học với key quiz tương ứng (từ 1 đến 8)
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

// Hàm lấy Quiz theo ID bài học
export const getThptQuizByLesson = (lessonId: number): QuizQuestion[] => {
  const key = QUIZ_THPT_MAP[lessonId];
  return QUIZ_THPT_QUESTIONS[key] || QUIZ_THPT_QUESTIONS['thpt_bai1'];
};