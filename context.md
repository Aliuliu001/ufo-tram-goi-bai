# UFO Trạm Gọi Bài — Context dự án

## Trạng thái hiện tại
- Repo công khai: `https://github.com/Aliuliu001/ufo-tram-goi-bai`; game: `https://aliuliu001.github.io/ufo-tram-goi-bai/?v=2`.
- Đã có sân khấu Three.js 3D thật: khu phố, đường, nhà/cây, sao/hành tinh, UFO, 5 phi hành gia chạy và nhãn tên nổi.
- Đã có kéo-xoay/zoom tự do, skin đổi màu UFO/tia hút, gọi ngẫu nhiên không trùng ở bản nền.
- Đã kiểm tra Pages ở 1280×633: canvas 3D, nhãn 5 học sinh, UFO tuần tra và cảnh hút sau khi gọi hoạt động.
- Bản tham khảo: `https://sites.google.com/view/ufotrmgibi3d-cucrtuingoihnhtin/full-page-embed?authuser=1&pli=1`; source repo gốc đã bị tác giả xóa.

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

## Quy tắc vòng dò tìm đã chốt
- Có ba camera: **Toàn cảnh** (góc hiện tại), **Theo dấu UFO** (bám bay mềm theo UFO), **Góc phố** (thấp/cận nhân vật).
- Giáo viên chọn được số bạn lên tàu bằng `− / +`, tối thiểu 1 và không vượt số bạn sẵn sàng.
- Mặc định không gọi trùng: gọi hết danh sách rồi mới làm vòng mới. Có công tắc để cho phép gọi trùng khi cần.
- Thời gian dò là lúc UFO đổi nhiều mục tiêu, rọi sáng tên từng bạn để tạo kịch tính. Kết quả ngẫu nhiên phải giữ kín cho đến hết đếm ngược.
- Hết giờ mới khóa mục tiêu, hút lần lượt đúng số bạn đã chọn; sau đó mới hiện tên và ảnh/biểu tượng của các bạn được chọn.

## Bước tiếp theo
1. Làm B1–B2: ba góc nhìn và chuyển camera mượt.
2. Làm B3–B5: số bạn lên tàu, chống trùng và thời gian dò.
3. Làm B6–B9: cảnh đổi mục tiêu, hút sau khi hết giờ, kiểm tra tự động và Pages.

## Lưu ý vận hành
- Mỗi lần GitHub Pages cập nhật, anh mở link rồi bấm `Ctrl + Shift + R` để tải bản mới.
- Sau khi có dữ liệu lớp thật, tải file Sao lưu JSON về máy/Drive sau mỗi buổi để không mất dữ liệu khi xóa trình duyệt hoặc đổi máy.
- Không ghi mật khẩu, token GitHub hay tên học sinh thật vào các file tài liệu/mã nguồn công khai.
