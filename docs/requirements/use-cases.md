CÁC CA SỬ DỤNG CHI TIẾT
SMART SCHOOL BUS TRACKING SYSTEM


CA SỬ DỤNG 01: ĐĂNG NHẬP HỆ THỐNG

Người dùng: Admin, Phụ huynh, Tài xế

Mô tả ngắn:
Người dùng đăng nhập vào ứng dụng để sử dụng các chức năng

Điều kiện trước khi thực hiện:
- Đã có tài khoản trong hệ thống
- Tài khoản đã được kích hoạt
- Có kết nối internet

Các bước thực hiện:
Bước 1: Người dùng mở ứng dụng
Bước 2: Nhập địa chỉ email
Bước 3: Nhập mật khẩu
Bước 4: Nhấn nút Đăng nhập
Bước 5: Hệ thống kiểm tra thông tin
Bước 6: Hệ thống tạo token xác thực
Bước 7: Chuyển đến màn hình tương ứng vai trò

Trường hợp ngoại lệ:
Trường hợp 1: Sai email hoặc mật khẩu
+ Hiển thị thông báo lỗi
+ Cho phép nhập lại
+ Khóa tài khoản sau 5 lần sai

Trường hợp 2: Tài khoản chưa kích hoạt
+ Hiển thị thông báo chưa kích hoạt
+ Gửi lại email kích hoạt
+ Hướng dẫn kiểm tra email

Trường hợp 3: Mất kết nối internet
+ Hiển thị thông báo không có mạng
+ Hướng dẫn kiểm tra kết nối
+ Cho phép thử lại

Kết quả sau khi hoàn thành:
- Người dùng đăng nhập thành công
- Có token xác thực hợp lệ
- Vào được màn hình chính


---


CA SỬ DỤNG 02: THEO DÕI VỊ TRÍ XE BUÝT

Người dùng: Phụ huynh

Mô tả ngắn:
Phụ huynh xem vị trí xe buýt đang chở con mình trên bản đồ

Điều kiện trước khi thực hiện:
- Phụ huynh đã đăng nhập
- Con đã được gán vào một tuyến xe
- Xe đang trong giờ hoạt động

Các bước thực hiện:
Bước 1: Phụ huynh mở ứng dụng
Bước 2: Vào màn hình Trang chủ
Bước 3: Hệ thống hiển thị bản đồ Google Maps
Bước 4: Hệ thống lấy thông tin tuyến xe của con
Bước 5: Hiển thị icon xe buýt trên bản đồ
Bước 6: Hiển thị các điểm đón trên tuyến
Bước 7: Cập nhật vị trí xe mỗi 5 giây
Bước 8: Hiển thị thời gian dự kiến đến điểm đón

Trường hợp ngoại lệ:
Trường hợp 1: Con chưa được gán tuyến
+ Hiển thị thông báo chưa có tuyến
+ Gợi ý liên hệ nhà trường
+ Hiển thị số hotline

Trường hợp 2: Xe chưa xuất phát
+ Hiển thị icon xe ở điểm xuất phát
+ Thông báo giờ dự kiến khởi hành
+ Cho phép bật nhắc nhở

Trường hợp 3: Mất tín hiệu GPS
+ Hiển thị vị trí cuối cùng
+ Thông báo đang cập nhật
+ Tự động kết nối lại

Kết quả sau khi hoàn thành:
- Phụ huynh biết vị trí xe hiện tại
- Biết xe còn bao lâu đến điểm đón
- Yên tâm về việc đón con


---


CA SỬ DỤNG 03: ĐIỂM DANH HỌC SINH LÊN XE

Người dùng: Tài xế

Mô tả ngắn:
Tài xế quét mã QR của học sinh khi học sinh lên xe

Điều kiện trước khi thực hiện:
- Tài xế đã đăng nhập
- Xe đang trong chuyến đi
- Camera điện thoại hoạt động tốt

Các bước thực hiện:
Bước 1: Tài xế mở màn hình Điểm danh
Bước 2: Hiển thị danh sách học sinh cần đón
Bước 3: Tài xế nhấn nút Quét mã
Bước 4: Mở camera quét QR code
Bước 5: Học sinh đưa thẻ có mã QR
Bước 6: Hệ thống quét và nhận dạng mã
Bước 7: Kiểm tra mã học sinh hợp lệ
Bước 8: Ghi nhận thời gian và vị trí
Bước 9: Đánh dấu tích xanh bên tên học sinh
Bước 10: Gửi thông báo cho phụ huynh

Trường hợp ngoại lệ:
Trường hợp 1: Mã QR không hợp lệ
+ Hiển thị thông báo mã không đúng
+ Yêu cầu quét lại
+ Cho phép điểm danh thủ công

Trường hợp 2: Học sinh đã điểm danh rồi
+ Hiển thị đã điểm danh lúc mấy giờ
+ Không cho điểm danh lại
+ Ghi log để kiểm tra

Trường hợp 3: Không có internet
+ Lưu điểm danh vào bộ nhớ điện thoại
+ Hiển thị icon chờ đồng bộ
+ Tự động gửi lên server khi có mạng

Trường hợp 4: Camera không hoạt động
+ Cho phép nhập mã thủ công
+ Hoặc chọn từ danh sách
+ Ghi chú lý do không quét được

Kết quả sau khi hoàn thành:
- Điểm danh được ghi nhận trong hệ thống
- Phụ huynh nhận được thông báo
- Tài xế biết học sinh nào đã lên xe


---


CA SỬ DỤNG 04: ĐIỂM DANH HỌC SINH XUỐNG XE

Người dùng: Tài xế

Mô tả ngắn:
Tài xế quét mã QR khi học sinh xuống xe

Điều kiện trước khi thực hiện:
- Học sinh đã điểm danh lên xe trước đó
- Xe đang dừng tại điểm trả
- Camera hoạt động

Các bước thực hiện:
Giống như Ca sử dụng 03
Khác biệt: Loại điểm danh là xuống xe

Thông báo gửi cho phụ huynh:
Con bạn đã xuống xe an toàn lúc [giờ] tại [địa chỉ]

Kết quả sau khi hoàn thành:
- Xác nhận học sinh đã xuống xe
- Phụ huynh nhận thông báo
- Hệ thống cập nhật trạng thái


---


CA SỬ DỤNG 05: TẠO TUYẾN ĐƯỜNG MỚI

Người dùng: Admin

Mô tả ngắn:
Admin tạo một tuyến xe buýt mới với các điểm đón và trả

Điều kiện trước khi thực hiện:
- Admin đã đăng nhập
- Có kết nối internet để dùng Google Maps

Các bước thực hiện:
Bước 1: Admin vào menu Quản lý tuyến
Bước 2: Nhấn nút Tạo tuyến mới
Bước 3: Nhập tên tuyến (ví dụ: Tuyến 1 Quận 1)
Bước 4: Hệ thống hiển thị bản đồ
Bước 5: Admin click trên bản đồ để đánh dấu điểm xuất phát
Bước 6: Nhập tên điểm dừng đầu tiên
Bước 7: Nhập giờ dự kiến đến
Bước 8: Lặp lại cho các điểm tiếp theo
Bước 9: Nhấn Xem trước tuyến đường
Bước 10: Hệ thống vẽ đường đi tối ưu
Bước 11: Hiển thị tổng quãng đường và thời gian
Bước 12: Admin xác nhận Lưu tuyến
Bước 13: Hệ thống lưu vào database

Trường hợp ngoại lệ:
Trường hợp 1: Tìm kiếm địa chỉ
+ Sử dụng Google Places autocomplete
+ Hiển thị gợi ý khi gõ
+ Chọn địa chỉ từ danh sách

Trường hợp 2: Tuyến quá dài (trên 50 km)
+ Hiển thị cảnh báo
+ Gợi ý chia thành 2 tuyến
+ Vẫn cho phép lưu nếu admin muốn

Trường hợp 3: Thiếu thông tin bắt buộc
+ Hiển thị các lỗi cần sửa
+ Không cho lưu
+ Hướng dẫn điền đủ thông tin

Kết quả sau khi hoàn thành:
- Tuyến mới được tạo trong hệ thống
- Có thể gán xe và tài xế
- Có thể gán học sinh vào tuyến


---


CA SỬ DỤNG 06: GÁN HỌC SINH VÀO TUYẾN XE

Người dùng: Admin

Mô tả ngắn:
Admin phân công học sinh vào một tuyến xe cụ thể

Điều kiện trước khi thực hiện:
- Đã có thông tin học sinh trong hệ thống
- Đã có tuyến xe được tạo

Các bước thực hiện:
Bước 1: Admin vào menu Quản lý học sinh
Bước 2: Tìm kiếm học sinh theo tên hoặc mã
Bước 3: Click vào học sinh để xem chi tiết
Bước 4: Nhấn nút Chỉnh sửa
Bước 5: Chọn tuyến xe từ danh sách
Bước 6: Chọn điểm đón cụ thể trên tuyến
Bước 7: Nhấn Lưu thay đổi
Bước 8: Hệ thống cập nhật thông tin
Bước 9: Gửi email thông báo cho phụ huynh

Trường hợp ngoại lệ:
Trường hợp 1: Học sinh đã có tuyến
+ Hiển thị tuyến hiện tại
+ Hỏi xác nhận chuyển sang tuyến mới
+ Cập nhật nếu admin đồng ý

Trường hợp 2: Tuyến đã đầy chỗ
+ Hiển thị thông báo tuyến đầy
+ Gợi ý chọn tuyến khác
+ Hoặc thêm xe cho tuyến đó

Kết quả sau khi hoàn thành:
- Học sinh được gán vào tuyến
- Phụ huynh biết thông tin tuyến xe
- Tài xế thấy học sinh trong danh sách


---


CA SỬ DỤNG 07: GỬI THÔNG BÁO KHẨN CẤP

Người dùng: Tài xế

Mô tả ngắn:
Tài xế nhấn nút SOS khi xe gặp sự cố hoặc tình huống khẩn cấp

Điều kiện trước khi thực hiện:
- Tài xế đã đăng nhập
- Xe đang trong chuyến đi
- Có GPS và internet

Các bước thực hiện:
Bước 1: Tài xế nhấn nút SOS màu đỏ
Bước 2: Hiển thị popup xác nhận
Bước 3: Tài xế xác nhận gửi cảnh báo
Bước 4: Hệ thống ghi nhận thời gian và vị trí
Bước 5: Gửi thông báo đến tất cả Admin
Bước 6: Gửi thông báo đến phụ huynh học sinh trên xe
Bước 7: Hiển thị cảnh báo trên dashboard Admin
Bước 8: Admin liên hệ tài xế qua điện thoại

Nội dung thông báo:
CẢNH BÁO KHẨN CẤP
Xe [số xe] báo sự cố
Vị trí: [địa chỉ cụ thể]
Thời gian: [giờ phút]
Vui lòng liên hệ ngay

Trường hợp ngoại lệ:
Trường hợp 1: Nhấn nhầm
+ Cho phép hủy trong 5 giây
+ Không gửi thông báo nếu hủy kịp
+ Ghi log để kiểm tra

Trường hợp 2: Không có internet
+ Lưu cảnh báo vào bộ nhớ
+ Gửi ngay khi có mạng trở lại
+ Hiển thị trạng thái chờ gửi

Kết quả sau khi hoàn thành:
- Sự cố được báo cáo ngay lập tức
- Admin và phụ huynh được thông báo
- Có thể xử lý kịp thời


---


CA SỬ DỤNG 08: XEM BÁO CÁO ĐIỂM DANH

Người dùng: Admin

Mô tả ngắn:
Admin xem báo cáo điểm danh của học sinh theo tháng

Điều kiện trước khi thực hiện:
- Admin đã đăng nhập
- Đã có dữ liệu điểm danh trong hệ thống

Các bước thực hiện:
Bước 1: Admin vào menu Báo cáo
Bước 2: Chọn Báo cáo điểm danh
Bước 3: Chọn tháng và năm
Bước 4: Chọn tuyến xe (hoặc tất cả)
Bước 5: Nhấn nút Xem báo cáo
Bước 6: Hệ thống truy vấn dữ liệu
Bước 7: Tính toán các chỉ số
Bước 8: Hiển thị bảng báo cáo

Thông tin hiển thị:
- Mã học sinh
- Tên học sinh
- Tuyến xe
- Số ngày đi học
- Tỷ lệ phần trăm
- Số lần đi muộn

Các chức năng bổ sung:
- Sắp xếp theo cột
- Tìm kiếm học sinh
- Lọc theo tuyến
- Export Excel
- Export PDF

Trường hợp ngoại lệ:
Trường hợp 1: Không có dữ liệu
+ Hiển thị thông báo không có dữ liệu
+ Gợi ý chọn tháng khác
+ Kiểm tra hệ thống có hoạt động không

Trường hợp 2: Export file
+ Tạo file Excel hoặc PDF
+ Download về máy
+ Tên file: Diem_danh_[thang]_[nam]

Kết quả sau khi hoàn thành:
- Admin có báo cáo tổng quan
- Biết học sinh nào đi đều
- Biết học sinh nào hay muộn


---


CA SỬ DỤNG 09: CẬP NHẬT VỊ TRÍ XE TỰ ĐỘNG

Người dùng: Hệ thống (chạy tự động)

Mô tả ngắn:
Ứng dụng tài xế tự động gửi vị trí GPS lên server mỗi 5 giây

Điều kiện trước khi thực hiện:
- Tài xế đã bật chế độ Bắt đầu chuyến đi
- GPS điện thoại đang bật
- Có kết nối internet

Các bước thực hiện:
Bước 1: Tài xế bật chế độ Bắt đầu chuyến
Bước 2: Hệ thống bật GPS tracking
Bước 3: Cứ mỗi 5 giây:
+ Lấy vị trí hiện tại từ GPS
+ Lấy tốc độ hiện tại
+ Gửi lên server qua API
Bước 4: Server nhận dữ liệu
Bước 5: Cập nhật vị trí xe trong database
Bước 6: Gửi vị trí mới cho các phụ huynh qua WebSocket
Bước 7: Phụ huynh thấy xe di chuyển trên bản đồ

Trường hợp ngoại lệ:
Trường hợp 1: Không có tín hiệu GPS
+ Sử dụng vị trí cuối cùng
+ Đánh dấu là dữ liệu cũ
+ Thử lấy GPS lại

Trường hợp 2: Không có internet
+ Lưu vị trí vào hàng đợi
+ Gửi hàng loạt khi có mạng
+ Ưu tiên dữ liệu mới nhất

Trường hợp 3: API bị lỗi
+ Thử lại sau 10 giây
+ Tối đa 3 lần thử
+ Ghi log để kiểm tra

Kết quả sau khi hoàn thành:
- Vị trí xe được cập nhật liên tục
- Phụ huynh thấy xe di chuyển real-time
- Có thể lưu lại lịch sử hành trình


---


CA SỬ DỤNG 10: ĐẶT LẠI MẬT KHẨU

Người dùng: Tất cả (Admin, Phụ huynh, Tài xế)

Mô tả ngắn:
Người dùng quên mật khẩu và muốn tạo mật khẩu mới

Điều kiện trước khi thực hiện:
- Đã có tài khoản trong hệ thống
- Email đăng ký còn sử dụng được

Các bước thực hiện:
Bước 1: Ở màn hình đăng nhập, nhấn Quên mật khẩu
Bước 2: Nhập địa chỉ email đã đăng ký
Bước 3: Nhấn nút Gửi link đặt lại
Bước 4: Hệ thống kiểm tra email có tồn tại không
Bước 5: Tạo mã token ngẫu nhiên (có hạn 1 giờ)
Bước 6: Gửi email với link đặt lại mật khẩu
Bước 7: Người dùng mở email và click link
Bước 8: Mở trang Đặt mật khẩu mới
Bước 9: Nhập mật khẩu mới (2 lần)
Bước 10: Nhấn Đặt lại mật khẩu
Bước 11: Hệ thống kiểm tra token còn hạn không
Bước 12: Kiểm tra mật khẩu đủ mạnh không
Bước 13: Mã hóa mật khẩu mới
Bước 14: Cập nhật vào database
Bước 15: Vô hiệu hóa token
Bước 16: Hiển thị thông báo thành công
Bước 17: Chuyển về màn hình đăng nhập

Trường hợp ngoại lệ:
Trường hợp 1: Email không tồn tại
+ Vẫn hiển thị đã gửi email (bảo mật)
+ Không tiết lộ email có tồn tại hay không
+ Không gửi email thật

Trường hợp 2: Link đã hết hạn
+ Hiển thị link hết hạn
+ Gợi ý yêu cầu link mới
+ Redirect về trang quên mật khẩu

Trường hợp 3: Mật khẩu yếu
+ Hiển thị yêu cầu mật khẩu
+ Tối thiểu 8 ký tự
+ Phải có chữ và số
+ Không cho submit

Kết quả sau khi hoàn thành:
- Người dùng có mật khẩu mới
- Có thể đăng nhập bình thường
- Token cũ không dùng được nữa


---


TỔNG KẾT CÁC CA SỬ DỤNG

Danh sách 10 ca sử dụng chính:

CA 01: Đăng nhập hệ thống
Người dùng: Tất cả
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 02: Theo dõi vị trí xe
Người dùng: Phụ huynh
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 03: Điểm danh lên xe
Người dùng: Tài xế
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 04: Điểm danh xuống xe
Người dùng: Tài xế
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 05: Tạo tuyến đường
Người dùng: Admin
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 06: Gán học sinh vào tuyến
Người dùng: Admin
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 07: Gửi thông báo khẩn cấp
Người dùng: Tài xế
Độ ưu tiên: Trung bình
Trạng thái: Đã hoàn thành

CA 08: Xem báo cáo điểm danh
Người dùng: Admin
Độ ưu tiên: Trung bình
Trạng thái: Đang phát triển

CA 09: Cập nhật vị trí tự động
Người dùng: Hệ thống
Độ ưu tiên: Cao
Trạng thái: Đã hoàn thành

CA 10: Đặt lại mật khẩu
Người dùng: Tất cả
Độ ưu tiên: Thấp
Trạng thái: Đang phát triển


Ghi chú về trạng thái:
- Đã hoàn thành: Tính năng đã chạy được
- Đang phát triển: Đang code
- Chưa bắt đầu: Chưa làm
- Đang test: Đang kiểm tra lỗi