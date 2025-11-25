import { Scenario } from '../types';

export const SCENARIOS_PARENTS: Scenario[] = [
  {
    title: 'Con hỏi về "Sex" khi còn nhỏ (6-8 tuổi)',
    situation: 'Con bạn hỏi: "Con được sinh ra từ đâu? Và \'sex\' là gì ạ?"',
    options: [
      { text: 'Nói lảng sang chuyện khác hoặc nói "lớn lên con sẽ hiểu"', feedback: 'Không nên. Việc né tránh sẽ khiến con tò mò và tìm kiếm thông tin sai lệch. Hãy luôn trả lời sự thật một cách đơn giản, phù hợp với lứa tuổi.' },
      { text: 'Giải thích bằng những từ ngữ khoa học phức tạp, chi tiết về giải phẫu học', feedback: 'Không phù hợp. Thông tin quá chi tiết sẽ làm con bối rối. Hãy dùng từ ngữ đơn giản, trung lập và chỉ trả lời những gì con hỏi.' },
      { text: 'Trả lời bằng sự thật một cách đơn giản, trung lập và hỏi lại xem con đã nghe thấy điều đó ở đâu', feedback: 'Chính xác. Giúp con hiểu một cách tự nhiên và biết được nguồn thông tin của con để kiểm soát nếu cần.' }
    ]
  },
  {
    title: 'Con muốn dùng mạng xã hội (10-12 tuổi)',
    situation: 'Con bạn muốn tạo tài khoản mạng xã hội để kết nối với bạn bè, nhưng bạn lo lắng về nội dung không lành mạnh và an toàn mạng.',
    options: [
      { text: 'Cấm tiệt không cho con sử dụng mạng xã hội cho đến khi 18 tuổi', feedback: 'Không khả thi và có thể gây phản ứng ngược. Cần dạy con cách sử dụng an toàn thay vì cấm hoàn toàn.' },
      { text: 'Đồng ý cho con dùng với điều kiện bạn phải biết mật khẩu và kiểm soát tất cả tin nhắn của con', feedback: 'Vi phạm quyền riêng tư. Tốt nhất là thiết lập quy tắc sử dụng và tin tưởng con, không nên xâm phạm hoàn toàn.' },
      { text: 'Thiết lập quy tắc sử dụng rõ ràng (giờ giấc, nội dung, không chia sẻ thông tin cá nhân), dạy con cách chặn/báo cáo và thường xuyên nói chuyện về an toàn mạng', feedback: 'Cách tiếp cận đúng. Cung cấp kiến thức để con tự bảo vệ mình và duy trì sự tin tưởng.' }
    ]
  },
  {
    title: 'Con đến kỳ kinh nguyệt lần đầu/Mộng tinh lần đầu',
    situation: 'Con bạn gặp sự kiện sinh lý đầu tiên của tuổi dậy thì (kinh nguyệt/mộng tinh) và đang lúng túng/lo lắng.',
    options: [
      { text: 'Cho con tự tìm hiểu trên mạng, nghĩ rằng con đã đủ lớn để tự xử lý', feedback: 'Không nên. Con cần sự hỗ trợ, trấn an và hướng dẫn chi tiết từ cha mẹ để tránh hoảng loạn và xử lý sai.' },
      { text: 'Trấn an con rằng đó là điều hoàn toàn bình thường, hướng dẫn cách vệ sinh sạch sẽ, và chuẩn bị đầy đủ vật dụng cần thiết', feedback: 'Rất cần thiết. Biến sự kiện này thành một kỷ niệm tích cực, khẳng định sự trưởng thành của con và xây dựng kênh giao tiếp mở.' },
      { text: 'Nói với tất cả mọi người trong gia đình và bạn bè thân thiết rằng con đã "lớn"', feedback: 'Gây bối rối và vi phạm sự riêng tư của con. Việc này nên được giữ kín trừ khi con đồng ý chia sẻ.' }
    ]
  },
  {
    title: 'Con bị trêu chọc vì sự thay đổi cơ thể',
    situation: 'Con bạn bị bạn bè trêu chọc về cân nặng, chiều cao hoặc sự phát triển không đồng đều của cơ thể (13-15 tuổi).',
    options: [
      { text: 'Nói với con rằng phải phớt lờ và đừng bận tâm, con phải tự mạnh mẽ lên', feedback: 'Không đủ. Con cần được hỗ trợ về cảm xúc. Phớt lờ không giải quyết được cảm giác bị tổn thương.' },
      { text: 'Giúp con xây dựng lòng tự trọng, dạy con cách tôn trọng sự đa dạng cơ thể, và cùng con tìm cách xử lý hành vi bắt nạt ở trường', feedback: 'Chính xác. Tập trung vào giá trị nội tại và giúp con tự tin về con người mình, đồng thời giải quyết vấn đề bắt nạt từ bên ngoài.' },
      { text: 'Ép con ăn kiêng hoặc luyện tập khắc nghiệt theo ý mình để tránh bị trêu chọc', feedback: 'Gây hại cho sức khỏe và tâm lý của con. Cần tập trung vào sức khỏe, không phải ngoại hình.' }
    ]
  },
  {
    title: 'Con hỏi về việc yêu đương và hẹn hò (14-16 tuổi)',
    situation: 'Con bạn bắt đầu bày tỏ sự thích thú với một người khác giới và hỏi liệu con có được phép hẹn hò không.',
    options: [
      { text: 'Cấm đoán hoàn toàn, nói rằng con phải tập trung 100% vào việc học', feedback: 'Gây phản ứng chống đối. Tình cảm là nhu cầu tự nhiên. Việc cấm cản có thể khiến con giấu giếm.' },
      { text: 'Khuyến khích mối quan hệ lành mạnh, đặt ra ranh giới rõ ràng về giờ giấc, nơi chốn (hẹn hò ở nơi công cộng) và nhắc nhở về sự ưu tiên học tập', feedback: 'Cách tiếp cận đúng. Biến cha mẹ thành người tư vấn, dạy con cách xây dựng mối quan hệ tôn trọng và có trách nhiệm.' },
      { text: 'Đồng ý nhưng không quan tâm đến người con đang hẹn hò là ai', feedback: 'Thiếu trách nhiệm. Cha mẹ cần biết và đánh giá xem mối quan hệ đó có lành mạnh và an toàn không.' }
    ]
  },
  {
    title: 'Con có dấu hiệu buồn bã/trầm cảm kéo dài',
    situation: 'Con bạn thường xuyên giận dữ, mất ngủ, bỏ bê việc học và nói rằng "Con không muốn sống nữa".',
    options: [
      { text: 'Nói với con rằng "Đừng suy nghĩ tiêu cực, phải mạnh mẽ lên" và mặc kệ con', feedback: 'Sai lầm nghiêm trọng. Đây là dấu hiệu của khủng hoảng tâm lý. Việc ép buộc mạnh mẽ chỉ làm con cảm thấy bị cô lập.' },
      { text: 'Lắng nghe con một cách chân thành, không phán xét, và ngay lập tức tìm kiếm sự trợ giúp chuyên môn từ chuyên gia tâm lý hoặc bác sĩ tâm thần', feedback: 'Rất cần thiết. Sức khỏe tinh thần là khẩn cấp. Phải hành động ngay lập tức và tìm kiếm sự hỗ trợ chuyên nghiệp.' },
      { text: 'Mua cho con những món đồ con thích để con vui lên', feedback: 'Chỉ là giải pháp tạm thời, không giải quyết được nguyên nhân gốc rễ của vấn đề tâm lý.' }
    ]
  },
  {
    title: 'Con hỏi về Thuốc tránh thai và Bao cao su (16-18 tuổi)',
    situation: 'Con bạn hỏi về cách sử dụng thuốc tránh thai khẩn cấp, thuốc tránh thai hàng ngày và bao cao su.',
    options: [
      { text: 'Nổi giận, cấm con tìm hiểu những thứ này vì chúng là "tệ nạn"', feedback: 'Sai. Việc này thể hiện sự thiếu tin tưởng và ngăn chặn việc con tìm kiếm thông tin an toàn. Con có thể tìm hiểu lén lút và xử lý sai.' },
      { text: 'Tận dụng cơ hội để dạy con về Tình dục có trách nhiệm, sử dụng biện pháp tránh thai an toàn (ưu tiên bao cao su) và hậu quả của việc mang thai ngoài ý muốn/STI', feedback: 'Chính xác. Cung cấp thông tin chính xác, trung thực, nhấn mạnh vào trách nhiệm và sự an toàn là mục tiêu của giáo dục giới tính.' },
      { text: 'Chỉ nói rằng cứ dùng bao cao su là được, không cần quan tâm đến các loại thuốc khác', feedback: 'Không đủ. Cần thảo luận toàn diện về các biện pháp khác nhau và khuyến cáo nên tham khảo ý kiến bác sĩ.' }
    ]
  },
  {
    title: 'Con bị áp lực từ kết quả học tập',
    situation: 'Con bạn đạt điểm kém ở một môn học quan trọng và thể hiện sự lo lắng quá mức, sợ bạn thất vọng.',
    options: [
      { text: 'Phê bình con thật nặng lời vì kết quả kém, bắt con phải học thêm nhiều hơn nữa', feedback: 'Làm tăng áp lực, gây tổn hại đến lòng tự trọng và sức khỏe tinh thần của con. Phụ huynh nên là chỗ dựa.' },
      { text: 'Trấn an con, giúp con phân tích nguyên nhân, cùng con lập kế hoạch học tập mới và nhấn mạnh rằng **giá trị của con không nằm ở điểm số**', feedback: 'Rất cần thiết. Giúp con đối diện với thất bại một cách tích cực, khuyến khích sự phát triển toàn diện.' },
      { text: 'Tự mình liên hệ với giáo viên và các học sinh giỏi khác để tìm "bí kíp" học tập hiệu quả', feedback: 'Phụ huynh nên làm việc với con trước. Cần tôn trọng sự tự chủ của con trong việc học.' }
    ]
  },
  {
    title: 'Con nhận được ảnh/video nhạy cảm từ bạn bè',
    situation: 'Bạn phát hiện con bạn nhận được ảnh hoặc video nhạy cảm (18+) từ bạn bè qua mạng xã hội.',
    options: [
      { text: 'Lập tức tịch thu điện thoại, mắng con té tát và cấm con dùng mạng xã hội vĩnh viễn', feedback: 'Gây ra sự hoảng sợ, làm con mất lòng tin và sẽ giấu giếm mọi chuyện sau này.' },
      { text: 'Bình tĩnh nói chuyện với con, giải thích về **tính bất hợp pháp** của việc lưu trữ/chia sẻ nội dung đó và hướng dẫn con cách xóa, chặn và báo cáo', feedback: 'Cách làm đúng. Dạy con về an toàn mạng, hậu quả pháp lý và cách tự bảo vệ mình là ưu tiên hàng đầu.' },
      { text: 'Yêu cầu con phải gửi ảnh/video đó cho bạn xem để xem có ai trong trường bị lộ không', feedback: 'Không nên. Việc lưu giữ hay xem nội dung này là không cần thiết và có thể vi phạm pháp luật.' }
    ]
  },
  {
    title: 'Con nói rằng "Con là người đồng tính/song tính"',
    situation: 'Con bạn tâm sự và nói rằng con nhận ra mình có xu hướng tính dục khác biệt (ví dụ: đồng tính, song tính) so với đa số.',
    options: [
      { text: 'Phủ nhận hoàn toàn, nói rằng đây chỉ là giai đoạn nhất thời và bắt con phải "sống đúng với giới tính"', feedback: 'Gây tổn thương tâm lý sâu sắc, khiến con cảm thấy bị từ chối và có thể dẫn đến trầm cảm, tự tử. Đây là sự kỳ thị.' },
      { text: 'Ôm con, khẳng định tình yêu thương vô điều kiện, học cách tôn trọng xu hướng tính dục của con và cùng con tìm hiểu về cộng đồng an toàn cho con', feedback: 'Hành động đúng đắn nhất. Tạo môi trường an toàn, tôn trọng con và hỗ trợ con trên hành trình tự khám phá bản thân.' },
      { text: 'Đưa con đi gặp bác sĩ để "chữa trị" hoặc cố gắng thay đổi xu hướng tính dục của con', feedback: 'Không thể và không cần thiết. Xu hướng tính dục không phải là bệnh. Các hình thức "chữa trị" này đã bị cộng đồng y tế thế giới lên án.' }
    ]
  },
  {
    title: 'Con bị bạn bè lôi kéo vào nhóm tiêu cực',
    situation: 'Con bạn bắt đầu đi chơi với một nhóm bạn có hành vi tiêu cực (bỏ học, đánh nhau, thử chất kích thích).',
    options: [
      { text: 'Cấm con giao du với tất cả bạn bè và chỉ cho con đi học rồi về nhà', feedback: 'Gây cô lập. Con có thể tìm cách phản ứng lại bằng cách giấu giếm và lén lút.' },
      { text: 'Tìm hiểu nguyên nhân khiến con bị thu hút bởi nhóm bạn đó, tăng cường thời gian chất lượng với con và giúp con tìm kiếm các hoạt động ngoại khóa lành mạnh hơn', feedback: 'Cách xử lý đúng. Tập trung vào việc xây dựng mối quan hệ tin cậy và tìm kiếm sự thay thế tích cực, đồng thời dạy con cách lựa chọn bạn bè.' },
      { text: 'Chỉ trích và bêu xấu nhóm bạn đó trước mặt con', feedback: 'Làm con cảm thấy bị công kích và có xu hướng bảo vệ bạn bè mình.' }
    ]
  },
  {
    title: 'Con thắc mắc về các bệnh STI',
    situation: 'Con bạn hỏi về các bệnh lây truyền qua đường tình dục (STI) như HIV, HPV, và cách phòng tránh.',
    options: [
      { text: 'Nói rằng STI chỉ xảy ra với những người xấu và cấm con không được tìm hiểu về nó', feedback: 'Gây kỳ thị và hiểu sai. STI có thể xảy ra với bất kỳ ai có hành vi tình dục không an toàn.' },
      { text: 'Cung cấp thông tin khoa học, trung thực về cách lây truyền, triệu chứng, cách phòng tránh (bao cao su, vắc-xin) và tầm quan trọng của việc xét nghiệm định kỳ', feedback: 'Chính xác. Cung cấp kiến thức chính xác giúp con có ý thức bảo vệ bản thân và có hành vi có trách nhiệm.' },
      { text: 'Kể những câu chuyện rùng rợn về STI để hù dọa con không dám quan hệ tình dục', feedback: 'Gây sợ hãi không cần thiết, không phải là phương pháp giáo dục hiệu quả.' }
    ]
  },
  {
    title: 'Con bị bạn trai/bạn gái kiểm soát và ghen tuông',
    situation: 'Bạn nhận thấy con bạn bị người yêu kiểm soát quá mức (cấm giao tiếp với bạn bè, đòi kiểm tra điện thoại).',
    options: [
      { text: 'Cho rằng đó là "tình yêu đích thực" và không can thiệp', feedback: 'Sai. Đây là dấu hiệu của mối quan hệ độc hại. Cần sự can thiệp của cha mẹ.' },
      { text: 'Giải thích cho con về dấu hiệu của mối quan hệ lành mạnh/độc hại, dạy con cách đặt ra ranh giới và hỗ trợ con chấm dứt mối quan hệ không tôn trọng đó', feedback: 'Chính xác. Trang bị kỹ năng để con nhận biết và tự bảo vệ mình khỏi sự lạm dụng cảm xúc.' },
      { text: 'Tìm gặp người yêu của con để mắng mỏ và đe dọa', feedback: 'Làm căng thẳng mối quan hệ. Nên tập trung hỗ trợ và dạy con kỹ năng đối phó.' }
    ]
  },
  {
    title: 'Con muốn xăm hình/xỏ khuyên (16-18 tuổi)',
    situation: 'Con bạn muốn xăm hình hoặc xỏ khuyên ở một vị trí dễ thấy trên cơ thể.',
    options: [
      { text: 'Phản đối kịch liệt và nói rằng làm vậy sẽ không tìm được việc làm tốt', feedback: 'Có thể đúng ở một mức độ, nhưng việc phản đối mạnh mẽ sẽ gây phản ứng chống đối. Đây là vấn đề về quyền tự quyết cơ thể.' },
      { text: 'Thảo luận với con về những cam kết lâu dài (ảnh hưởng nghề nghiệp, chi phí xóa xăm) và yêu cầu con tìm hiểu kỹ về cơ sở uy tín, đảm bảo vệ sinh an toàn', feedback: 'Cách tiếp cận cân bằng. Tôn trọng quyền tự quyết cơ thể của con nhưng yêu cầu con phải có trách nhiệm và hiểu rõ hậu quả.' },
      { text: 'Mặc kệ, con đủ lớn để tự quyết định', feedback: 'Thiếu sự hướng dẫn. Vẫn cần hướng dẫn con về tính an toàn và trách nhiệm.' }
    ]
  },
  {
    title: 'Con hỏi về nạo phá thai và rủi ro',
    situation: 'Con bạn hỏi về quy trình và hậu quả của việc nạo phá thai.',
    options: [
      { text: 'Chỉ nhấn mạnh vào sự kinh khủng của nó để con sợ và không bao giờ nghĩ đến quan hệ tình dục', feedback: 'Không đủ. Cần thông tin chính xác, không nên dùng nỗi sợ làm phương pháp giáo dục.' },
      { text: 'Cung cấp thông tin chính xác về quy trình, nhấn mạnh hậu quả nghiêm trọng của việc phá thai không an toàn và khẳng định rằng cần phải luôn tìm kiếm sự giúp đỡ tại cơ sở y tế hợp pháp', feedback: 'Chính xác. Nêu rõ rủi ro, nhưng tập trung vào việc tìm kiếm sự hỗ trợ an toàn và hợp pháp.' },
      { text: 'Nói rằng đó là một hành vi trái đạo đức và từ chối thảo luận thêm', feedback: 'Phủ nhận quyền được tìm hiểu thông tin của con.' }
    ]
  },
  {
    title: 'Con bị ám ảnh bởi ngoại hình trên mạng xã hội',
    situation: 'Con bạn liên tục so sánh bản thân với hình ảnh đã chỉnh sửa (filter) của người khác trên mạng xã hội và trở nên tự ti, lo âu.',
    options: [
      { text: 'Khuyên con nên ngừng theo dõi những tài khoản đó và hạn chế dùng điện thoại', feedback: 'Chỉ giải quyết phần ngọn. Cần thay đổi tư duy của con.' },
      { text: 'Dạy con về sự khác biệt giữa hình ảnh thực tế và hình ảnh trên mạng, nhấn mạnh vào giá trị bản thân, và giúp con tìm kiếm nguồn nội dung đa dạng, tích cực về hình ảnh cơ thể', feedback: 'Chính xác. Xây dựng khả năng tư duy phản biện của con về truyền thông và củng cố lòng tự trọng.' },
      { text: 'Chê bai những người nổi tiếng đó để con cảm thấy khá hơn', feedback: 'Không nên. Việc hạ thấp người khác không giúp con tự tin hơn.' }
    ]
  },
  {
    title: 'Con bị bạn bè rủ rê dùng cần sa/chất kích thích nhẹ',
    situation: 'Con bạn tâm sự rằng đã có người rủ rê con dùng thử cần sa (ma túy nhẹ) và nói nó không gây hại.',
    options: [
      { text: 'Đánh con một trận thật đau để con không dám tái phạm', feedback: 'Gây bạo lực và không giải quyết được vấn đề rủ rê từ bên ngoài.' },
      { text: 'Giải thích rõ ràng về tác hại nghiêm trọng của ma túy/chất kích thích đối với não bộ đang phát triển, dạy con các kỹ năng từ chối hiệu quả và kiểm soát các mối quan hệ của con', feedback: 'Rất cần thiết. Cung cấp thông tin khoa học, kỹ năng từ chối và đảm bảo môi trường sống an toàn.' },
      { text: 'Bảo con cứ thử một lần cho biết rồi thôi', feedback: 'Không đúng. Việc thử một lần có thể dẫn đến hậu quả nghiêm trọng.' }
    ]
  },
  {
    title: 'Con bị người lạ chạm vào cơ thể không phù hợp',
    situation: 'Con bạn kể lại rằng một người quen/họ hàng đã chạm vào cơ thể con ở những vùng riêng tư và khiến con khó chịu.',
    options: [
      { text: 'Cố gắng giải quyết nội bộ gia đình và giữ im lặng vì sợ mất mặt', feedback: 'Sai lầm nghiêm trọng. Việc giữ im lặng tiếp tay cho hành vi lạm dụng.' },
      { text: 'Trấn an con rằng con không có lỗi, khẳng định sự an toàn của con, và báo cáo sự việc với cơ quan chức năng (công an, đường dây nóng) ngay lập tức để bảo vệ con', feedback: 'Khẩn cấp và đúng đắn nhất. Bảo vệ con là ưu tiên hàng đầu, cần sự can thiệp của luật pháp.' },
      { text: 'Dạy con phải cảnh giác hơn và đừng để bị chạm vào', feedback: 'Đặt trách nhiệm lên vai người bị hại. Trọng tâm phải là xử lý người vi phạm.' }
    ]
  },
  {
    title: 'Con muốn biết về Quyền tự quyết cơ thể',
    situation: 'Con bạn hỏi: "Con có quyền gì đối với cơ thể của con?"',
    options: [
      { text: 'Giải thích rằng cơ thể con thuộc về gia đình, và con phải làm theo ý cha mẹ', feedback: 'Sai. Điều này phủ nhận quyền tự quyết cá nhân của con.' },
      { text: 'Dạy con về **Quyền tự quyết cơ thể**, rằng con là người duy nhất có quyền quyết định những gì xảy ra với cơ thể mình, và không ai được ép buộc con đồng thuận hay đụng chạm khi con không muốn', feedback: 'Chính xác. Giúp con hiểu rõ ranh giới cá nhân và kỹ năng bảo vệ ranh giới đó.' },
      { text: 'Nói rằng quyền đó chỉ áp dụng khi con đã trưởng thành', feedback: 'Sai. Quyền tự quyết cơ thể áp dụng cho mọi lứa tuổi.' }
    ]
  },
  {
    title: 'Con bị áp lực phải kết hôn/sinh con sớm',
    situation: 'Con bạn (17-18 tuổi) bị người yêu và gia đình người yêu gây áp lực phải "sống chung/cưới sớm" để sinh con.',
    options: [
      { text: 'Khuyên con nên nghe theo vì họ nói rằng con gái nên lấy chồng sớm', feedback: 'Lỗi thời và thiếu trách nhiệm. Hôn nhân/sinh con sớm ảnh hưởng lớn đến tương lai của con.' },
      { text: 'Thảo luận về tầm quan trọng của việc học tập, sự nghiệp và sự độc lập tài chính trước khi kết hôn, đồng thời bảo vệ con khỏi áp lực từ bên ngoài', feedback: 'Chính xác. Giúp con ưu tiên cho tương lai cá nhân, độc lập và trưởng thành về mọi mặt trước khi tiến tới hôn nhân.' },
      { text: 'Yêu cầu con chia tay ngay lập tức mà không cần lắng nghe ý kiến của con', feedback: 'Thiếu sự tôn trọng. Cần thảo luận và cùng con đưa ra quyết định chín chắn.' }
    ]
  }
];
