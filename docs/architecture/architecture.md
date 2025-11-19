KIẾN TRÚC HỆ THỐNG
SMART SCHOOL BUS TRACKING SYSTEM


1. TỔNG QUAN KIẾN TRÚC

Hệ thống SSB sử dụng kiến trúc Layered Architecture (kiến trúc phân tầng)

Lý do chọn:
- Dễ hiểu và triển khai
- Phù hợp với quy mô dự án nhỏ/vừa
- Dễ bảo trì và mở rộng
- Team nhỏ có thể làm việc hiệu quả


2. CÁC TẦNG CHÍNH

2.1. Presentation Layer (Tầng giao diện)

Nhiệm vụ:
- Hiển thị thông tin cho người dùng
- Nhận input từ người dùng
- Gọi API để lấy/gửi dữ liệu

Các thành phần:
- Mobile App Phụ huynh (React Native)
- Mobile App Tài xế (React Native)
- Web Dashboard Admin (React)

Công nghệ:
- React Native 0.72+ cho mobile
- React 18+ cho web
- TypeScript để tăng độ an toàn code
- React Navigation cho điều hướng
- Axios để gọi API
- Socket.io-client cho real-time


2.2. API Gateway Layer (Tầng cổng API)

Nhiệm vụ:
- Tiếp nhận tất cả request từ client
- Xác thực người dùng (JWT)
- Phân quyền theo vai trò
- Rate limiting
- Routing đến service phù hợp

Công nghệ:
- Express.js
- JWT cho authentication
- express-rate-limit
- helmet cho security headers
- cors để cho phép cross-origin


2.3. Business Logic Layer (Tầng xử lý nghiệp vụ)

Nhiệm vụ:
- Xử lý logic nghiệp vụ
- Validate dữ liệu
- Tính toán
- Gọi external services

Các services:

Auth Service:
- Đăng ký, đăng nhập
- Quên mật khẩu
- Quản lý token

Tracking Service:
- Nhận GPS từ xe
- Lưu vị trí vào database
- Broadcast qua WebSocket
- Kiểm tra xe có đúng tuyến không

Notification Service:
- Gửi push notification qua FCM
- Gửi email qua SendGrid
- Gửi SMS (tùy chọn)
- Quản lý template thông báo

Student Management Service:
- CRUD học sinh
- Gán học sinh vào tuyến
- Quản lý thông tin phụ huynh

Route Management Service:
- CRUD tuyến đường
- Tính toán tuyến tối ưu
- Gán xe và tài xế

Attendance Service:
- Xử lý điểm danh
- Validate QR code
- Trigger notification

Report Service:
- Tạo báo cáo điểm danh
- Báo cáo quãng đường
- Export Excel/PDF


2.4. Data Access Layer (Tầng truy cập dữ liệu)

Nhiệm vụ:
- Giao tiếp với database
- CRUD operations
- Query optimization

Công nghệ:
- Mongoose ODM cho MongoDB
- Query builder
- Transaction management


2.5. Data Layer (Tầng dữ liệu)

Các thành phần:

MongoDB (Primary Database):
- Lưu trữ dữ liệu chính
- Collections: users, students, buses, routes, etc.
- Replication cho high availability

Redis (Cache):
- Cache dữ liệu thường xuyên truy cập
- Session management
- Rate limiting counters
- Pub/Sub cho real-time

AWS S3 (File Storage):
- Lưu ảnh đại diện
- Lưu ảnh học sinh
- Lưu file báo cáo
- CDN integration


2.6. External Services Layer (Tầng dịch vụ bên ngoài)

Google Maps API:
- Maps SDK để hiển thị bản đồ
- Directions API để tính đường đi
- Places API để tìm kiếm địa chỉ
- Geocoding API để chuyển đổi tọa độ/địa chỉ

Firebase Cloud Messaging:
- Gửi push notification
- Hỗ trợ cả Android và iOS
- Free tier: unlimited messages

SendGrid:
- Gửi email xác thực
- Gửi email quên mật khẩu
- Gửi báo cáo tự động
- Free tier: 100 emails/ngày


3. COMMUNICATION PATTERNS (Mô hình giao tiếp)

3.1. Request-Response (HTTP/HTTPS)

Sử dụng cho:
- CRUD operations
- Authentication
- Data queries

Đặc điểm:
- Synchronous (đồng bộ)
- Client chờ response
- RESTful API standard


3.2. WebSocket (Real-time)

Sử dụng cho:
- Cập nhật vị trí xe real-time
- Thông báo tức thì
- Chat support (nếu có)

Đặc điểm:
- Bidirectional (2 chiều)
- Persistent connection
- Low latency


3.3. Message Queue (Bất đồng bộ)

Sử dụng cho:
- Gửi email
- Tạo báo cáo lớn
- Xử lý ảnh
- Background jobs

Đặc điểm:
- Asynchronous (bất đồng bộ)
- Không block main thread
- Retry mechanism

Công nghệ: Redis Bull Queue


4. DATA FLOW CHI TIẾT

4.1. Luồng đăng nhập

Client:
Bước 1: User nhập email và password
Bước 2: Gửi POST request đến /api/auth/login
Bước 3: Chờ response

Server:
Bước 4: API Gateway nhận request
Bước 5: Chuyển đến Auth Service
Bước 6: Auth Service tìm user trong database
Bước 7: So sánh password hash
Bước 8: Tạo JWT token nếu đúng
Bước 9: Trả về token và user info

Client:
Bước 10: Lưu token vào SecureStore
Bước 11: Chuyển đến màn hình chính


4.2. Luồng tracking real-time

Driver App (mỗi 5 giây):
Bước 1: Lấy current location từ GPS
Bước 2: POST /api/buses/:id/location
Bước 3: Body gồm: lat, lng, speed, timestamp

Server:
Bước 4: API Gateway xác thực driver token
Bước 5: Tracking Service nhận data
Bước 6: Validate dữ liệu (tọa độ hợp lệ)
Bước 7: Lưu vào MongoDB (buses collection)
Bước 8: Lưu vào tracking_history
Bước 9: Kiểm tra xe có đúng tuyến không
Bước 10: Broadcast qua WebSocket Server
Bước 11: Redis Pub/Sub distribute đến các server instances

Parent App:
Bước 12: WebSocket client đang lắng nghe
Bước 13: Nhận location update
Bước 14: Cập nhật marker trên Google Map
Bước 15: Smooth animation di chuyển marker


4.3. Luồng điểm danh

Driver App:
Bước 1: Tài xế mở camera quét QR
Bước 2: Quét được mã QR_HS2024001
Bước 3: Lấy GPS location hiện tại
Bước 4: POST /api/attendance/checkin
Bước 5: Body: studentId, busId, qrCode, location

Server:
Bước 6: API Gateway xác thực
Bước 7: Attendance Service validate:
+ QR code có tồn tại không
+ Học sinh có thuộc tuyến này không
+ Có đang trong giờ đón không
+ Đã điểm danh chưa
Bước 8: Nếu OK, lưu attendance record
Bước 9: Trigger Notification Service
Bước 10: Notification Service lấy parentId
Bước 11: Lấy FCM token của parent
Bước 12: Tạo notification message
Bước 13: Gửi qua Firebase FCM
Bước 14: FCM push đến Parent device

Driver App:
Bước 15: Nhận response thành công
Bước 16: Hiển thị tick xanh bên tên học sinh

Parent App:
Bước 17: Nhận push notification
Bước 18: Hiển thị: "Con bạn đã lên xe lúc 6:35 AM"


4.4. Luồng tạo báo cáo

Admin Web:
Bước 1: Admin chọn tháng 11/2024
Bước 2: Click "Xem báo cáo điểm danh"
Bước 3: GET /api/reports/attendance?month=11&year=2024

Server:
Bước 4: API Gateway xác thực admin token
Bước 5: Report Service nhận request
Bước 6: Query attendances collection
Bước 7: Query students collection
Bước 8: Join data
Bước 9: Tính toán:
+ Tổng ngày đi học trong tháng
+ Số ngày mỗi HS có mặt
+ Tỷ lệ phần trăm
+ Số lần muộn
Bước 10: Format dữ liệu
Bước 11: Cache kết quả trong Redis (5 phút)
Bước 12: Trả về JSON

Admin Web:
Bước 13: Nhận data
Bước 14: Render table
Bước 15: Admin click "Export Excel"
Bước 16: POST /api/reports/attendance/export

Server:
Bước 17: Report Service tạo background job
Bước 18: Job worker tạo file Excel
Bước 19: Upload file lên S3
Bước 20: Trả về link download
Bước 21: Link có hiệu lực 1 giờ

Admin Web:
Bước 22: Tự động download file


5. SCALABILITY (Khả năng mở rộng)

5.1. Horizontal Scaling

Hiện tại:
- 1 server chạy tất cả

Khi mở rộng:
- Load Balancer (Nginx)
- Nhiều server instances
- Sticky session cho WebSocket

Cách thực hiện:
- Docker containerization
- Kubernetes orchestration
- Auto-scaling based on CPU/Memory


5.2. Database Scaling

Hiện tại:
- 1 MongoDB instance

Khi mở rộng:
- Replica Set (3 nodes)
  + 1 Primary
  + 2 Secondary
- Automatic failover
- Read từ Secondary để giảm tải Primary

Khi dữ liệu rất lớn:
- Sharding by routeId
- Mỗi shard xử lý một vùng địa lý


5.3. Caching Strategy

Level 1: Application Cache (Memory)
- Cache trong Node.js process
- Dữ liệu nhỏ, thường xuyên dùng
- Thời gian sống: 1-5 phút

Level 2: Redis Cache
- Cache dữ liệu lớn hơn
- Chia sẻ giữa nhiều server instances
- Thời gian sống: 5-60 phút

Level 3: CDN Cache
- Cache static files (ảnh, CSS, JS)
- Distributed globally
- Thời gian sống: 1 ngày - 1 tháng


5.4. Message Queue

Hiện tại:
- Xử lý đồng bộ

Khi mở rộng:
- Redis Bull Queue
- Background workers
- Retry failed jobs

Các task phù hợp:
- Gửi email hàng loạt
- Tạo báo cáo lớn
- Xử lý ảnh (resize, optimize)
- Sync dữ liệu với external system


6. SECURITY (Bảo mật)

6.1. Network Security

HTTPS:
- SSL/TLS certificate
- Mã hóa data in transit
- Force HTTPS redirect

Firewall:
- Chỉ mở port cần thiết (80, 443, 27017)
- Whitelist IP cho database
- DDoS protection


6.2. Application Security

Authentication:
- JWT với secret key mạnh
- Token expiration
- Refresh token rotation

Authorization:
- Role-based access control (RBAC)
- Middleware check permissions
- Least privilege principle

Input Validation:
- Validate tất cả input
- Sanitize HTML
- Parameterized queries


6.3. Data Security

Encryption at Rest:
- MongoDB encrypted storage
- Encrypted backup files
- KMS for key management

Password Security:
- bcrypt with salt rounds 10
- Minimum password length: 8
- Password strength check

Sensitive Data:
- Không log password, token
- Mask sensitive info trong logs
- Secure environment variables


6.4. API Security

Rate Limiting:
- Prevent brute force
- Limit per IP address
- Different limits per endpoint

CORS:
- Whitelist allowed origins
- Secure cookie settings
- Credentials handling

API Keys:
- For external service integration
- Rotate keys periodically
- Monitor usage


7. MONITORING VÀ MAINTENANCE

7.1. Health Checks

Endpoint: GET /api/health

Kiểm tra:
- Server status: UP/DOWN
- Database connection: OK/FAIL
- Redis connection: OK/FAIL
- Disk space: Available GB
- Memory usage: Percentage
- Response time: Milliseconds

Auto-restart nếu health check fail


7.2. Logging

Log Levels:
- ERROR: Lỗi cần xử lý ngay
- WARN: Cảnh báo, cần chú ý
- INFO: Thông tin hệ thống
- DEBUG: Chi tiết để debug

Log Format:
Timestamp | Level | Service | Message | Stack Trace

Rotation:
- File mới mỗi ngày
- Compress file cũ
- Xóa file sau 30 ngày


7.3. Metrics

Theo dõi:
- Request per second
- Average response time
- Error rate percentage
- Active connections
- Database query time
- Cache hit rate

Tools:
- PM2 built-in monitoring
- Custom metrics với Prometheus (nếu cần)


7.4. Alerting

Cảnh báo khi:
- Server down
- Response time > 5 giây
- Error rate > 5%
- Disk space < 10%
- Memory usage > 90%

Gửi qua:
- Email
- Slack (nếu có)
- SMS (khẩn cấp)


8. DEPLOYMENT (Triển khai)

8.1. Development Environment

Local Machine:
- MongoDB local hoặc Docker
- Redis local hoặc Docker
- Node.js 18+
- VS Code editor

Run:
- npm install
- npm run dev
- Port: 3000


8.2. Staging Environment

Server:
- Ubuntu 20.04 VPS
- 2 CPU, 4GB RAM
- MongoDB Atlas Free Tier
- Redis Cloud Free Tier

Domain:
- staging.ssb.com

Deploy:
- Git pull latest code
- npm install
- npm run build
- pm2 restart


8.3. Production Environment

Server:
- Ubuntu 22.04 LTS
- 4 CPU, 8GB RAM
- SSD storage
- MongoDB Atlas (Paid)
- Redis Cloud (Paid)

Domain:
- app.ssb.com
- api.ssb.com

Deploy:
- CI/CD với GitHub Actions
- Automated tests
- Zero-downtime deployment
- Rollback nếu có lỗi


8.4. Backup Strategy

Database Backup:
- Tự động hàng ngày 2:00 AM
- Full backup
- Upload lên S3
- Retention: 30 ngày
- Test restore hàng tháng

Code Backup:
- Git repository trên GitHub
- Private repository
- Branch protection rules
- Tag mỗi release


8.5. Disaster Recovery

RTO (Recovery Time Objective):
- Mục tiêu: 4 giờ

RPO (Recovery Point Objective):
- Mục tiêu: 24 giờ

Quy trình:
Bước 1: Phát hiện sự cố
Bước 2: Đánh giá mức độ nghiêm trọng
Bước 3: Thông báo stakeholders
Bước 4: Restore từ backup gần nhất
Bước 5: Verify data integrity
Bước 6: Switch DNS đến server mới
Bước 7: Monitor closely
Bước 8: Post-mortem analysis


9. PERFORMANCE OPTIMIZATION

9.1. Database Optimization

Indexes:
- Tạo index cho các trường hay query
- Compound index cho query phức tạp
- Explain query để tìm bottleneck

Query Optimization:
- Chỉ select fields cần thiết
- Limit số bản ghi trả về
- Pagination
- Avoid N+1 queries

Connection Pooling:
- Maintain pool of connections
- Reuse connections
- Min: 10, Max: 50


9.2. API Optimization

Response Compression:
- Gzip compression
- Giảm 70% bandwidth

Response Caching:
- Cache-Control headers
- ETag for conditional requests
- Redis cache cho expensive queries

Async Processing:
- Background jobs cho task lâu
- Không block main thread
- Return 202 Accepted


9.3. Frontend Optimization

Code Splitting:
- Lazy load components
- Giảm initial bundle size

Image Optimization:
- Resize ảnh trước khi upload
- WebP format
- Lazy loading images

Network Optimization:
- Debounce search input
- Batch multiple requests
- Cancel pending requests


10. TESTING STRATEGY

10.1. Unit Testing

Test:
- Individual functions
- Business logic
- Utility functions

Tools:
- Jest
- Coverage: 70% minimum

Example:
- Test auth.login function
- Test calculateDistance function


10.2. Integration Testing

Test:
- API endpoints
- Database operations
- External service integration

Tools:
- Supertest
- MongoDB Memory Server

Example:
- Test POST /api/students
- Test attendance flow


10.3. End-to-End Testing

Test:
- Complete user flows
- Real scenarios

Tools:
- Detox (React Native)
- Cypress (Web)

Example:
- Test đăng nhập đến xem vị trí xe
- Test tài xế điểm danh học sinh


10.4. Load Testing

Test:
- System under load
- Find bottlenecks
- Verify scalability

Tools:
- Apache JMeter
- Artillery

Scenarios:
- 100 concurrent users
- 1000 requests per minute
- Sustained load for 1 hour


11. FUTURE ENHANCEMENTS

11.1. Short-term (3-6 tháng)

- Thêm chat giữa phụ huynh và tài xế
- Thêm đánh giá tài xế
- Tích hợp thanh toán online
- Dark mode cho app


11.2. Long-term (6-12 tháng)

- Machine Learning dự đoán thời gian đến
- AI chatbot hỗ trợ
- IoT sensor trên xe (nhiệt độ, độ ẩm)
- Video streaming từ camera xe


11.3. Scalability Improvements

- Microservices architecture
- Kubernetes deployment
- Global CDN
- Multi-region database


Người lập tài liệu: [Tên bạn]
Ngày: 16/11/2024
Phiên bản: 1.0