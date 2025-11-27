export class RB {
  heading: string;
  text: string;
  bullets?: string[];
  constructor(heading: string, text: string, bullets?: string[]) {
    this.heading = heading;
    this.text = text;
    this.bullets = bullets;
  }
}

export class RA {
  title: string;
  text: string;
  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}

export class RT {
  id: string;
  title: string;
  blocks: RB[];
  aside?: RA[];
  constructor(id: string, title: string, blocks: RB[], aside?: RA[]) {
    this.id = id;
    this.title = title;
    this.blocks = blocks;
    this.aside = aside;
  }
}

class Repo {
  private topics: RT[];
  constructor(topics: RT[]) {
    this.topics = topics;
  }
  private normalize(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  all() {
    return this.topics;
  }
  getByKey(key?: string) {
    const k = key ? this.normalize(key) : '';
    if (!k) return this.topics[0];
    const byTitle = this.topics.find(t => this.normalize(t.title).includes(k));
    return byTitle || this.topics[0];
  }
}

const BAI1_TEXT = `Dậy thì là giai đoạn chuyển đổi từ trẻ em thành người lớn, thường xảy ra trong độ tuổi từ 8 đến 16, tùy thuộc vào mỗi cá nhân. Ở bé gái, quá trình này được thúc đẩy bởi hóc-môn, dẫn đến sự phát triển của các đặc điểm giới tính thứ cấp.

Các Thay đổi Thể chất Đặc trưng:

Phát triển ngực (Tuyến vú): Là dấu hiệu đầu tiên của tuổi dậy thì. Ngực có thể bắt đầu bằng một cục u nhỏ dưới núm vú và có thể phát triển không đồng đều lúc ban đầu.

Chu kỳ kinh nguyệt (Hành kinh): Khoảng 1-2 năm sau khi ngực bắt đầu phát triển, các bé gái sẽ có kỳ kinh đầu tiên. Đây là quá trình tử cung chuẩn bị cho việc mang thai, nếu không thụ tinh thì niêm mạc tử cung sẽ bong ra và chảy máu. Chu kỳ này đánh dấu khả năng sinh sản của cơ thể.

Các thay đổi khác: Tăng chiều cao nhanh, mọc lông mu và lông nách, tăng tiết mồ hôi, da dầu và mụn trứng cá, hông nở rộng hơn.

Khám phá và Tôn trọng Cơ thể:

Việc tò mò và khám phá cơ thể mình là hành vi hoàn toàn tự nhiên. Điều quan trọng là bé gái cần học cách:

Vệ sinh cá nhân đúng cách: Đặc biệt là trong những ngày có kinh nguyệt để đảm bảo sạch sẽ và ngăn ngừa nhiễm trùng.

Tôn trọng cơ thể: Hiểu rằng cơ thể mình là độc nhất và cần được bảo vệ.

Tìm kiếm sự giúp đỡ: Trao đổi với mẹ hoặc người lớn tin cậy khi có bất kỳ thắc mắc hoặc khó chịu nào liên quan đến cơ thể.`;

const BAI2_TEXT = `Dậy thì ở Bé Trai là gì?

Dậy thì là giai đoạn phát triển lớn, thường xảy ra trong độ tuổi từ 9 đến 14. Quá trình này giúp bé trai phát triển các đặc điểm giới tính thứ cấp, trở nên to lớn và mạnh mẽ hơn, chuẩn bị cho vai trò sinh sản.

Các Thay đổi Thể chất Đặc trưng:

Thay đổi cơ quan sinh dục: Tinh hoàn và dương vật lớn hơn. Tinh hoàn bắt đầu sản xuất tinh trùng và hóc-môn testosterone.

Vỡ giọng: Giọng nói trở nên trầm hơn và có thể bị "đứt quãng" trong quá trình chuyển đổi.

Mộng tinh (Giấc mơ ẩm ướt): Là hiện tượng xuất tinh không chủ ý trong khi ngủ, hoàn toàn bình thường và là dấu hiệu cơ thể bé trai đã trưởng thành và sản xuất tinh trùng.

Các thay đổi khác: Tăng chiều cao nhanh, vai rộng ra, phát triển cơ bắp, mọc lông mu, lông nách và ria mép, tăng tiết mồ hôi, da dầu và mụn trứng cá.

Khám phá và Vệ sinh Cơ thể:

Việc khám phá cơ thể là một phần tất yếu của sự phát triển. Điều quan trọng là bé trai cần học cách:

Vệ sinh cơ quan sinh dục: Giữ vệ sinh sạch sẽ hàng ngày để ngăn ngừa mùi hôi và các vấn đề sức khỏe khác.

Hiểu về cơ thể: Nhận biết rằng mộng tinh là bình thường và không cần phải xấu hổ.

Tự tin: Chấp nhận những thay đổi của cơ thể và biết rằng tốc độ phát triển của mỗi người là khác nhau.`;

const BAI3_TEXT = `Quấy rối và Xâm hại là gì?

Quấy rối: Là những hành vi, lời nói, cử chỉ hoặc hành động không mong muốn, khiến người khác cảm thấy khó chịu, sợ hãi, xấu hổ hoặc bị đe dọa.

Xâm hại: Là việc sử dụng quyền lực, sự ép buộc hoặc thủ đoạn để thực hiện hành vi tình dục trái với ý muốn của nạn nhân, bao gồm cả đụng chạm hoặc hành vi phi đụng chạm.

Các Hình thức Hành vi Xâm hại:

Hành vi xâm hại không chỉ là đụng chạm cơ thể mà còn là:

Lời nói: Bình luận khiếm nhã về ngoại hình, cơ thể, hoặc đề nghị/yêu cầu liên quan đến tình dục.

Hình ảnh: Gửi hoặc ép buộc xem hình ảnh, video khiêu dâm.

Đụng chạm: Bất kỳ sự đụng chạm nào vào "vùng đồ lót" (khu vực ngực, bộ phận sinh dục, mông) hoặc đụng chạm không phù hợp vào các khu vực khác của cơ thể.

Quy tắc An toàn Quan trọng:

Quy tắc Đồ lót (The Underwear Rule): Không ai được phép chạm vào các bộ phận cơ thể được đồ lót che phủ của con (trừ khi có người lớn đáng tin cậy giúp con vệ sinh). Con cũng không được chạm vào các bộ phận đó của người khác.

Quy tắc "KHÔNG – BỎ ĐI – KỂ VỚI NGƯỜI LỚN":

Nói "KHÔNG" rõ ràng, dứt khoát nếu cảm thấy không thoải mái, sợ hãi.

Bỏ đi (chạy, thoát khỏi tình huống đó) ngay lập tức.

Kể với người lớn tin cậy (bố mẹ, giáo viên, cô chú, cảnh sát...) ngay lập tức, không giữ bí mật.`;

const BAI4_TEXT = `Quá trình Thụ tinh:

Em bé được tạo ra khi tinh trùng (từ cơ quan sinh dục nam) gặp trứng (từ cơ quan sinh dục nữ) trong quá trình quan hệ tình dục hoặc bằng phương pháp hỗ trợ sinh sản.

Hợp tử: Sau khi tinh trùng và trứng kết hợp, chúng tạo thành hợp tử.

Làm tổ: Hợp tử di chuyển xuống và làm tổ trong tử cung của người mẹ.

Phát triển trong Tử cung:

Em bé (gọi là thai nhi) sẽ phát triển trong tử cung của người mẹ khoảng 9 tháng 10 ngày.

Thai nhi nhận dinh dưỡng và oxy qua dây rốn nối với nhau thai.

Quá trình Sinh nở:

Khi đủ tháng, em bé sẽ được sinh ra. Có hai cách sinh chính:

Sinh thường (Sinh ngả âm đạo): Em bé di chuyển qua đường âm đạo (kênh sinh) của người mẹ.

Sinh mổ (Mổ lấy thai): Em bé được lấy ra qua một vết mổ ở bụng và tử cung của người mẹ, thường được thực hiện khi sinh thường có rủi ro.`;

const BAI5_TEXT = `Sự thật Đáng Sợ:

Thực tế, hầu hết các trường hợp xâm hại trẻ em đều do người quen, người thân tín hoặc thành viên trong gia đình (người thân, họ hàng, hàng xóm thân thiết, bạn của bố mẹ, v.v...) thực hiện, chứ không phải người lạ.

Cách thức Kẻ Xâm hại Lợi dụng:

Kẻ xâm hại trong gia đình thường lợi dụng:

Lòng tin: Chúng là những người trẻ tin tưởng và yêu quý.

Quyền lực: Chúng sử dụng vị trí của người lớn để ép buộc, đe dọa.

Bí mật: Chúng yêu cầu trẻ giữ bí mật và nói rằng đó là một "trò chơi" hoặc "tình yêu đặc biệt".

Trách nhiệm và Cách Tìm Kiếm Giúp Đỡ:

KHÔNG PHẢI LỖI CỦA CON: Hãy nhớ rằng, việc bị xâm hại hoàn toàn không phải là lỗi của nạn nhân. Trách nhiệm thuộc về kẻ xâm hại.

Phải nói ra: Im lặng là điều nguy hiểm nhất. Nạn nhân cần tìm kiếm người lớn tin cậy khác ngoài kẻ xâm hại (giáo viên, người giám hộ khác, bạn bè lớn tuổi, cán bộ xã hội...) để kể lại sự việc.

Gọi Đường dây nóng: Nếu không thể kể với ai, hãy tìm đến các đường dây nóng hỗ trợ trẻ em và bảo vệ trẻ em.`;

const BAI6_TEXT = `Khái niệm Bản dạng Giới (Gender Identity)

Bản dạng Giới là cảm nhận sâu sắc, nội tại của một người về bản thân mình là nam, là nữ, cả hai, hay không phải cả hai (ví dụ: phi nhị nguyên giới, linh hoạt giới). Bản dạng Giới là một phần cố định và không thay đổi của mỗi người, độc lập với giới tính sinh học khi sinh ra.

Phân biệt Giới tính Sinh học và Bản dạng Giới

Giới tính Sinh học (Sex): Được xác định khi sinh dựa trên cơ quan sinh dục, nhiễm sắc thể và hóc-môn (ví dụ: nam, nữ, liên giới tính).

Bản dạng Giới (Gender Identity): Là giới tính mà bạn cảm nhận và muốn được gọi theo (ví dụ: người hợp giới – bản dạng giới phù hợp với giới tính sinh học; người chuyển giới – bản dạng giới khác với giới tính sinh học).

Tôn trọng Sự Đa dạng Giới

Mỗi người đều có quyền tự xác định bản dạng giới của mình. Việc tôn trọng tên gọi và đại từ nhân xưng mà một người sử dụng là cách đơn giản và quan trọng nhất để thể hiện sự chấp nhận và tôn trọng đối với họ.`;

const BAI7_TEXT = `Khái niệm Xu hướng Tình dục (Sexual Orientation)

Xu hướng Tình dục là sự hấp dẫn bền vững về mặt tình cảm, lãng mạn hoặc tình dục của một người đối với người khác. Giống như Bản dạng Giới, Xu hướng Tình dục là một phần tự nhiên và không thể thay đổi của một người.

Các Xu hướng Tình dục Chính:

Thế giới có nhiều xu hướng tình dục khác nhau, tất cả đều bình đẳng và cần được tôn trọng:

Dị tính (Heterosexual): Hấp dẫn người khác giới (Nam hấp dẫn Nữ, Nữ hấp dẫn Nam). Đây là xu hướng phổ biến trong xã hội.

Đồng tính (Homosexual): Hấp dẫn người cùng giới (Nam hấp dẫn Nam, Nữ hấp dẫn Nữ).

Song tính (Bisexual): Hấp dẫn cả hai giới tính nam và nữ.

Vô tính (Asexual): Không hoặc ít có sự hấp dẫn tình dục đối với bất kỳ giới nào.

Nguyên tắc Ứng xử

Sự đa dạng về Xu hướng Tình dục là một phần tự nhiên của cuộc sống con người. Mọi sự phân biệt, chế giễu hoặc kỳ thị dựa trên Xu hướng Tình dục đều là hành vi sai trái và không thể chấp nhận được. Tôn trọng sự lựa chọn và cảm xúc của người khác là điều cốt lõi của một xã hội văn minh.`;

const BAI8_TEXT = `Ngủ Chung Giường (Co-sleeping) là gì?

Ngủ chung giường là thực hành ngủ cùng giường với con cái (thường là trẻ sơ sinh hoặc trẻ nhỏ). Đây là một chủ đề gây nhiều tranh cãi với những ưu điểm và rủi ro rõ ràng.

Ưu điểm của Ngủ Chung (Đặc biệt với trẻ sơ sinh):

Gắn kết Tình cảm: Giúp tăng cường mối liên kết tình cảm giữa bố mẹ và con cái.

Thuận tiện cho việc cho bú: Đặc biệt hữu ích cho các bà mẹ cho con bú đêm, giúp mẹ dễ dàng đáp ứng nhu cầu của bé.

Điều chỉnh Giấc ngủ: Một số nghiên cứu cho rằng việc ngủ gần giúp đồng bộ hóa nhịp thở và nhịp tim của mẹ và bé.

Rủi ro và Lời khuyên Quan trọng:

Rủi ro lớn nhất của việc ngủ chung giường là Hội chứng đột tử ở trẻ sơ sinh (SIDS) hoặc nguy cơ ngạt thở do bố mẹ vô tình đè lên bé, hoặc do chăn gối quá mềm.

Lời khuyên từ Chuyên gia:

KHÔNG NGỦ CHUNG GIƯỜNG VỚI TRẺ SƠ SINH: Hầu hết các tổ chức y tế (như Học viện Nhi khoa Hoa Kỳ - AAP) khuyến nghị trẻ sơ sinh nên ngủ trong cũi riêng đặt cùng phòng với bố mẹ (Room-sharing, not Co-sleeping) trong ít nhất 6 tháng đầu.

Trẻ lớn hơn: Với trẻ đã lớn, việc ngủ chung giường có thể ảnh hưởng đến tính độc lập và ý thức về ranh giới cá nhân của trẻ.

Ranh giới Cá nhân: Việc ngủ riêng từ độ tuổi mầm non trở đi giúp trẻ xây dựng ranh giới về cơ thể mình và sự riêng tư. Việc bố mẹ và con cái (đặc biệt là con đã dậy thì) ngủ chung giường có thể gây ra những hiểu lầm hoặc nhầm lẫn về ranh giới cơ thể.

Kết luận

Quyết định ngủ chung cần được cân nhắc kỹ lưỡng, đặc biệt là phải ưu tiên sự an toàn của trẻ sơ sinh. Với trẻ lớn hơn, nên khuyến khích trẻ ngủ riêng và thiết lập các ranh giới không gian riêng tư.`;

const initialTopics = [
  new RT(
    'bio-psy',
    'Giới tính sinh học & tâm lý',
    [
      new RB('Khái niệm chính', 'Giới tính sinh học và tâm lý có khác biệt nhưng liên quan.', ['Sinh học','Tâm lý','Tôn trọng sự đa dạng']),
      new RB('Ví dụ thực tế', 'Mỗi người có trải nghiệm riêng, cần đồng cảm và thấu hiểu.'),
      new RB('Tổng kết', 'Tôn trọng bản thân và người khác.')
    ],
    [
      new RA('Ghi chú nhanh', 'Từ ngữ chuẩn xác giúp giao tiếp an toàn.'),
      new RA('Tài liệu tham khảo', 'Nguồn uy tín từ tổ chức y tế/giáo dục.')
    ]
  ),
  new RT(
    'puberty',
    'Dậy thì & thay đổi cơ thể',
    [
      new RB('Khái niệm chính', 'Dậy thì diễn ra khác nhau theo từng người.', ['Thay đổi thể chất','Cảm xúc mới','Chăm sóc sức khỏe']),
      new RB('Ví dụ thực tế', 'Chu kỳ, kích thích, mụn, chiều cao thay đổi.'),
      new RB('Tổng kết', 'Tìm hiểu, hỏi người tin cậy, đi khám khi cần.')
    ],
    [
      new RA('Ghi chú nhanh', 'Bình thường hóa thay đổi ở tuổi dậy thì.'),
      new RA('Tài liệu tham khảo', 'Cẩm nang sức khỏe vị thành niên.')
    ]
  ),
  new RT(
    'consent',
    'Sự đồng thuận',
    [
      new RB('Khái niệm chính', 'Đồng thuận là đồng ý rõ ràng, tự nguyện, có thể rút lại.', ['Hỏi và nghe','Tôn trọng ranh giới','Không ép buộc']),
      new RB('Ví dụ thực tế', 'Dừng lại khi người kia không thoải mái.'),
      new RB('Tổng kết', 'Giao tiếp là nền tảng.')
    ],
    [
      new RA('Ghi chú nhanh', 'Không có nghĩa là im lặng đồng ý.'),
      new RA('Tài liệu tham khảo', 'Hướng dẫn đồng thuận an toàn.')
    ]
  ),
  new RT(
    'relation',
    'Tình yêu & mối quan hệ',
    [
      new RB('Khái niệm chính', 'Quan hệ lành mạnh dựa trên tin tưởng, tôn trọng, giao tiếp.', ['Tin tưởng','Tôn trọng','Giao tiếp']),
      new RB('Ví dụ thực tế', 'Giải quyết mâu thuẫn bằng lắng nghe và thỏa thuận.'),
      new RB('Tổng kết', 'Không kiểm soát, không bạo lực.')
    ],
    [
      new RA('Ghi chú nhanh', 'Ranh giới cá nhân là cần thiết.')
    ]
  ),
  new RT(
    'thcs-bai1',
    'THCS • Bài 1 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI1_TEXT)
    ]
  )
  ,
  new RT(
    'thcs-bai2',
    'THCS • Bài 2 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI2_TEXT)
    ]
  ),
  new RT(
    'thcs-bai3',
    'THCS • Bài 3 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI3_TEXT)
    ]
  ),
  new RT(
    'thcs-bai4',
    'THCS • Bài 4 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI4_TEXT)
    ]
  ),
  new RT(
    'thcs-bai5',
    'THCS • Bài 5 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI5_TEXT)
    ]
  ),
  new RT(
    'thcs-bai6',
    'THCS • Bài 6 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI6_TEXT)
    ]
  ),
  new RT(
    'thcs-bai7',
    'THCS • Bài 7 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI7_TEXT)
    ]
  ),
  new RT(
    'thcs-bai8',
    'THCS • Bài 8 • Kiến thức nền tảng',
    [
      new RB('Bài đọc', BAI8_TEXT)
    ]
  )
];

const repo = new Repo(initialTopics);

export const READING_TOPICS = repo.all();
export const getReadingTopicByKey = (key?: string) => repo.getByKey(key);
