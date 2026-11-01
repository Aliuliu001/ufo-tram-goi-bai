# UFO Trạm Gọi Bài — Context dự án

## Trạng thái hiện tại
- Repo công khai đã tạo: `https://github.com/Aliuliu001/ufo-tram-goi-bai`.
- Đã dựng bản khung đầu tiên: nền không gian/UFO mới, danh sách học sinh, gọi ngẫu nhiên không trùng trong lượt, làm lại lượt và 3 skin đổi màu/giao diện.
- Đã kiểm tra cục bộ ở khung trình duyệt 1280×633: 5 học sinh được gọi đủ 5 em, không trùng; đổi skin hoạt động.
- Bản game tham khảo ở Google Sites: `https://sites.google.com/view/ufotrmgibi3d-cucrtuingoihnhtin/full-page-embed?authuser=1&pli=1`.
- Source repository gốc đã bị tác giả xóa; dự án mới không dựa vào repo/asset cũ.

## Quyền sử dụng
- Anh Ngọc Trương đã xin và được tác giả/đồng nghiệp cấp phép dùng, chỉnh sửa và tùy biến thoải mái.
- Dự án mới vẫn ưu tiên giao diện, ảnh, âm thanh và nhận diện tự tạo để có sản phẩm riêng, dễ tiếp tục phát triển.

## Quyết định đã chốt
- Tạo game thành dự án độc lập dưới GitHub của `Aliuliu001`, có GitHub Pages để mở link và chơi.
- Tên tạm: **UFO Trạm Gọi Bài**.
- Repo đã chốt: `Aliuliu001/ufo-tram-goi-bai`.
- Game phải có skin/trang phục tùy chọn và hỗ trợ ảnh skin cá nhân ở giai đoạn sau.
- Mã nguồn dễ chỉnh: HTML/CSS/JavaScript thuần; Three.js chỉ cho hiệu ứng 3D nhẹ.
- Giao diện tiếng Việt, nút ghi rõ hành động; ưu tiên dùng tốt cho giáo viên trên laptop.
- Dữ liệu học sinh không commit vào GitHub công khai.

## Nguồn tham khảo kỹ thuật
- Mã HTML của trang tham khảo đang được nhúng trực tiếp qua Google Sites.
- Có thể quan sát cơ chế để dựng bản mới, nhưng dự án mới không cần phụ thuộc vào mã nhúng đó.
- Khi đến phần nhiều ảnh skin: dùng IndexedDB + sao lưu JSON, không lưu ảnh lớn trong localStorage.

## Bước tiếp theo
1. Sang Giai đoạn B: thêm câu hỏi, Đúng/Sai/Bỏ qua và bảng kết quả.
2. Chốt luật điểm bản đầu (đề xuất: Đúng +1, Sai/Bỏ qua 0).
3. Sau khi vòng chơi chữ ổn định, tiếp tục ảnh skin cá nhân và sao lưu/khôi phục.

## Lưu ý vận hành
- Mỗi lần GitHub Pages cập nhật, anh mở link rồi bấm `Ctrl + Shift + R` để tải bản mới.
- Sau khi có dữ liệu lớp thật, tải file Sao lưu JSON về máy/Drive sau mỗi buổi để không mất dữ liệu khi xóa trình duyệt hoặc đổi máy.
- Không ghi mật khẩu, token GitHub hay tên học sinh thật vào các file tài liệu/mã nguồn công khai.
