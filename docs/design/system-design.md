THIẾT KẾ HỆ THỐNG
SMART SCHOOL BUS TRACKING SYSTEM


1. KIẾN TRÚC TỔNG QUAN

Hệ thống sử dụng kiến trúc 3 tầng:

Tầng 1: Presentation (Giao diện)
- Mobile App cho Phụ huynh (React Native)
- Mobile App cho Tài xế (React Native)
- Web Dashboard cho Admin (React)

Tầng 2: Application (Xử lý nghiệp vụ)
- API Gateway (Express.js)
- Authentication Service (JWT)
- Tracking Service (GPS processing)
- Notification Service (FCM)
- Student Management Service
- Route Management Service
- Report Service

Tầng 3: Data (Lưu trữ dữ liệu)
- MongoDB (database chính)
- Redis (cache)
- AWS S3 (lưu ảnh)

Dịch vụ bên ngoài:
- Google Maps API
- Firebase Cloud Messaging
- SendGrid (gửi email)


2. THIẾT KẾ DATABASE

Database: MongoDB
Lý do chọn: Linh hoạt với dữ liệu địa lý, dễ mở rộng

Danh sách Collections:
- users (người dùng)
- students (học sinh)
- buses (xe buýt)
- routes (tuyến đường)
- attendances (điểm danh)
- notifications (thông báo)
- emergency_alerts (cảnh báo khẩn cấp)
- tracking_history (lịch sử vị trí)


2.1. Collection: users (Người dùng)

Các trường dữ liệu:
- _id: Mã định danh duy nhất
- username: Tên đăng nhập
- email: Địa chỉ email
- password: Mật khẩu (đã mã hóa bcrypt)
- role: Vai trò (admin, parent, driver)
- profile:
  + fullName: Họ tên đầy đủ
  + phone: Số điện thoại
  + avatar: Link ảnh đại diện
  + address: Địa chỉ
- isActive: Tài khoản còn hoạt động không
- isVerified: Đã xác thực email chưa
- lastLogin: Lần đăng nhập cuối
- createdAt: Ngày tạo tài khoản
- updatedAt: Ngày cập nhật cuối

Index (để tìm kiếm nhanh):
- email (unique)
- username (unique)
- role


2.2. Collection: students (Học sinh)

Các trường dữ liệu:
- _id: Mã định danh
- studentCode: Mã học sinh (HS2024001)
- fullName: Họ tên
- dateOfBirth: Ngày sinh
- gender: Giới tính (male, female, other)
- grade: Lớp (Lớp 3A)
- parentId: Mã phụ huynh (liên kết với users)
- routeId: Mã tuyến xe (liên kết với routes)
- pickupStop:
  + stopId: Mã điểm dừng
  + stopName: Tên điểm dừng
  + location: Tọa độ GPS
- qrCode: Mã QR để điểm danh
- nfcId: Mã thẻ NFC (nếu có)
- photo: Link ảnh học sinh
- status: Trạng thái (active, inactive, graduated)
- medicalInfo:
  + allergies: Danh sách dị ứng
  + medications: Thuốc đang dùng
  + emergencyContact: Số điện thoại khẩn cấp
- createdAt: Ngày thêm vào hệ thống
- updatedAt: Ngày cập nhật cuối

Index:
- studentCode (unique)
- parentId
- routeId
- qrCode (unique)
- pickupStop.location (geo index)


2.3. Collection: buses (Xe buýt)

Các trường dữ liệu:
- _id: Mã định danh
- busNumber: Số xe (BUS-001)
- licensePlate: Biển số xe (51A-12345)
- capacity: Số chỗ ngồi (30)
- brand: Hãng xe (Hyundai County)
- year: Năm sản xuất (2022)
- driverId: Mã tài xế (liên kết với users)
- routeId: Mã tuyến đang chạy
- currentLocation:
  + type: Point (để MongoDB hiểu là tọa độ)
  + coordinates: [longitude, latitude]
  + timestamp: Thời gian cập nhật
  + speed: Tốc độ (km/h)
  + heading: Hướng di chuyển (độ)
  + isMoving: Xe đang chạy hay dừng
- status: Trạng thái (active, maintenance, inactive)
- maintenanceSchedule:
  + lastMaintenance: Bảo trì lần cuối
  + nextMaintenance: Bảo trì lần tới
  + mileage: Số km đã chạy
- facilities: Tiện nghi (Điều hòa, GPS, Camera)
- createdAt: Ngày thêm xe
- updatedAt: Ngày cập nhật cuối

Index:
- busNumber (unique)
- licensePlate (unique)
- driverId
- routeId
- currentLocation (geo index)
- status


2.4. Collection: routes (Tuyến đường)

Các trường dữ liệu:
- _id: Mã định danh
- routeName: Tên tuyến (Tuyến 1 - Quận 1 đến Trường)
- routeCode: Mã tuyến (R001)
- type: Loại tuyến (morning, afternoon)
- stops: Danh sách điểm dừng
  + stopId: Mã điểm dừng
  + stopName: Tên điểm
  + location: Tọa độ GPS
  + address: Địa chỉ cụ thể
  + arrivalTime: Giờ đến dự kiến
  + departureTime: Giờ khởi hành
  + order: Thứ tự điểm (1, 2, 3...)
  + estimatedStudents: Số HS dự kiến
- polyline: Đường đi được mã hóa (Google Maps)
- distance: Tổng quãng đường (km)
- estimatedDuration: Thời gian dự kiến (phút)
- assignedBusId: Xe được gán cho tuyến này
- assignedDriverId: Tài xế được gán
- students: Danh sách mã học sinh trên tuyến
- schedule:
  + daysOfWeek: Các ngày trong tuần chạy (1=Thứ 2, 2=Thứ 3...)
  + startDate: Ngày bắt đầu tuyến
  + endDate: Ngày kết thúc tuyến
  + holidays: Các ngày nghỉ lễ
- status: Trạng thái (active, inactive, archived)
- createdAt: Ngày tạo tuyến
- updatedAt: Ngày cập nhật cuối

Index:
- routeCode (unique)
- stops.location (geo index)
- assignedBusId
- students


2.5. Collection: attendances (Điểm danh)

Các trường dữ liệu:
- _id: Mã định danh
- studentId: Mã học sinh
- busId: Mã xe
- routeId: Mã tuyến
- driverId: Mã tài xế
- type: Loại (checkin = lên xe, checkout = xuống xe)
- location:
  + type: Point
  + coordinates: Tọa độ nơi điểm danh
- stopId: Mã điểm dừng
- stopName: Tên điểm dừng
- timestamp: Thời gian điểm danh chính xác
- method: Phương thức (qr_code, nfc, manual)
- photo: Ảnh chụp khi điểm danh (tùy chọn)
- notes: Ghi chú của tài xế
- notificationSent: Đã gửi thông báo chưa
- notificationSentAt: Thời gian gửi thông báo
- createdAt: Ngày tạo record

Index:
- studentId và timestamp (để xem lịch sử)
- busId và timestamp
- routeId và timestamp
- timestamp (sắp xếp theo thời gian)
- type


2.6. Collection: tracking_history (Lịch sử vị trí)

Các trường dữ liệu:
- _id: Mã định danh
- busId: Mã xe
- routeId: Mã tuyến
- location:
  + type: Point
  + coordinates: Tọa độ
- speed: Tốc độ (km/h)
- heading: Hướng di chuyển (độ)
- accuracy: Độ chính xác GPS (mét)
- timestamp: Thời gian ghi nhận
- isOnRoute: Xe có đúng tuyến không
- deviationDistance: Khoảng cách lệch khỏi tuyến (mét)
- createdAt: Ngày tạo

Index:
- busId và timestamp
- routeId và timestamp
- timestamp
- location (geo index)

Tự động xóa:
- Xóa dữ liệu sau 30 ngày (TTL index)


2.7. Collection: notifications (Thông báo)

Các trường dữ liệu:
- _id: Mã định danh
- userId: Người nhận
- type: Loại thông báo (attendance, delay, emergency, route_change, general)
- title: Tiêu đề ngắn
- body: Nội dung chi tiết
- data: Dữ liệu thêm (JSON)
  + studentId
  + busId
  + attendanceId
  + timestamp
- isRead: Đã đọc chưa
- isSent: Đã gửi thành công chưa
- sentAt: Thời gian gửi
- readAt: Thời gian đọc
- fcmToken: Token thiết bị để gửi push
- fcmResponse: Phản hồi từ Firebase
- createdAt: Ngày tạo

Index:
- userId và createdAt (xem theo thời gian)
- isRead
- type


2.8. Collection: emergency_alerts (Cảnh báo khẩn cấp)

Các trường dữ liệu:
- _id: Mã định danh
- busId: Xe báo cáo sự cố
- driverId: Tài xế báo cáo
- routeId: Tuyến đang chạy
- location:
  + type: Point
  + coordinates: Tọa độ chính xác
- address: Địa chỉ đọc được
- timestamp: Thời gian xảy ra
- type: Loại sự cố (accident, breakdown, medical, other)
- description: Mô tả chi tiết
- status: Trạng thái (pending, acknowledged, resolved)
- acknowledgedBy: Admin xác nhận
- acknowledgedAt: Thời gian xác nhận
- resolvedAt: Thời gian giải quyết xong
- notes: Ghi chú thêm
- notifiedUsers: Danh sách người đã được thông báo
- createdAt: Ngày tạo
- updatedAt: Ngày cập nhật cuối

Index:
- busId và createdAt
- status
- timestamp


3. THIẾT KẾ API

Tất cả API sử dụng:
- Protocol: HTTPS
- Format: JSON
- Authentication: JWT Token trong header

Header mẫu:
Authorization: Bearer [token]
Content-Type: application/json


3.1. Authentication APIs (Xác thực)

POST /api/auth/register
Mô tả: Đăng ký tài khoản mới
Body gửi lên:
- email: địa chỉ email
- password: mật khẩu (tối thiểu 8 ký tự)
- fullName: họ tên đầy đủ
- phone: số điện thoại
- role: vai trò (parent hoặc driver)
Phản hồi: Token và thông tin user

POST /api/auth/login
Mô tả: Đăng nhập
Body gửi lên:
- email: địa chỉ email
- password: mật khẩu
Phản hồi: Token và thông tin user

POST /api/auth/logout
Mô tả: Đăng xuất
Yêu cầu: Token hợp lệ
Phản hồi: Thông báo thành công

GET /api/auth/me
Mô tả: Lấy thông tin user hiện tại
Yêu cầu: Token hợp lệ
Phản hồi: Thông tin user

PUT /api/auth/update-profile
Mô tả: Cập nhật thông tin cá nhân
Yêu cầu: Token hợp lệ
Body: Thông tin muốn cập nhật
Phản hồi: Thông tin user mới

POST /api/auth/forgot-password
Mô tả: Quên mật khẩu
Body: email
Phản hồi: Thông báo đã gửi email

POST /api/auth/reset-password/:token
Mô tả: Đặt lại mật khẩu
Body: password mới
Phản hồi: Thông báo thành công


3.2. Student Management APIs (Quản lý học sinh)

GET /api/students
Mô tả: Lấy danh sách học sinh
Yêu cầu: Admin token
Query params:
- page: số trang (mặc định 1)
- limit: số bản ghi (mặc định 20)
- grade: lọc theo lớp
- status: lọc theo trạng thái
Phản hồi: Danh sách học sinh và thông tin phân trang

GET /api/students/:id
Mô tả: Xem chi tiết một học sinh
Yêu cầu: Admin hoặc Parent token
Phản hồi: Thông tin chi tiết học sinh

POST /api/students
Mô tả: Thêm học sinh mới
Yêu cầu: Admin token
Body:
- studentCode: mã học sinh
- fullName: họ tên
- dateOfBirth: ngày sinh
- grade: lớp
- parentId: mã phụ huynh
Phản hồi: Thông tin học sinh vừa tạo

PUT /api/students/:id
Mô tả: Cập nhật thông tin học sinh
Yêu cầu: Admin token
Body: Thông tin muốn cập nhật
Phản hồi: Thông tin học sinh sau khi cập nhật

DELETE /api/students/:id
Mô tả: Xóa học sinh
Yêu cầu: Admin token
Phản hồi: Thông báo đã xóa

GET /api/students/parent/:parentId
Mô tả: Lấy danh sách con của phụ huynh
Yêu cầu: Parent token
Phản hồi: Danh sách học sinh

POST /api/students/:id/assign-route
Mô tả: Gán học sinh vào tuyến
Yêu cầu: Admin token
Body:
- routeId: mã tuyến
- stopId: mã điểm đón
Phản hồi: Thông báo thành công


3.3. Bus Tracking APIs (Theo dõi xe)

GET /api/buses
Mô tả: Lấy danh sách tất cả xe
Yêu cầu: Admin token
Phản hồi: Danh sách xe buýt

GET /api/buses/:id/location
Mô tả: Lấy vị trí xe hiện tại
Yêu cầu: Token hợp lệ
Phản hồi:
- location: tọa độ
- speed: tốc độ
- timestamp: thời gian
- isMoving: đang chạy hay không

POST /api/buses/:id/location
Mô tả: Cập nhật vị trí xe (tài xế gọi mỗi 5 giây)
Yêu cầu: Driver token
Body:
- latitude: vĩ độ
- longitude: kinh độ
- speed: tốc độ
- heading: hướng di chuyển
- accuracy: độ chính xác
- timestamp: thời gian
Phản hồi: Thông báo cập nhật thành công

GET /api/buses/:id/history
Mô tả: Xem lịch sử hành trình
Yêu cầu: Admin token
Query params:
- date: ngày cần xem (YYYY-MM-DD)
- startTime: giờ bắt đầu
- endTime: giờ kết thúc
Phản hồi: Danh sách các điểm đã đi qua

GET /api/buses/route/:routeId
Mô tả: Lấy xe đang chạy trên tuyến
Yêu cầu: Token hợp lệ
Phản hồi: Thông tin xe và vị trí hiện tại


3.4. Attendance APIs (Điểm danh)

POST /api/attendance/checkin
Mô tả: Điểm danh học sinh lên xe
Yêu cầu: Driver token
Body:
- studentId: mã học sinh
- busId: mã xe
- qrCode: mã QR đã quét
- location: tọa độ hiện tại
- stopId: mã điểm dừng
- method: phương thức (qr_code, nfc, manual)
Phản hồi:
- attendance: thông tin điểm danh
- notificationSent: đã gửi thông báo chưa

POST /api/attendance/checkout
Mô tả: Điểm danh học sinh xuống xe
Yêu cầu: Driver token
Body: Tương tự checkin
Phản hồi: Tương tự checkin

GET /api/attendance/student/:id
Mô tả: Xem lịch sử điểm danh của học sinh
Yêu cầu: Parent hoặc Admin token
Query params:
- startDate: ngày bắt đầu
- endDate: ngày kết thúc
Phản hồi: Danh sách điểm danh

GET /api/attendance/bus/:id/today
Mô tả: Xem điểm danh của xe hôm nay
Yêu cầu: Driver hoặc Admin token
Phản hồi: Danh sách học sinh đã điểm danh

GET /api/attendance/report
Mô tả: Báo cáo điểm danh tổng hợp
Yêu cầu: Admin token
Query params:
- month: tháng (1-12)
- year: năm (2024)
- routeId: mã tuyến (tùy chọn)
Phản hồi: Báo cáo chi tiết


3.5. Route Management APIs (Quản lý tuyến)

GET /api/routes
Mô tả: Lấy danh sách tuyến
Yêu cầu: Token hợp lệ
Phản hồi: Danh sách tất cả tuyến

GET /api/routes/:id
Mô tả: Xem chi tiết tuyến
Yêu cầu: Token hợp lệ
Phản hồi: Thông tin chi tiết tuyến

POST /api/routes
Mô tả: Tạo tuyến mới
Yêu cầu: Admin token
Body:
- routeName: tên tuyến
- routeCode: mã tuyến
- type: loại (morning, afternoon)
- stops: danh sách điểm dừng
Phản hồi: Thông tin tuyến vừa tạo

PUT /api/routes/:id
Mô tả: Cập nhật tuyến
Yêu cầu: Admin token
Body: Thông tin muốn cập nhật
Phản hồi: Thông tin tuyến sau khi cập nhật

DELETE /api/routes/:id
Mô tả: Xóa tuyến
Yêu cầu: Admin token
Phản hồi: Thông báo đã xóa

POST /api/routes/:id/optimize
Mô tả: Tối ưu hóa tuyến đường
Yêu cầu: Admin token
Phản hồi: Tuyến đường đã được tối ưu

GET /api/routes/:id/students
Mô tả: Lấy danh sách học sinh trên tuyến
Yêu cầu: Admin hoặc Driver token
Phản hồi: Danh sách học sinh


3.6. Notification APIs (Thông báo)

GET /api/notifications
Mô tả: Lấy danh sách thông báo
Yêu cầu: Token hợp lệ
Query params:
- page: số trang
- limit: số bản ghi
- isRead: lọc đã đọc/chưa đọc
Phản hồi: Danh sách thông báo

PUT /api/notifications/:id/read
Mô tả: Đánh dấu đã đọc
Yêu cầu: Token hợp lệ
Phản hồi: Thông báo thành công

DELETE /api/notifications/:id
Mô tả: Xóa thông báo
Yêu cầu: Token hợp lệ
Phản hồi: Thông báo đã xóa

POST /api/notifications/send
Mô tả: Admin gửi thông báo cho nhiều người
Yêu cầu: Admin token
Body:
- userIds: danh sách người nhận
- title: tiêu đề
- body: nội dung
- type: loại thông báo
Phản hồi: Số lượng gửi thành công


3.7. Emergency Alert APIs (Cảnh báo khẩn cấp)

POST /api/emergency
Mô tả: Tạo cảnh báo khẩn cấp
Yêu cầu: Driver token
Body:
- busId: mã xe
- location: tọa độ hiện tại
- type: loại sự cố
- description: mô tả
Phản hồi: Thông tin cảnh báo vừa tạo

GET /api/emergency
Mô tả: Xem danh sách cảnh báo
Yêu cầu: Admin token
Query params:
- status: lọc theo trạng thái
- date: lọc theo ngày
Phản hồi: Danh sách cảnh báo

PUT /api/emergency/:id/acknowledge
Mô tả: Admin xác nhận đã nhận
Yêu cầu: Admin token
Body:
- notes: ghi chú
Phản hồi: Thông báo thành công

PUT /api/emergency/:id/resolve
Mô tả: Đánh dấu đã giải quyết xong
Yêu cầu: Admin token
Body:
- notes: ghi chú cách giải quyết
Phản hồi: Thông báo thành công


3.8. Report APIs (Báo cáo)

GET /api/reports/attendance
Mô tả: Báo cáo điểm danh
Yêu cầu: Admin token
Query params:
- month: tháng
- year: năm
- routeId: mã tuyến (tùy chọn)
- format: excel hoặc pdf
Phản hồi: File báo cáo hoặc dữ liệu JSON

GET /api/reports/distance
Mô tả: Báo cáo quãng đường xe đã chạy
Yêu cầu: Admin token
Query params:
- startDate: ngày bắt đầu
- endDate: ngày kết thúc
- busId: mã xe (tùy chọn)
Phản hồi: Thống kê quãng đường

GET /api/reports/late-students
Mô tả: Báo cáo học sinh thường xuyên muộn
Yêu cầu: Admin token
Query params:
- month: tháng
- year: năm
- threshold: số lần muộn tối thiểu (mặc định 5)
Phản hồi: Danh sách học sinh


4. LUỒNG DỮ LIỆU CHÍNH

4.1. Luồng theo dõi xe real-time

Bước 1: Tài xế bật chế độ Bắt đầu chuyến
Bước 2: App tài xế lấy GPS mỗi 5 giây
Bước 3: Gửi tọa độ lên server qua API
Bước 4: Server lưu vào database
Bước 5: Server broadcast qua WebSocket
Bước 6: App phụ huynh nhận dữ liệu
Bước 7: Cập nhật marker trên bản đồ

Công nghệ sử dụng:
- GPS: React Native Geolocation
- API: HTTPS REST
- Real-time: Socket.io WebSocket
- Map: Google Maps SDK


4.2. Luồng điểm danh học sinh

Bước 1: Học sinh đưa thẻ QR
Bước 2: Tài xế quét bằng camera
Bước 3: App nhận dạng mã QR
Bước 4: Gửi API check-in với tọa độ hiện tại
Bước 5: Server validate mã học sinh
Bước 6: Lưu attendance record
Bước 7: Trigger notification service
Bước 8: Gửi push notification qua FCM
Bước 9: Phụ huynh nhận thông báo trên điện thoại

Xử lý offline:
- Nếu không có mạng, lưu vào AsyncStorage
- Khi có mạng trở lại, tự động sync
- Đồng bộ theo thứ tự thời gian


4.3. Luồng tạo tuyến đường

Bước 1: Admin mở form tạo tuyến
Bước 2: Nhập tên tuyến
Bước 3: Click trên Google Maps để đánh dấu điểm
Bước 4: Google Places API gợi ý địa chỉ
Bước 5: Nhập thời gian cho mỗi điểm
Bước 6: Nhấn Xem trước
Bước 7: Google Directions API tính đường đi
Bước 8: Hiển thị polyline trên bản đồ
Bước 9: Admin xác nhận Lưu
Bước 10: Gửi API tạo tuyến
Bước 11: Server lưu vào database


5. BẢO MẬT VÀ XÁC THỰC

5.1. JWT Token

Cấu trúc token:
- Header: Thuật toán HS256
- Payload: userId, role, exp (thời gian hết hạn)
- Signature: Secret key từ biến môi trường

Thời gian sống:
- Access token: 24 giờ
- Refresh token: 30 ngày

Lưu trữ:
- Mobile: SecureStore (encrypted)
- Web: httpOnly cookie


5.2. Mã hóa mật khẩu

Thuật toán: bcrypt
Salt rounds: 10
Không bao giờ lưu password dạng plain text


5.3. HTTPS

Tất cả giao tiếp phải qua HTTPS
SSL Certificate từ Let's Encrypt (miễn phí)
Không cho phép HTTP


5.4. Validate input

Tất cả input từ client đều được validate
Sử dụng thư viện: express-validator
Chống SQL Injection, XSS, CSRF


5.5. Rate Limiting

Giới hạn số request mỗi IP:
- Login: 5 lần / 15 phút
- API thường: 100 lần / 15 phút
- Upload file: 10 lần / giờ

Sử dụng: express-rate-limit


6. HIỆU NĂNG VÀ TỐI ƯU

6.1. Caching với Redis

Cache các dữ liệu:
- Thông tin user (5 phút)
- Danh sách tuyến (10 phút)
- Vị trí xe (10 giây)

Strategy: Cache-aside pattern


6.2. Database Indexing

Tạo index cho các trường hay query:
- users: email, username
- students: studentCode, parentId
- buses: busNumber, currentLocation
- attendances: studentId + timestamp


6.3. Pagination

Tất cả API trả về danh sách đều có phân trang
Mặc định: 20 bản ghi / trang
Tối đa: 100 bản ghi / trang


6.4. Compression

Nén response bằng gzip
Giảm 70% kích thước dữ liệu truyền tải


6.5. CDN cho static files

Sử dụng CloudFlare CDN miễn phí
Cache ảnh, CSS, JavaScript


7. GIÁM SÁT VÀ LOGGING

7.1. Logging

Các level log:
- error: Lỗi nghiêm trọng
- warn: Cảnh báo
- info: Thông tin chung
- debug: Debug khi phát triển

Lưu log:
- File: logs/app.log
- Rotate hàng ngày
- Giữ log 30 ngày


7.2. Monitoring

Giám sát:
- Server uptime
- Response time trung bình
- Số lượng request
- Tỷ lệ lỗi

Tools: PM2 monitoring (miễn phí)


7.3. Error Tracking

Sử dụng Sentry (free tier)
Tự động báo cáo lỗi
Thông báo qua email khi có lỗi nghiêm trọng


8. TRIỂN KHAI

8.1. Môi trường

Development:
- Local machine
- MongoDB local
- Port: 3000

Staging:
- Server test
- MongoDB Atlas free tier
- Domain: staging.ssb.com

Production:
- VPS hoặc Cloud (AWS, DigitalOcean)
- MongoDB Atlas
- Domain: app.ssb.com


8.2. CI/CD

Sử dụng GitHub Actions
Tự động test khi push code
Tự động deploy khi merge vào main branch


8.3. Backup

Database backup:
- Tự động hàng ngày lúc 2 giờ sáng
- Lưu trữ 30 ngày
- Có thể restore trong 1 giờ

Code backup:
- Git repository
- Push lên GitHub định kỳ
