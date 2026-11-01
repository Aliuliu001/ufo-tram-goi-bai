# UFO Trạm Gọi Bài — Context dự án

## Trạng thái hiện tại
- Repo công khai đã tạo: `https://github.com/Aliuliu001/ufo-tram-goi-bai`.
- Đã dựng bản khung đầu tiên: giao diện, danh sách học sinh, gọi ngẫu nhiên không trùng trong lượt, làm lại lượt và 3 skin đổi màu/giao diện.
- **Sai lệch đã xác nhận:** sân khấu hiện tại chỉ là CSS giả chiều sâu, chưa có mô hình/camera/nhân vật Three.js 3D. Không được coi là hoàn thành yêu cầu hình ảnh 3D.
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
- Đã rà lại phần 3D gốc: Three.js tạo WebGL canvas, thị trấn (đường, nhà, cây, đèn), sao/hành tinh, UFO 3D, cone tia hút, vòng năng lượng và các nhân vật phi hành gia 3D chạy quanh.
- Cơ chế gốc: camera orbit kéo-thả/zoom; UFO tuần tra khi chờ; lúc gọi thì quét, bay theo mục tiêu và hút nhân vật lên.
- Vì đã có quyền của tác giả, dự án mới có thể tái tạo lại cơ chế/mô hình đó và phát triển skin riêng. Không cần sử dụng asset cũ.
- Khi đến phần nhiều ảnh skin: dùng IndexedDB + sao lưu JSON, không lưu ảnh lớn trong localStorage.

## Bước tiếp theo
1. Hoàn tất lại Giai đoạn A4b–A5: thay CSS bằng Three.js 3D thật và kiểm tra Pages.
2. Khi 3D đã đúng, sang Giai đoạn B: thêm câu hỏi, Đúng/Sai/Bỏ qua và bảng kết quả.
3. Chốt luật điểm bản đầu (đề xuất: Đúng +1, Sai/Bỏ qua 0).

## Lưu ý vận hành
- Mỗi lần GitHub Pages cập nhật, anh mở link rồi bấm `Ctrl + Shift + R` để tải bản mới.
- Sau khi có dữ liệu lớp thật, tải file Sao lưu JSON về máy/Drive sau mỗi buổi để không mất dữ liệu khi xóa trình duyệt hoặc đổi máy.
- Không ghi mật khẩu, token GitHub hay tên học sinh thật vào các file tài liệu/mã nguồn công khai.
