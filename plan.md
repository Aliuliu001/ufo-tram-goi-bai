# UFO Trạm Gọi Bài — Kế hoạch thực hiện

## 1. Mục tiêu
Tạo game web độc lập, mới hoàn toàn về giao diện và cách tổ chức mã nguồn, lấy cảm hứng từ cơ chế **Trạm Gọi Bài UFO** mà anh đã được tác giả cấp quyền dùng/chỉnh sửa. Game chạy bằng một đường link GitHub Pages của tài khoản `Aliuliu001`.

Tên dự án tạm dùng: **UFO Trạm Gọi Bài**. Repo dự kiến: `Aliuliu001/ufo-tram-goi-bai`.

## 2. Phạm vi bản đầu tiên

### Giữ lại tinh thần game gốc
- Không gian ngoài hành tinh/UFO, có yếu tố gọi ngẫu nhiên để tạo hồi hộp.
- Giáo viên nhập danh sách học sinh và câu hỏi để chơi tại lớp.
- Chọn/ngẫu nhiên một học sinh, hiển thị câu hỏi, trả lời đúng/sai và tổng kết lượt.
- Hiệu ứng chuyển động 3D nhẹ, chạy được trên laptop lớp học.

### Làm mới toàn bộ phần nhìn
- Giao diện riêng, không bê nguyên nhận diện hay hình ảnh cũ.
- Chủ đề mặc định: **UFO neon trong không gian**, chữ dễ nhìn, nút rõ thao tác.
- Tạo hệ thống **skin/trang phục** cho phi hành đoàn hoặc nhân vật được gọi:
  - Skin có sẵn ngay trong game.
  - Giáo viên được chọn skin trước khi chơi.
  - Thiết kế dữ liệu để sau này thêm ảnh/trang phục do anh tự tải lên.
- Tối ưu một màn hình laptop 1366×768; không có nút bé hoặc chữ chen chúc.

### Không làm ở bản đầu
- Đăng nhập/tài khoản học sinh.
- Bảng xếp hạng trực tuyến.
- Lưu dữ liệu lên máy chủ.
- Sao chép hình/âm thanh/nhận diện của bản đồng nghiệp nếu chưa có tệp gốc rõ ràng.

## 3. Hướng kỹ thuật
- **HTML, CSS, JavaScript thuần**: dễ bảo trì và đưa lên GitHub Pages.
- **Three.js**: chỉ dùng cho nền/hiệu ứng UFO 3D nhẹ; phần dữ liệu và bảng điều khiển không phụ thuộc 3D để game không bị lỗi khi máy yếu.
- `localStorage` an toàn cho danh sách lớp, câu hỏi và cài đặt; có nút sao lưu/khôi phục JSON ở giai đoạn dữ liệu.
- Kho ảnh skin về sau dùng IndexedDB để không giới hạn bởi bộ nhớ nhỏ của trình duyệt.
- Dữ liệu mẫu không có thông tin học sinh thật.

## 4. Cấu trúc dự kiến

```text
ufo-tram-goi-bai/
├── index.html                 # Màn hình chính
├── README.md                  # Cách mở/chơi/quản lý dữ liệu
├── plan.md                    # Kế hoạch này
├── task.md                    # Danh sách việc và tình trạng
├── context.md                 # Quyết định đã chốt + bước tiếp theo
├── assets/
│   ├── icons/
│   ├── skins/                 # Skin có sẵn, giấy phép rõ ràng
│   └── sounds/                # Âm thanh tự tạo/được cấp quyền
├── css/
│   ├── tokens.css             # Màu, chữ, khoảng cách dùng chung
│   └── app.css                # Bố cục và hiệu ứng
├── js/
│   ├── data-model.js          # Cấu trúc lớp, học sinh, câu hỏi, skin
│   ├── storage.js             # Lưu/đọc + sao lưu/khôi phục
│   ├── game-engine.js         # Vòng chơi, ngẫu nhiên, đúng/sai
│   ├── renderer.js            # Vẽ giao diện 2D
│   ├── scene3d.js             # Nền Three.js tách biệt
│   ├── settings.js            # Bảng nhập dữ liệu giáo viên
│   └── app.js                 # Nối các phần và khởi động game
└── tests/
    └── game-engine.test.js    # Kiểm thử luật chơi bằng Node
```

## 5. Các giai đoạn

### Giai đoạn A — Tạo nền dự án và bản chạy đầu
1. Tạo repo công khai, thư mục làm việc riêng, tài liệu `README.md`, `plan.md`, `task.md`, `context.md`.
2. Tạo GitHub Pages và kiểm tra có link chơi được.
3. Dựng khung một màn hình: tiêu đề, khu vực sân khấu UFO, bảng lớp, điều khiển.
4. Làm nền không gian/UFO 3D nhẹ có phương án dự phòng nếu hiệu ứng 3D không tải được.

**Xong khi:** mở link Pages thấy giao diện mới, không có lỗi JavaScript, dùng được trên kích thước 1280×633 và 1366×768.

### Giai đoạn B — Vòng chơi gọi bài
1. Chốt mô hình dữ liệu: học sinh, câu hỏi, lượt chơi, kết quả, skin.
2. Nhập nhanh danh sách học sinh và bộ câu hỏi dạng bảng trong phần Cài đặt.
3. Nút gọi ngẫu nhiên: không gọi trùng cho đến khi hết danh sách (có nút làm lại vòng).
4. Giáo viên bấm Đúng/Sai/Bỏ qua; bảng trạng thái và tổng kết cập nhật ngay.
5. Viết kiểm tra tự động cho chọn ngẫu nhiên, chống trùng và làm lại vòng.

**Xong khi:** 10 học sinh được gọi đủ 10 em, không trùng trước khi hết vòng; điểm/kết quả khớp thao tác.

### Giai đoạn C — Skin và tùy chỉnh hình ảnh
1. Skin mặc định theo cấu trúc có tên, màu, ảnh minh họa, hiệu ứng.
2. Màn chọn skin rõ ràng trước khi bắt đầu.
3. Mỗi skin đổi được nhân vật/phi thuyền/màu hiệu ứng mà không làm đổi luật chơi.
4. Chuẩn bị phần tải ảnh skin cá nhân: nén ảnh, kho IndexedDB, danh sách ảnh, xóa, sao lưu/khôi phục.
5. Kiểm tra khi tải 20+ ảnh: tải lại trang vẫn đủ ảnh; ảnh PNG trong suốt không mất nền.

**Xong khi:** ít nhất 3 skin có sẵn hoạt động đúng và việc đổi skin không làm mất dữ liệu lớp/câu hỏi.

### Giai đoạn D — Trải nghiệm lớp học và dữ liệu an toàn
1. Công tắc riêng cho âm thanh hiệu ứng và nhạc nền.
2. Nút hành động bằng tiếng Việt, tên bắt đầu bằng động từ: ví dụ `🚀 Bắt đầu gọi bài`, `🎲 Gọi học sinh`, `💾 Sao lưu dữ liệu`.
3. Thêm Sao lưu/Khôi phục toàn bộ lớp, câu hỏi, cài đặt và ảnh skin bằng một file JSON.
4. Cảnh báo trước thao tác xóa dữ liệu; không có xóa hàng loạt tự động.
5. Viết hướng dẫn cho anh dùng bằng lời bình dân và ảnh/chỉ dẫn ngắn.

**Xong khi:** sao lưu → xóa dữ liệu trình duyệt → khôi phục → tải lại vẫn trở về đúng dữ liệu trước đó.

### Giai đoạn E — Kiểm tra và phát hành
1. Kiểm tra trên màn hình laptop, điện thoại ngang và máy cấu hình yếu.
2. Rà soát bản quyền: chỉ để lại ảnh, âm thanh do anh cung cấp/tự tạo/được phép hoặc có giấy phép sử dụng rõ ràng.
3. Kiểm tra mã JavaScript, kiểm thử luật chơi và kiểm tra trực tiếp trên Pages.
4. Cập nhật cache-buster, đẩy GitHub, đợi Pages triển khai xong rồi kiểm tra link thật.

## 6. Tiêu chí nghiệm thu
- Link `https://aliuliu001.github.io/ufo-tram-goi-bai/` mở được (tên link có thể đổi nếu anh đổi tên repo).
- Không có lỗi JavaScript khi mở hoặc thực hiện một vòng chơi.
- Thao tác gọi ngẫu nhiên không gọi trùng trước khi danh sách hết.
- Skin thay đổi được về hình/màu/hiệu ứng, luật chơi giữ nguyên.
- Dữ liệu lớp và câu hỏi không mất sau khi tải lại trang.
- Sao lưu/khôi phục trả lại đầy đủ dữ liệu và ảnh skin.
- Giao diện mới, không dùng hình/nhận diện gốc của bản cũ ngoài những nội dung anh được cấp quyền và chủ động cung cấp.

## 7. Rủi ro và cách xử lý
- **Không có source gốc:** không phụ thuộc vào mã cũ; xây mới theo cơ chế đã quan sát và quyền tác giả đã cấp.
- **3D làm máy yếu chậm:** Three.js chỉ là lớp trang trí; có chế độ tắt hiệu ứng/chạy nền 2D dự phòng.
- **Ảnh skin nhiều làm mất dữ liệu:** dùng IndexedDB, không nhét ảnh lớn vào localStorage; có sao lưu JSON.
- **GitHub Pages lưu bản cũ trong trình duyệt:** tăng số phiên bản ở file tải; sau mỗi đợt em sẽ nhắc anh bấm `Ctrl + Shift + R`.
- **Dữ liệu học sinh:** không đưa tên/lớp thật vào repo công khai; chỉ tồn tại trong trình duyệt của máy anh hoặc file sao lưu anh giữ.

## 8. Những điểm cần anh duyệt trước khi xây
- Tên repo tạm: `ufo-tram-goi-bai`.
- Skin bản đầu: em đề xuất 3 skin mới hoàn toàn: **Thám hiểm Sao Mộc**, **Đội cứu hộ Ngân Hà**, **Thợ săn kho báu Vũ trụ**.
- Luật điểm bản đầu: cần anh chốt ở đầu Giai đoạn B, hoặc em sẽ dựng dạng đơn giản: Đúng +1, Sai 0, Bỏ qua 0.
- Loại câu hỏi đầu tiên: em đề xuất giáo viên nhập chữ/câu hỏi ngắn; ảnh và nghe âm thanh bổ sung sau khi bản chữ chạy ổn định.
