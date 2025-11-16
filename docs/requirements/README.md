1. TỔNG QUAN DỰ ÁN

Hệ thống theo dõi xe buýt trường học thông minh được phát triển với các mục tiêu:
- Theo dõi vị trí xe buýt theo thời gian thực
- Quản lý thông tin học sinh đi xe buýt
- Thông báo tự động cho phụ huynh
- Tối ưu hóa tuyến đường và quản lý tài xế
- Đảm bảo an toàn cho học sinh


2. YÊU CẦU CHỨC NĂNG

2.1. Quản lý người dùng

RF-01: Đăng ký và đăng nhập
- Hỗ trợ 3 loại tài khoản: Admin, Phụ huynh, Tài xế
- Đăng nhập bằng email và mật khẩu
- Xác thực qua email sau khi đăng ký

RF-02: Phân quyền người dùng
- Admin có toàn quyền quản lý hệ thống
- Phụ huynh chỉ xem thông tin con em
- Tài xế chỉ quản lý xe được gán

RF-03: Quản lý thông tin cá nhân
- Cập nhật họ tên, số điện thoại
- Thay đổi ảnh đại diện
- Đổi mật khẩu

RF-04: Khôi phục mật khẩu
- Gửi link đặt lại mật khẩu qua email
- Link có hiệu lực trong 1 giờ


2.2. Theo dõi xe buýt

RF-05: Hiển thị vị trí xe theo thời gian thực
- Hiển thị trên bản đồ Google Maps
- Cập nhật vị trí mỗi 5 giây
- Hiển thị icon xe di chuyển mượt mà

RF-06: Lưu trữ lịch sử hành trình
- Lưu lại toàn bộ vị trí xe trong 30 ngày
- Có thể xem lại hành trình theo ngày
- Hiển thị thời gian bắt đầu và kết thúc

RF-07: Cảnh báo xe đi sai tuyến
- Phát hiện khi xe lệch khỏi tuyến trên 500 mét
- Gửi thông báo cho Admin ngay lập tức
- Hiển thị cảnh báo màu đỏ trên bản đồ

RF-08: Hiển thị thời gian dự kiến
- Tính toán thời gian đến điểm đón tiếp theo
- Hiển thị cho phụ huynh biết xe còn bao lâu đến
- Cập nhật liên tục theo tình hình giao thông

RF-09: Hiển thị trạng thái xe
- Hiển thị tốc độ hiện tại (km/h)
- Trạng thái: đang chạy hoặc đang dừng
- Số học sinh hiện tại trên xe


2.3. Quản lý học sinh

RF-10: Thêm thông tin học sinh mới
- Nhập họ tên, ngày sinh, lớp
- Gán phụ huynh cho học sinh
- Tạo mã QR riêng cho mỗi học sinh

RF-11: Chỉnh sửa thông tin học sinh
- Cập nhật thông tin cá nhân
- Thay đổi ảnh học sinh
- Cập nhật thông tin y tế (dị ứng, thuốc đang dùng)

RF-12: Xóa học sinh khỏi hệ thống
- Chuyển trạng thái thành không hoạt động
- Lưu lại lịch sử để tra cứu
- Không xóa vĩnh viễn khỏi database

RF-13: Gán học sinh vào tuyến xe
- Chọn tuyến xe cho học sinh
- Chọn điểm đón cụ thể trên tuyến
- Cập nhật thông tin cho phụ huynh

RF-14: Điểm danh học sinh lên xe
- Tài xế quét mã QR của học sinh
- Ghi nhận thời gian và vị trí
- Gửi thông báo cho phụ huynh ngay lập tức

RF-15: Điểm danh học sinh xuống xe
- Tương tự như điểm danh lên xe
- Xác nhận học sinh đã xuống an toàn
- Thông báo địa chỉ xuống xe cho phụ huynh

RF-16: Cảnh báo học sinh không lên xe
- Kiểm tra nếu học sinh không điểm danh trong 10 phút
- Gửi thông báo hỏi phụ huynh
- Ghi nhận vắng mặt trong hệ thống

RF-17: Xuất báo cáo điểm danh
- Báo cáo theo ngày, tuần, tháng
- Thống kê số lần đi xe
- Export file Excel hoặc PDF


2.4. Quản lý tuyến đường

RF-18: Tạo tuyến đường mới
- Đánh dấu các điểm đón trên bản đồ
- Nhập thời gian dự kiến cho mỗi điểm
- Đặt tên cho tuyến đường

RF-19: Chỉnh sửa tuyến đường
- Thêm hoặc bớt điểm dừng
- Thay đổi thứ tự các điểm
- Cập nhật thời gian

RF-20: Xóa tuyến đường
- Chỉ được xóa nếu không có học sinh nào
- Chuyển sang trạng thái lưu trữ
- Giữ lại lịch sử để tham khảo

RF-21: Gán xe và tài xế cho tuyến
- Chọn xe buýt phù hợp
- Chọn tài xế phụ trách
- Lên lịch chạy (sáng/chiều, thứ mấy)

RF-22: Tối ưu hóa tuyến đường
- Tính toán tuyến ngắn nhất
- Giảm thời gian di chuyển
- Sử dụng Google Directions API


2.5. Thông báo

RF-23: Gửi thông báo tự động
- Thông báo khi học sinh lên xe
- Thông báo khi học sinh xuống xe
- Thông báo xe sắp đến điểm đón

RF-24: Thông báo khẩn cấp
- Tài xế nhấn nút SOS khi có sự cố
- Gửi ngay cho Admin và tất cả phụ huynh trên xe
- Hiển thị vị trí chính xác của xe

RF-25: Thông báo thay đổi lịch trình
- Thông báo khi xe chạy muộn
- Thông báo khi thay đổi tuyến đường
- Thông báo nghỉ xe (ngày lễ)

RF-26: Quản lý lịch sử thông báo
- Xem lại các thông báo đã nhận
- Đánh dấu đã đọc/chưa đọc
- Tìm kiếm thông báo theo ngày


2.6. Báo cáo và thống kê

RF-27: Báo cáo điểm danh theo tháng
- Tổng số ngày đi học
- Số ngày có mặt của mỗi học sinh
- Tỷ lệ phần trăm tham gia

RF-28: Thống kê quãng đường
- Tổng số km mỗi xe đã chạy
- Quãng đường trung bình mỗi ngày
- So sánh giữa các tuyến

RF-29: Báo cáo học sinh đi muộn
- Danh sách học sinh thường xuyên muộn
- Thời gian trung bình đi muộn
- Gửi thông báo nhắc nhở phụ huynh

RF-30: Export báo cáo
- Xuất file Excel
- Xuất file PDF
- Gửi báo cáo qua email


3. YÊU CẦU PHI CHỨC NĂNG

3.1. Hiệu năng

NFR-01: Tốc độ cập nhật vị trí
- Vị trí xe được cập nhật mỗi 5 giây
- Không được chậm trễ quá 10 giây
- Sử dụng WebSocket để truyền dữ liệu nhanh

NFR-02: Thời gian phản hồi API
- Mọi yêu cầu API phải phản hồi trong 2 giây
- Truy vấn database tối đa 1 giây
- Sử dụng cache Redis để tăng tốc

NFR-03: Hỗ trợ đồng thời nhiều xe
- Hệ thống phải xử lý được 100 xe cùng lúc
- Mỗi xe có 30 phụ huynh đang theo dõi
- Tổng cộng hỗ trợ 3000 kết nối đồng thời

NFR-04: Thời gian khởi động ứng dụng
- App mobile khởi động trong 3 giây
- Màn hình chính hiển thị trong 1 giây sau khi khởi động
- Bản đồ load trong 2 giây

NFR-05: Tiêu thụ pin điện thoại
- Chế độ tracking tốn tối đa 10% pin mỗi giờ
- Tài xế có thể dùng app cả ngày
- Tự động giảm tần suất cập nhật khi pin yếu


3.2. Bảo mật

NFR-06: Mã hóa mật khẩu
- Sử dụng thuật toán bcrypt
- Salt rounds tối thiểu 10 vòng
- Không lưu mật khẩu dạng văn bản thuần

NFR-07: Xác thực bằng JWT Token
- Token có thời hạn 24 giờ
- Refresh token có thời hạn 30 ngày
- Token được mã hóa và signed

NFR-08: Bắt buộc HTTPS
- Tất cả giao tiếp phải qua HTTPS
- Không cho phép HTTP
- SSL Certificate hợp lệ

NFR-09: Kiểm tra dữ liệu đầu vào
- Validate tất cả input từ người dùng
- Chống SQL Injection (dù dùng NoSQL)
- Chống XSS attack

NFR-10: Xác thực 2 lớp cho Admin
- Yêu cầu mã OTP khi đăng nhập
- Gửi mã qua email hoặc SMS
- Tùy chọn, không bắt buộc

NFR-11: Tự động đăng xuất
- Đăng xuất sau 30 phút không hoạt động
- Xóa token khỏi bộ nhớ
- Yêu cầu đăng nhập lại


3.3. Khả dụng

NFR-12: Uptime của hệ thống
- Hoạt động 99.5% thời gian
- Chỉ được downtime tối đa 3.6 giờ mỗi tháng
- Bảo trì định kỳ vào lúc 2 giờ sáng

NFR-13: Backup dữ liệu tự động
- Backup database hàng ngày lúc 2 giờ sáng
- Lưu backup trong 30 ngày
- Có thể restore trong 1 giờ nếu cần

NFR-14: Xử lý mất kết nối
- Tự động retry khi mất mạng
- Thử lại tối đa 3 lần
- Thông báo người dùng nếu thất bại

NFR-15: Chế độ Offline
- Lưu dữ liệu quan trọng trên điện thoại
- Tự động đồng bộ khi có mạng trở lại
- Ưu tiên điểm danh và thông báo khẩn cấp


3.4. Khả năng sử dụng

NFR-16: Hỗ trợ đa ngôn ngữ
- Tiếng Việt là ngôn ngữ chính
- Hỗ trợ tiếng Anh
- Dễ dàng thêm ngôn ngữ mới

NFR-17: Thiết kế responsive
- Ưu tiên giao diện mobile
- Hiển thị tốt trên màn hình từ 4 inch đến 7 inch
- Hỗ trợ cả màn hình dọc và ngang

NFR-18: Tuân thủ chuẩn thiết kế
- Android: Material Design
- iOS: Human Interface Guidelines
- Nhất quán trên cả hai nền tảng

NFR-19: Loading và Progress
- Hiển thị loading spinner khi xử lý
- Progress bar cho tác vụ lâu
- Không để người dùng chờ mà không biết gì

NFR-20: Thông báo lỗi rõ ràng
- Mô tả lỗi dễ hiểu cho người dùng thường
- Gợi ý cách khắc phục
- Không hiển thị lỗi kỹ thuật cho user


3.5. Khả năng mở rộng

NFR-21: Mở rộng theo chiều ngang
- Có thể thêm server khi cần
- Load balancer phân phối tải
- Không bị giới hạn bởi 1 server

NFR-22: Database có thể sharding
- Chia nhỏ database khi dữ liệu lớn
- Mỗi shard xử lý một phần dữ liệu
- Transparent với application layer

NFR-23: Xử lý bất đồng bộ
- Sử dụng message queue cho task nặng
- Redis hoặc RabbitMQ
- Tránh block main thread

NFR-24: Kiến trúc Microservices
- Tách các module lớn thành service riêng
- Auth Service, Tracking Service, Notification Service
- Dễ dàng scale từng service độc lập


3.6. Tương thích

NFR-25: Hỗ trợ Android
- Android 8.0 trở lên (API level 26+)
- Chiếm 95% thiết bị Android hiện tại
- Test trên Samsung, Oppo, Xiaomi

NFR-26: Hỗ trợ iOS
- iOS 12.0 trở lên
- Chiếm 98% thiết bị iPhone hiện tại
- Test trên iPhone 6S trở lên

NFR-27: Hỗ trợ trình duyệt
- Chrome (phiên bản mới nhất)
- Firefox (phiên bản mới nhất)
- Safari 12+ (cho macOS)
- Không hỗ trợ Internet Explorer


3.7. Bảo trì

NFR-28: Code Coverage
- Tối thiểu 70% code được test
- Unit test cho mọi function quan trọng
- Integration test cho API endpoints

NFR-29: Logging đầy đủ
- Ghi log mọi lỗi (error level)
- Ghi log cảnh báo (warn level)
- Ghi log thông tin (info level)
- Ghi log debug khi cần troubleshoot

NFR-30: Documentation
- API documentation bằng Swagger
- Tài liệu cài đặt cho developer
- User manual cho người dùng cuối


4. RÀNG BUỘC HỆ THỐNG

4.1. Công nghệ bắt buộc

Frontend Mobile:
- React Native phiên bản 0.72 trở lên
- Sử dụng TypeScript để tăng độ an toàn
- React Navigation cho điều hướng

Backend:
- Node.js phiên bản 18 trở lên
- Express.js cho REST API
- Socket.io cho real-time communication

Database:
- MongoDB phiên bản 6.0 trở lên
- Mongoose cho ODM
- Redis cho caching

Maps và Location:
- Google Maps API
- Google Directions API
- Google Places API

Notification:
- Firebase Cloud Messaging (FCM)
- Hỗ trợ cả Android và iOS

File Storage:
- AWS S3 hoặc Firebase Storage
- Lưu ảnh đại diện, ảnh học sinh


4.2. Phần cứng yêu cầu

Cho xe buýt:
- Thiết bị GPS chính xác trong phạm vi 10 mét
- Cập nhật vị trí mỗi 5 giây
- Có pin dự phòng khi mất điện

Cho tài xế:
- Smartphone Android 8.0+ hoặc iOS 12+
- Camera hoạt động tốt để quét QR
- GPS được bật
- Kết nối internet 3G/4G ổn định

Cho phụ huynh:
- Smartphone Android 8.0+ hoặc iOS 12+
- Kết nối internet
- Dung lượng pin đủ dùng cả ngày


4.3. Pháp lý và quyền riêng tư

Bảo vệ dữ liệu cá nhân:
- Tuân thủ luật bảo vệ dữ liệu cá nhân Việt Nam
- Tuân thủ GDPR nếu có người dùng từ EU
- Không chia sẻ dữ liệu với bên thứ ba

Xin phép phụ huynh:
- Phụ huynh phải đồng ý điều khoản trước khi sử dụng
- Giải thích rõ dữ liệu nào được thu thập
- Phụ huynh có quyền yêu cầu xóa dữ liệu

Chính sách quyền riêng tư:
- Có trang Privacy Policy rõ ràng
- Có trang Terms of Service
- Cập nhật khi có thay đổi


4.4. Ngân sách và thời gian

Thời gian phát triển:
- 4 tháng (1 học kỳ)
- Tháng 1: Phân tích và thiết kế
- Tháng 2-3: Phát triển
- Tháng 4: Testing và triển khai

Quy mô team:
- 3 đến 5 developer
- 1 Project Manager (giảng viên)
- 1 QA Tester

Ngân sách:
- Sử dụng free tier của các dịch vụ cloud
- Google Maps API: 200 USD credit/tháng (miễn phí)
- Firebase: Free tier (đủ cho dự án nhỏ)
- MongoDB Atlas: Free tier 512 MB


5. CÁC BÊN LIÊN QUAN

5.1. Người dùng cuối

Admin (Quản trị viên):
- Nhân viên văn phòng của trường
- Quản lý toàn bộ hệ thống
- Tạo tuyến đường, gán học sinh
- Xem báo cáo và thống kê

Phụ huynh:
- Ba mẹ hoặc người giám hộ học sinh
- Theo dõi vị trí xe và con em
- Nhận thông báo
- Xem lịch sử điểm danh

Tài xế:
- Người lái xe buýt
- Điểm danh học sinh
- Cập nhật vị trí xe
- Gửi cảnh báo khẩn cấp nếu cần

Học sinh:
- Sử dụng gián tiếp (qua mã QR)
- Không cần đăng nhập vào hệ thống


5.2. Bên phát triển

Team developer:
- Phát triển frontend và backend
- Viết test cases
- Sửa bugs

Product Owner:
- Giảng viên hướng dẫn
- Đưa ra yêu cầu
- Review tiến độ

QA Tester:
- Test chức năng
- Báo cáo bugs
- Verify fixes


6. RỦI RO VÀ GIẢI PHÁP

Rủi ro 1: Mất tín hiệu GPS trong hầm hoặc đường hầm
Mức độ: Cao
Giải pháp:
- Sử dụng vị trí cuối cùng biết được
- Hiển thị thông báo đang cập nhật
- Tự động kết nối lại khi có tín hiệu

Rủi ro 2: Quá tải server khi nhiều xe cùng gửi GPS
Mức độ: Trung bình
Giải pháp:
- Sử dụng load balancer
- Cache dữ liệu bằng Redis
- Rate limiting cho mỗi xe

Rủi ro 3: Phụ huynh không cài đặt ứng dụng
Mức độ: Cao
Giải pháp:
- Cung cấp phiên bản web
- Gửi SMS backup khi không có app
- Hướng dẫn cài đặt chi tiết

Rủi ro 4: Pin điện thoại tài xế hết giữa chừng
Mức độ: Cao
Giải pháp:
- Chế độ tiết kiệm pin
- Cảnh báo khi pin dưới 20%
- Hướng dẫn mang sạc dự phòng

Rủi ro 5: Lỗi kết nối mạng khi điểm danh
Mức độ: Trung bình
Giải pháp:
- Chế độ offline: lưu local
- Tự động đồng bộ khi có mạng
- Thông báo cho tài xế biết trạng thái

Rủi ro 6: Học sinh mất thẻ QR code
Mức độ: Thấp
Giải pháp:
- Cho phép điểm danh thủ công
- In lại thẻ mới nhanh chóng
- Backup mã QR trong app phụ huynh


7. TIÊU CHÍ CHẤP NHẬN

Chức năng:
- Triển khai đủ 30 yêu cầu chức năng
- Mọi tính năng hoạt động đúng
- Không có chức năng bị thiếu

Chất lượng:
- Pass tối thiểu 80% test cases
- Không có lỗi nghiêm trọng (critical bug)
- Lỗi nhỏ được ghi nhận và sửa sau

Hiệu năng:
- Đáp ứng tất cả yêu cầu phi chức năng
- API phản hồi dưới 2 giây
- App khởi động dưới 3 giây

Tài liệu:
- Tài liệu kỹ thuật đầy đủ
- Hướng dẫn sử dụng cho người dùng
- API documentation bằng Swagger

Demo:
- Demo thành công trước giảng viên
- Demo thành công trước khoa
- Nhận feedback tích cực


8. PHỤ LỤC

Thuật ngữ viết tắt:
- SSB: Smart School Bus
- API: Application Programming Interface
- GPS: Global Positioning System
- QR: Quick Response
- NFC: Near Field Communication
- JWT: JSON Web Token
- FCM: Firebase Cloud Messaging
- UI/UX: User Interface / User Experience
- HTTPS: Hypertext Transfer Protocol Secure
- ODM: Object Document Mapper

Tài liệu tham khảo:
- Google Maps API Documentation
- React Native Documentation
- MongoDB Documentation
- Express.js Documentation
