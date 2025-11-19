-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 16, 2025 lúc 09:15 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ssb_1_0`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diemdung`
--

CREATE TABLE `diemdung` (
  `madiem` int(11) NOT NULL,
  `tendiem` varchar(100) NOT NULL,
  `diachi` varchar(255) DEFAULT NULL,
  `vido` decimal(10,8) DEFAULT NULL,
  `kinhdo` decimal(11,8) DEFAULT NULL,
  `matuyen` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `diemdung`
--

INSERT INTO `diemdung` (`madiem`, `tendiem`, `diachi`, `vido`, `kinhdo`, `matuyen`, `created_at`, `updated_at`) VALUES
(1, 'Điểm đón Lê Lợi', '123 Lê Lợi, Q.1', 10.77292000, 106.69828000, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(2, 'Điểm đón Nguyễn Thái Học', '45 Nguyễn Thái Học, Q.3', 10.78045000, 106.68752000, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(3, 'Điểm đón Võ Thị Sáu', '78 Võ Thị Sáu, Q.1', 10.77512000, 106.69543000, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(4, 'Trường Tiểu học Nguyễn Huệ', '100 Pasteur, Q.1', 10.77985000, 106.69512000, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(5, 'Trường Tiểu học Lý Tự Trọng', '200 Lý Tự Trọng, Q.1', 10.77231000, 106.69951000, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(6, 'Điểm đón Nguyễn Trãi', '65 Nguyễn Trãi, Q.5', 10.75534000, 106.66789000, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(7, 'Điểm đón Trần Hưng Đạo', '22 Trần Hưng Đạo, Q.5', 10.75892000, 106.67234000, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(8, 'Điểm đón Cách Mạng Tháng 8', '11 Cách Mạng Tháng 8, Q.10', 10.77123000, 106.66512000, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(9, 'Trường Tiểu học Minh Đức', '88 Nguyễn Văn Cừ, Q.5', 10.75678000, 106.67891000, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(10, 'Trường Tiểu học Hòa Bình', '150 Trần Phú, Q.5', 10.75421000, 106.67012000, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(11, 'Điểm đón Điện Biên Phủ', '90 Điện Biên Phủ, Q.Bình Thạnh', 10.79834000, 106.70234000, 3, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(12, 'Điểm đón Nguyễn Văn Đậu', '44 Nguyễn Văn Đậu, Q.Bình Thạnh', 10.79561000, 106.70812000, 3, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(13, 'Trường Tiểu học Nguyễn Thái Sơn', '120 Pasteur, Q.1', 10.77985000, 106.69512000, 3, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(14, 'Điểm đón Nguyễn Văn Linh', '20 Nguyễn Văn Linh, Q.7', 10.73456000, 106.72345000, 4, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(15, 'Điểm đón Nguyễn Văn Nghi', '17 Nguyễn Văn Nghi, Q.Gò Vấp', 10.83721000, 106.67854000, 4, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(16, 'Trường Tiểu học Nguyễn Văn Trỗi', '300 Nguyễn Văn Trỗi, Q.Gò Vấp', 10.83912000, 106.67234000, 4, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(17, 'Điểm đón Nguyễn Đình Chiểu', '55 Nguyễn Đình Chiểu, Q.3', 10.78234000, 106.68945000, 5, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(18, 'Điểm đón Lý Chính Thắng', '46 Lý Chính Thắng, Q.3', 10.78567000, 106.68712000, 5, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(19, 'Điểm đón Nguyễn Cư Trinh', '18 Nguyễn Cư Trinh, Q.5', 10.75891000, 106.67456000, 5, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(20, 'Trường Tiểu học Nguyễn Du', '250 Nguyễn Văn Cừ, Q.5', 10.75234000, 106.67789000, 5, '2025-11-16 07:57:06', '2025-11-16 07:57:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocsinh`
--

CREATE TABLE `hocsinh` (
  `mahs` int(11) NOT NULL,
  `hoten` varchar(100) NOT NULL,
  `lop` varchar(20) NOT NULL,
  `madiem_den` int(11) DEFAULT NULL,
  `madiem_tra` int(11) DEFAULT NULL,
  `diemden` varchar(100) DEFAULT NULL,
  `diemtra` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hocsinh`
--

INSERT INTO `hocsinh` (`mahs`, `hoten`, `lop`, `madiem_den`, `madiem_tra`, `diemden`, `diemtra`, `user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Nguyễn Minh Anh', '1A', 1, 4, '123 Lê Lợi, Q.1', 'Trường Tiểu học Nguyễn Huệ', 1, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(2, 'Trần Gia Bảo', '1B', 2, 5, '45 Nguyễn Thái Học, Q.3', 'Trường Tiểu học Lý Tự Trọng', 2, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(3, 'Lê Phương Chi', '2A', 3, 10, '78 Võ Thị Sáu, Q.1', 'Trường Tiểu học Hòa Bình', 3, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(4, 'Phạm Nhật Duy', '2B', 1, 16, '19 Lê Văn Sỹ, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 4, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(5, 'Hoàng Anh Dũng', '3A', 1, 13, '120 Pasteur, Q.1', 'Trường Tiểu học Nguyễn Thái Sơn', 5, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(6, 'Ngô Thảo Linh', '3B', 11, 10, '90 Điện Biên Phủ, Q.Bình Thạnh', 'Trường Tiểu học Hòa Bình', 6, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(7, 'Đặng Trung Kiên', '4A', 6, 9, '65 Nguyễn Trãi, Q.5', 'Trường Tiểu học Minh Đức', 7, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(8, 'Vũ Bảo Trân', '4B', 7, 10, '22 Trần Hưng Đạo, Q.5', 'Trường Tiểu học Hồng Bàng', 8, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(9, 'Phan Đức Toàn', '5A', 8, 5, '11 Cách Mạng Tháng 8, Q.10', 'Trường Tiểu học Lê Lợi', 9, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(10, 'Bùi Hương Giang', '5B', 1, 20, '54 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 10, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(11, 'Nguyễn Hoàng Phúc', '1A', 1, 4, '27 Võ Văn Kiệt, Q.1', 'Trường Tiểu học Nguyễn Huệ', 11, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(12, 'Trần Ngọc Mai', '1B', 1, 10, '10 Trần Quang Khải, Q.1', 'Trường Tiểu học Hòa Bình', 12, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(13, 'Lê Gia Hân', '2A', 1, 5, '32 Nguyễn Thiện Thuật, Q.3', 'Trường Tiểu học Lý Tự Trọng', 13, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(14, 'Phạm Quốc Huy', '2B', 17, 16, '55 Nguyễn Đình Chiểu, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 14, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(15, 'Hoàng Khánh Vy', '3A', 8, 13, '78 Cách Mạng Tháng 8, Q.10', 'Trường Tiểu học Nguyễn Thái Sơn', 15, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(16, 'Ngô Đức Mạnh', '3B', 1, 9, '23 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Minh Đức', 16, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(17, 'Đặng Ngọc Ánh', '4A', 1, 20, '49 Trần Phú, Q.5', 'Trường Tiểu học Nguyễn Du', 17, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(18, 'Vũ Minh Quân', '4B', 1, 5, '36 Bùi Thị Xuân, Q.1', 'Trường Tiểu học Lê Lợi', 18, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(19, 'Phan Gia Bảo', '5A', 1, 10, '14 Nguyễn Huệ, Q.1', 'Trường Tiểu học Hòa Bình', 19, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(20, 'Bùi Anh Thư', '5B', 1, 5, '29 Hai Bà Trưng, Q.1', 'Trường Tiểu học Lý Tự Trọng', 20, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(21, 'Nguyễn Lan Chi', '1A', 1, 4, '12 Nguyễn Văn Thủ, Q.1', 'Trường Tiểu học Nguyễn Huệ', 21, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(22, 'Trần Hoàng Anh', '1B', 1, 5, '45 Lý Tự Trọng, Q.1', 'Trường Tiểu học Lê Lợi', 22, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(23, 'Lê Phương Linh', '2A', 19, 9, '58 Nguyễn Cư Trinh, Q.5', 'Trường Tiểu học Minh Đức', 23, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(24, 'Phạm Minh Tuấn', '2B', 3, 16, '33 Võ Thị Sáu, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 24, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(25, 'Hoàng Thu Trang', '3A', 1, 10, '44 Nguyễn Văn Đậu, Q.Bình Thạnh', 'Trường Tiểu học Hòa Bình', 25, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(26, 'Ngô Thái Sơn', '3B', 1, 4, '18 Nguyễn Văn Lạc, Q.Bình Thạnh', 'Trường Tiểu học Nguyễn Huệ', 26, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(27, 'Đặng Kim Oanh', '4A', 2, 20, '25 Nguyễn Thái Học, Q.3', 'Trường Tiểu học Nguyễn Du', 27, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(28, 'Vũ Hải Nam', '4B', 7, 5, '37 Trần Hưng Đạo, Q.5', 'Trường Tiểu học Lý Tự Trọng', 28, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(29, 'Phan Anh Khoa', '5A', 1, 9, '11 Lê Lai, Q.1', 'Trường Tiểu học Minh Đức', 29, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(30, 'Bùi Nhật Hạ', '5B', 1, 10, '90 Nguyễn Thái Bình, Q.1', 'Trường Tiểu học Hòa Bình', 30, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(31, 'Nguyễn Gia Minh', '1A', 1, 5, '21 Võ Văn Kiệt, Q.1', 'Trường Tiểu học Lê Lợi', 31, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(32, 'Trần Quỳnh Anh', '1B', 2, 16, '46 Lý Chính Thắng, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 32, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(33, 'Lê Thanh Tú', '2A', 6, 4, '67 Nguyễn Trãi, Q.5', 'Trường Tiểu học Nguyễn Huệ', 33, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(34, 'Phạm Hải Đăng', '2B', 1, 20, '35 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 34, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(35, 'Hoàng Mỹ Duyên', '3A', 8, 10, '18 Cách Mạng Tháng 8, Q.10', 'Trường Tiểu học Hòa Bình', 35, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(36, 'Ngô Ngọc Bảo', '3B', 17, 9, '75 Nguyễn Đình Chiểu, Q.3', 'Trường Tiểu học Minh Đức', 36, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(37, 'Đặng Thanh Hòa', '4A', 14, 4, '20 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Nguyễn Huệ', 37, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(38, 'Vũ Tấn Lộc', '4B', 1, 5, '15 Trần Phú, Q.5', 'Trường Tiểu học Lý Tự Trọng', 38, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(39, 'Phan Hải Yến', '5A', 1, 20, '64 Nguyễn Huệ, Q.1', 'Trường Tiểu học Nguyễn Du', 39, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(40, 'Bùi Đức Anh', '5B', 15, 10, '17 Nguyễn Văn Nghi, Q.Gò Vấp', 'Trường Tiểu học Hòa Bình', 40, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(41, 'Nguyễn Quốc Việt', '1A', 2, 5, '8 Nguyễn Thái Học, Q.1', 'Trường Tiểu học Lê Lợi', 41, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(42, 'Trần Khánh Linh', '1B', 17, 16, '55 Nguyễn Đình Chiểu, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 42, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(43, 'Lê Thảo Nguyên', '2A', 1, 4, '66 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Huệ', 43, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(44, 'Phạm Quang Huy', '2B', 1, 9, '43 Nguyễn Thiện Thuật, Q.3', 'Trường Tiểu học Minh Đức', 44, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(45, 'Hoàng Ngọc Bích', '3A', 1, 10, '27 Lê Lợi, Q.1', 'Trường Tiểu học Hòa Bình', 45, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(46, 'Ngô Phúc Lộc', '3B', 2, 5, '40 Nguyễn Thái Học, Q.1', 'Trường Tiểu học Lý Tự Trọng', 46, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(47, 'Đặng Bảo Châu', '4A', 7, 20, '32 Trần Hưng Đạo, Q.5', 'Trường Tiểu học Nguyễn Du', 47, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(48, 'Vũ Gia Phát', '4B', 1, 9, '29 Nguyễn Văn Trỗi, Q.3', 'Trường Tiểu học Minh Đức', 48, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(49, 'Phan Thảo Vy', '5A', 1, 5, '46 Nguyễn Huệ, Q.1', 'Trường Tiểu học Lê Lợi', 49, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(50, 'Bùi Hữu Khang', '5B', 2, 10, '58 Nguyễn Thái Học, Q.1', 'Trường Tiểu học Hòa Bình', 50, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(51, 'Nguyễn Phương Anh', '1A', 14, 4, '34 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Nguyễn Huệ', 1, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(52, 'Trần Bảo Long', '1B', 19, 9, '18 Nguyễn Cư Trinh, Q.5', 'Trường Tiểu học Minh Đức', 2, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(53, 'Lê Ngọc Hà', '2A', 1, 20, '25 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 3, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(54, 'Phạm Huyền My', '2B', 7, 5, '15 Trần Hưng Đạo, Q.1', 'Trường Tiểu học Lý Tự Trọng', 4, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(55, 'Hoàng Nhật Minh', '3A', 1, 5, '13 Nguyễn Huệ, Q.1', 'Trường Tiểu học Lê Lợi', 5, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(56, 'Ngô Khánh Ngọc', '3B', 1, 4, '62 Lý Tự Trọng, Q.1', 'Trường Tiểu học Nguyễn Huệ', 6, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(57, 'Đặng Gia Linh', '4A', 1, 9, '71 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Minh Đức', 7, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(58, 'Vũ Ngọc Hân', '4B', 6, 16, '40 Nguyễn Trãi, Q.5', 'Trường Tiểu học Nguyễn Văn Trỗi', 8, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(59, 'Phan Đức Mạnh', '5A', 17, 4, '9 Nguyễn Đình Chiểu, Q.3', 'Trường Tiểu học Nguyễn Huệ', 9, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(60, 'Bùi Gia Hân', '5B', 1, 5, '21 Lý Tự Trọng, Q.1', 'Trường Tiểu học Lê Lợi', 10, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(61, 'Nguyễn Bảo Anh', '1A', 1, 20, '44 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 11, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(62, 'Trần Thanh Phong', '1B', 15, 9, '15 Nguyễn Văn Nghi, Q.Gò Vấp', 'Trường Tiểu học Minh Đức', 12, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(63, 'Lê Thanh Bình', '2A', 14, 4, '56 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Nguyễn Huệ', 13, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(64, 'Phạm Hồng Anh', '2B', 1, 10, '31 Lê Lợi, Q.1', 'Trường Tiểu học Hòa Bình', 14, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(65, 'Hoàng Đức Nam', '3A', 1, 20, '17 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 15, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(66, 'Ngô Ngọc Quỳnh', '3B', 7, 16, '26 Trần Hưng Đạo, Q.5', 'Trường Tiểu học Nguyễn Văn Trỗi', 16, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(67, 'Đặng Bảo Ngọc', '4A', 1, 5, '61 Nguyễn Huệ, Q.1', 'Trường Tiểu học Lê Lợi', 17, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(68, 'Vũ Gia Khánh', '4B', 1, 4, '47 Nguyễn Văn Trỗi, Q.3', 'Trường Tiểu học Nguyễn Huệ', 18, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(69, 'Phan Ngọc Minh', '5A', 17, 9, '33 Nguyễn Đình Chiểu, Q.3', 'Trường Tiểu học Minh Đức', 19, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(70, 'Bùi Hồng Hạnh', '5B', 1, 20, '25 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Du', 20, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(71, 'Nguyễn Trí Dũng', '1A', 1, 4, '7 Lý Tự Trọng, Q.1', 'Trường Tiểu học Nguyễn Huệ', 21, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(72, 'Trần Mỹ Linh', '1B', 14, 10, '35 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Hòa Bình', 22, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(73, 'Lê Khánh Duy', '2A', 1, 9, '46 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Minh Đức', 23, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(74, 'Phạm Quỳnh Chi', '2B', 1, 5, '55 Nguyễn Huệ, Q.1', 'Trường Tiểu học Lê Lợi', 24, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(75, 'Hoàng Gia Hân', '3A', 1, 4, '67 Lý Tự Trọng, Q.1', 'Trường Tiểu học Nguyễn Huệ', 25, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(76, 'Ngô Tấn Phát', '3B', 1, 16, '43 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Văn Trỗi', 26, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(77, 'Đặng Hải Anh', '4A', 1, 20, '22 Nguyễn Huệ, Q.1', 'Trường Tiểu học Nguyễn Du', 27, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(78, 'Vũ Phương Vy', '4B', 1, 9, '32 Lê Lợi, Q.1', 'Trường Tiểu học Minh Đức', 28, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(79, 'Phan Đức Trí', '5A', 1, 10, '19 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Hòa Bình', 29, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(80, 'Bùi Thanh Hà', '5B', 14, 4, '61 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Nguyễn Huệ', 30, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(81, 'Nguyễn Nhật Huy', '1A', 1, 9, '47 Nguyễn Văn Trỗi, Q.3', 'Trường Tiểu học Minh Đức', 31, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(82, 'Trần Thanh Thảo', '1B', 1, 20, '23 Nguyễn Huệ, Q.1', 'Trường Tiểu học Nguyễn Du', 32, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(83, 'Lê Hồng Ngọc', '2A', 14, 10, '19 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Hòa Bình', 33, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(84, 'Phạm Quốc Bảo', '2B', 1, 4, '45 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Huệ', 34, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(85, 'Hoàng Khánh Linh', '3A', 14, 9, '32 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Minh Đức', 35, '2025-11-16 07:53:42', '2025-11-16 08:01:32', NULL),
(86, 'Ngô Ngọc Hà', '3B', 1, 5, '55 Nguyễn Huệ, Q.1', 'Trường Tiểu học Lê Lợi', 36, '2025-11-16 07:53:42', '2025-11-16 08:08:50', NULL),
(87, 'Đặng Anh Khoa', '4A', 1, 16, '40 Nguyễn Văn Trỗi, Q.3', 'Trường Tiểu học Nguyễn Văn Trỗi', 37, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(88, 'Vũ Ngọc Bích', '4B', 1, 4, '60 Nguyễn Văn Cừ, Q.5', 'Trường Tiểu học Nguyễn Huệ', 38, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(89, 'Phan Minh Nhật', '5A', 1, 9, '25 Nguyễn Huệ, Q.1', 'Trường Tiểu học Minh Đức', 39, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL),
(90, 'Bùi Thảo My', '5B', 14, 20, '33 Nguyễn Văn Linh, Q.7', 'Trường Tiểu học Nguyễn Du', 40, '2025-11-16 07:53:42', '2025-11-16 08:01:33', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `malich` int(11) NOT NULL,
  `mahs` int(11) DEFAULT NULL,
  `ngay` date NOT NULL,
  `giokhoihanh` time NOT NULL,
  `gioketthuc` time DEFAULT NULL,
  `maxe` int(11) DEFAULT NULL,
  `trangthai` enum('da_len_ke_hoach','dang_thuc_hien','hoan_thanh','huy') DEFAULT 'da_len_ke_hoach',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichtrinh`
--

INSERT INTO `lichtrinh` (`malich`, `mahs`, `ngay`, `giokhoihanh`, `gioketthuc`, `maxe`, `trangthai`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-11-17', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(2, 2, '2025-11-17', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(3, 3, '2025-11-17', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(4, 11, '2025-11-17', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(5, 12, '2025-11-17', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(6, 4, '2025-11-17', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(7, 5, '2025-11-17', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(8, 13, '2025-11-17', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(9, 14, '2025-11-17', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(10, 7, '2025-11-17', '06:40:00', '07:25:00', 3, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(11, 8, '2025-11-17', '06:40:00', '07:25:00', 3, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(12, 9, '2025-11-17', '06:40:00', '07:25:00', 3, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(13, 10, '2025-11-17', '06:40:00', '07:25:00', 3, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(14, 1, '2025-11-17', '16:30:00', '17:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(15, 2, '2025-11-17', '16:30:00', '17:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(16, 3, '2025-11-17', '16:30:00', '17:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(17, 4, '2025-11-17', '16:35:00', '17:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(18, 5, '2025-11-17', '16:35:00', '17:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(19, 1, '2025-11-18', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(20, 2, '2025-11-18', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(21, 3, '2025-11-18', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(22, 4, '2025-11-18', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(23, 5, '2025-11-18', '06:35:00', '07:20:00', 2, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(24, 1, '2025-11-19', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(25, 2, '2025-11-19', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(26, 1, '2025-11-20', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(27, 2, '2025-11-20', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(28, 1, '2025-11-21', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33'),
(29, 2, '2025-11-21', '06:30:00', '07:15:00', 1, 'da_len_ke_hoach', '2025-11-16 07:57:06', '2025-11-16 08:01:33');

--
-- Bẫy `lichtrinh`
--
DELIMITER $$
CREATE TRIGGER `trg_notify_schedule_created` AFTER INSERT ON `lichtrinh` FOR EACH ROW BEGIN
    DECLARE v_user_id INT;
    DECLARE v_ngay_text VARCHAR(50);
    DECLARE v_gio_text VARCHAR(50);
    
    -- Lấy user_id của phụ huynh
    SELECT user_id INTO v_user_id 
    FROM hocsinh 
    WHERE mahs = NEW.mahs;
    
    -- Format ngày giờ
    SET v_ngay_text = DATE_FORMAT(NEW.ngay, '%d/%m/%Y');
    SET v_gio_text = TIME_FORMAT(NEW.giokhoihanh, '%H:%i');
    
    -- Tạo thông báo
    INSERT INTO thongbao (noidung, loai, user_id, da_doc)
    VALUES (
        CONCAT('Lịch trình mới: Xe sẽ đón con bạn lúc ', v_gio_text, ' ngày ', v_ngay_text),
        'thong_thuong',
        v_user_id,
        FALSE
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanlyxebuyt`
--

CREATE TABLE `quanlyxebuyt` (
  `maql` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quanlyxebuyt`
--

INSERT INTO `quanlyxebuyt` (`maql`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 102, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(2, 103, '2025-11-16 07:57:06', '2025-11-16 07:57:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taixe`
--

CREATE TABLE `taixe` (
  `mataixe` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `trangthai` enum('ranh','dang_lai_xe','nghi_phep','tam_nghi') DEFAULT 'ranh',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taixe`
--

INSERT INTO `taixe` (`mataixe`, `user_id`, `trangthai`, `created_at`, `updated_at`) VALUES
(1, 104, 'ranh', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(2, 105, 'dang_lai_xe', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(3, 106, 'dang_lai_xe', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(4, 107, 'ranh', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(5, 108, 'dang_lai_xe', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(6, 109, 'ranh', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(7, 110, 'dang_lai_xe', '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(8, 111, 'nghi_phep', '2025-11-16 07:57:06', '2025-11-16 07:57:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `mathongbao` int(11) NOT NULL,
  `noidung` text NOT NULL,
  `loai` enum('thong_thuong','khan_cap','canh_bao','nhat_ky') DEFAULT 'thong_thuong',
  `thoigian` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `thoi_gian_doc` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thongbao`
--

INSERT INTO `thongbao` (`mathongbao`, `noidung`, `loai`, `thoigian`, `user_id`, `da_doc`, `thoi_gian_doc`) VALUES
(1, 'Xe buýt sẽ đến điểm đón của bạn lúc 6:30 sáng mai (18/11/2024)', 'thong_thuong', '2025-11-17 20:00:00', 1, 1, NULL),
(2, 'Xe buýt sẽ đến điểm đón của bạn lúc 6:30 sáng mai (18/11/2024)', 'thong_thuong', '2025-11-17 20:00:00', 2, 1, NULL),
(3, 'Xe buýt sẽ đến điểm đón của bạn lúc 6:35 sáng mai (18/11/2024)', 'thong_thuong', '2025-11-17 20:00:00', 4, 0, NULL),
(4, 'Xe buýt biển số 51A-12345 bị chậm 10 phút do kẹt xe', 'khan_cap', '2025-11-16 06:40:00', 1, 1, NULL),
(5, 'Xe buýt biển số 51A-12345 bị chậm 10 phút do kẹt xe', 'khan_cap', '2025-11-16 06:40:00', 2, 1, NULL),
(6, 'Con bạn chưa lên xe. Vui lòng kiểm tra', 'canh_bao', '2025-11-16 06:35:00', 15, 0, NULL),
(7, 'Xe buýt 51E-56789 đang bảo trì. Học sinh sẽ được chuyển sang xe 51B-23456', 'khan_cap', '2025-11-15 18:00:00', 7, 1, NULL),
(8, 'Con bạn đã lên xe lúc 6:32 sáng', 'nhat_ky', '2025-11-16 06:32:00', 1, 1, NULL),
(9, 'Con bạn đã đến trường lúc 7:05 sáng', 'nhat_ky', '2025-11-16 07:05:00', 1, 1, NULL),
(10, 'Con bạn đã lên xe về nhà lúc 16:32', 'nhat_ky', '2025-11-16 16:32:00', 1, 1, NULL),
(11, 'Con bạn đã về đến nhà an toàn lúc 17:15', 'nhat_ky', '2025-11-16 17:15:00', 1, 1, NULL),
(12, 'Xe buýt 51E-56789 sẽ bảo trì định kỳ từ 20-22/11. Học sinh sẽ được sắp xếp xe khác', 'thong_thuong', '2025-11-15 15:00:00', 8, 0, NULL),
(13, 'Tài xế Trần Văn Nam sẽ thay thế tài xế Phạm Minh Đức trong tuần này', 'thong_thuong', '2025-11-14 17:00:00', 1, 1, NULL),
(14, 'Thông báo: Xe buýt nghỉ trong dịp Tết Dương lịch từ 01-03/01/2025', 'thong_thuong', '2024-12-20 10:00:00', 1, 0, NULL),
(15, 'Thông báo: Xe buýt nghỉ trong dịp Tết Dương lịch từ 01-03/01/2025', 'thong_thuong', '2024-12-20 10:00:00', 2, 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `matuyen` int(11) NOT NULL,
  `tentuyen` varchar(100) NOT NULL,
  `mota` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong`
--

INSERT INTO `tuyenduong` (`matuyen`, `tentuyen`, `mota`, `created_at`, `updated_at`) VALUES
(1, 'Tuyến Quận 1 - Quận 3', NULL, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(2, 'Tuyến Quận 5 - Quận 10', NULL, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(3, 'Tuyến Bình Thạnh - Quận 1', NULL, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(4, 'Tuyến Quận 7 - Gò Vấp', NULL, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(5, 'Tuyến Quận 3 - Quận 5', NULL, '2025-11-16 07:57:06', '2025-11-16 07:57:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `hoten` varchar(100) NOT NULL,
  `sdt` varchar(15) NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('phuhuynh','taixe','quanly','admin') DEFAULT 'phuhuynh',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`user_id`, `hoten`, `sdt`, `gmail`, `password`, `role`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Nguyễn Thị Hồng', '0901000001', 'hong.nguyen97@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:10:14', NULL),
(2, 'Trần Văn Nam', '0901000002', 'nam.tran@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:10:40', NULL),
(3, 'Lê Minh Phương', '0901000003', 'phuong.le@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:10:52', NULL),
(4, 'Phạm Thị Thu', '0901000004', 'thu.phamm@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:13', NULL),
(5, 'Võ Hoàng Long', '0901000005', 'long.vo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:31', NULL),
(6, 'Đặng Hồng Nhung', '0901000006', 'nhung.dang@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:43', NULL),
(7, 'Ngô Văn Dũng', '0901000007', 'dung.ngo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:51', NULL),
(8, 'Bùi Thị Mai', '0901000008', 'mai.bui@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:54', NULL),
(9, 'Đỗ Thành Công', '0901000009', 'cong.do@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:11:58', NULL),
(10, 'Lý Ngọc Trâm', '0901000010', 'tram.ly@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:05', NULL),
(11, 'Huỳnh Thị Hòa', '0901000011', 'hoa.huynh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:08', NULL),
(12, 'Phan Quốc Huy', '0901000012', 'huy.phan@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:12', NULL),
(13, 'Trương Thị Hạnh', '0901000013', 'hanh.truong@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:18', NULL),
(14, 'Tạ Minh Tuấn', '0901000014', 'tuan.ta@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:22', NULL),
(15, 'Đinh Lan Anh', '0901000015', 'lananh.dinh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:26', NULL),
(16, 'Lâm Hoàng Bảo', '0901000016', 'bao.lam@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:30', NULL),
(17, 'Trịnh Thu Hà', '0901000017', 'ha.trinh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:34', NULL),
(18, 'Hoàng Văn Khánh', '0901000018', 'khanh.hoang@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:37', NULL),
(19, 'Mai Ngọc Hiếu', '0901000019', 'hieu.mai@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:42', NULL),
(20, 'Nguyễn Thị Vân', '0901000020', 'van.nguyen@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:46', NULL),
(21, 'Trần Quốc Tuấn', '0901000021', 'tuan.tran@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:50', NULL),
(22, 'Lê Bích Ngọc', '0901000022', 'ngoc.le@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:12:54', NULL),
(23, 'Phạm Văn Hùng', '0901000023', 'hung.pham@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:00', NULL),
(24, 'Võ Thị Thủy', '0901000024', 'thuy.vo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:03', NULL),
(25, 'Đặng Văn Toàn', '0901000025', 'toan.dang@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:06', NULL),
(26, 'Ngô Thị Hà', '0901000026', 'ha.ngo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:10', NULL),
(27, 'Bùi Đức Mạnh', '0901000027', 'manh.bui@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:13', NULL),
(28, 'Đỗ Thị Tươi', '0901000028', 'tuoi.do@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:15', NULL),
(29, 'Lý Thanh Tâm', '0901000029', 'tam.ly@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:19', NULL),
(30, 'Huỳnh Thị Duyên', '0901000030', 'duyen.huynh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:28', NULL),
(31, 'Phan Minh Quân', '0901000031', 'quan.phan@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:35', NULL),
(32, 'Trương Hải Yến', '0901000032', 'yen.truong@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:38', NULL),
(33, 'Tạ Ngọc Hải', '0901000033', 'hai.ta@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:42', NULL),
(34, 'Đinh Thị Kim', '0901000034', 'kim.dinh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:46', NULL),
(35, 'Lâm Quốc Bảo', '0901000035', 'baolam@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:50', NULL),
(36, 'Trịnh Thị Hồng', '0901000036', 'hong.trinh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:13:56', NULL),
(37, 'Hoàng Minh Anh', '0901000037', 'anh.hoang@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:00', NULL),
(38, 'Mai Thị Trang', '0901000038', 'trang.mai@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:03', NULL),
(39, 'Nguyễn Duy Khang', '0901000039', 'khang.nguyen@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:06', NULL),
(40, 'Trần Thu Hằng', '0901000040', 'hang.tran@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:14', NULL),
(41, 'Lê Đức Anh', '0901000041', 'anh.le@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:19', NULL),
(42, 'Phạm Mỹ Linh', '0901000042', 'linh.pham@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:23', NULL),
(43, 'Võ Văn Quý', '0901000043', 'quy.vo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:28', NULL),
(44, 'Đặng Thảo Nhi', '0901000044', 'nhi.dang@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:31', NULL),
(45, 'Ngô Nhật Tân', '0901000045', 'tan.ngo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:36', NULL),
(46, 'Bùi Phương Thảo', '0901000046', 'thao.bui@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:39', NULL),
(47, 'Đỗ Ngọc Hòa', '0901000047', 'hoa.do@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:42', NULL),
(48, 'Lý Thanh Bình', '0901000048', 'binh.ly@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:46', NULL),
(49, 'Huỳnh Mỹ Dung', '0901000049', 'dung.huynh@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:51', NULL),
(50, 'Phan Thành Đạt', '0901000050', 'dat.phan@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phuhuynh', '2025-11-16 07:53:42', '2025-11-16 08:14:59', NULL),
(101, 'Nguyễn Văn An', '0909000001', 'admin@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(102, 'Trần Thị Bình', '0909000002', 'binh.tran@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'quanly', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(103, 'Lê Văn Cường', '0909000003', 'cuong.le@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'quanly', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(104, 'Phạm Minh Đức', '0909000004', 'duc.pham@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(105, 'Võ Thanh Em', '0909000005', 'em.vo@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(106, 'Đặng Hữu Phúc', '0909000006', 'phuc.dang@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(107, 'Ngô Văn Giang', '0909000007', 'giang.ngo@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(108, 'Bùi Thanh Hải', '0909000008', 'hai.bui@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(109, 'Hoàng Văn Khoa', '0909000009', 'khoa.hoang@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(110, 'Phan Minh Lâm', '0909000010', 'lam.phan@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL),
(111, 'Trần Văn Nam', '0909000011', 'nam.tranvan@schoolbus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'taixe', '2025-11-16 07:57:06', '2025-11-16 07:57:06', NULL);

--
-- Bẫy `user`
--
DELIMITER $$
CREATE TRIGGER `trg_validate_email_insert` BEFORE INSERT ON `user` FOR EACH ROW BEGIN
    IF NEW.gmail NOT LIKE '%@%.%' OR LENGTH(NEW.gmail) < 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email không hợp lệ';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_validate_email_update` BEFORE UPDATE ON `user` FOR EACH ROW BEGIN
    IF NEW.gmail NOT LIKE '%@%.%' OR LENGTH(NEW.gmail) < 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email không hợp lệ';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_validate_sdt_insert` BEFORE INSERT ON `user` FOR EACH ROW BEGIN
    IF NEW.sdt NOT REGEXP '^0[0-9]{9}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_validate_sdt_update` BEFORE UPDATE ON `user` FOR EACH ROW BEGIN
    IF NEW.sdt NOT REGEXP '^0[0-9]{9}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vitri`
--

CREATE TABLE `vitri` (
  `mavitri` int(11) NOT NULL,
  `vido` decimal(10,8) NOT NULL,
  `kinhdo` decimal(11,8) NOT NULL,
  `thoigian` datetime NOT NULL DEFAULT current_timestamp(),
  `maxe` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vitri`
--

INSERT INTO `vitri` (`mavitri`, `vido`, `kinhdo`, `thoigian`, `maxe`) VALUES
(1, 10.77292000, 106.69828000, '2025-11-16 13:08:50', 1),
(2, 10.77412000, 106.69712000, '2025-11-16 13:13:50', 1),
(3, 10.77534000, 106.69598000, '2025-11-16 13:18:50', 1),
(4, 10.77645000, 106.69484000, '2025-11-16 13:23:50', 1),
(5, 10.77985000, 106.69512000, '2025-11-16 13:28:50', 1),
(6, 10.78045000, 106.68752000, '2025-11-16 13:13:50', 2),
(7, 10.78156000, 106.68638000, '2025-11-16 13:18:50', 2),
(8, 10.77231000, 106.69951000, '2025-11-16 13:33:50', 2),
(9, 10.75534000, 106.66789000, '2025-11-16 13:18:50', 3),
(10, 10.75678000, 106.67891000, '2025-11-16 13:48:50', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xebuyt`
--

CREATE TABLE `xebuyt` (
  `maxe` int(11) NOT NULL,
  `biensoxe` varchar(20) NOT NULL,
  `succho` int(11) NOT NULL DEFAULT 30,
  `trangthai` enum('hoat_dong','bao_tri','hong','ngung_hoat_dong') DEFAULT 'hoat_dong',
  `mataixe` int(11) DEFAULT NULL,
  `maql` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Đang đổ dữ liệu cho bảng `xebuyt`
--

INSERT INTO `xebuyt` (`maxe`, `biensoxe`, `succho`, `trangthai`, `mataixe`, `maql`, `created_at`, `updated_at`) VALUES
(1, '51A-12345', 35, 'hoat_dong', 2, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(2, '51B-23456', 30, 'hoat_dong', 3, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(3, '51C-34567', 35, 'hoat_dong', 5, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(4, '51D-45678', 40, 'hoat_dong', 7, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(5, '51E-56789', 30, 'bao_tri', NULL, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(6, '51F-67890', 35, 'hoat_dong', NULL, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(7, '51G-78901', 30, 'hoat_dong', NULL, 1, '2025-11-16 07:57:06', '2025-11-16 07:57:06'),
(8, '51H-89012', 35, 'hong', NULL, 2, '2025-11-16 07:57:06', '2025-11-16 07:57:06');

--
-- Bẫy `xebuyt`
--
DELIMITER $$
CREATE TRIGGER `trg_update_taixe_status_after_assign` AFTER UPDATE ON `xebuyt` FOR EACH ROW BEGIN
    -- Khi gán tài xế mới cho xe
    IF NEW.mataixe IS NOT NULL AND OLD.mataixe IS NULL THEN
        UPDATE taixe 
        SET trangthai = 'dang_lai_xe' 
        WHERE mataixe = NEW.mataixe;
    END IF;
    
    -- Khi bỏ tài xế khỏi xe
    IF NEW.mataixe IS NULL AND OLD.mataixe IS NOT NULL THEN
        UPDATE taixe 
        SET trangthai = 'ranh' 
        WHERE mataixe = OLD.mataixe;
    END IF;
    
    -- Khi đổi tài xế
    IF NEW.mataixe IS NOT NULL AND OLD.mataixe IS NOT NULL AND NEW.mataixe != OLD.mataixe THEN
        UPDATE taixe SET trangthai = 'ranh' WHERE mataixe = OLD.mataixe;
        UPDATE taixe SET trangthai = 'dang_lai_xe' WHERE mataixe = NEW.mataixe;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_validate_biensoxe_insert` BEFORE INSERT ON `xebuyt` FOR EACH ROW BEGIN
    IF NEW.biensoxe NOT REGEXP '^[0-9]{2}[A-Z]-[0-9]{5}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Biển số xe phải theo format: 51A-12345';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_validate_biensoxe_update` BEFORE UPDATE ON `xebuyt` FOR EACH ROW BEGIN
    IF NEW.biensoxe NOT REGEXP '^[0-9]{2}[A-Z]-[0-9]{5}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Biển số xe phải theo format: 51A-12345';
    END IF;
END
$$
DELIMITER ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  ADD PRIMARY KEY (`madiem`),
  ADD KEY `matuyen` (`matuyen`);

--
-- Chỉ mục cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`mahs`),
  ADD KEY `fk_hocsinh_diem_den` (`madiem_den`),
  ADD KEY `fk_hocsinh_diem_tra` (`madiem_tra`),
  ADD KEY `idx_hocsinh_user` (`user_id`,`deleted_at`),
  ADD KEY `idx_hocsinh_user_deleted` (`user_id`,`deleted_at`);

--
-- Chỉ mục cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`malich`),
  ADD KEY `idx_ngay` (`ngay`),
  ADD KEY `idx_mahs_ngay` (`mahs`,`ngay`),
  ADD KEY `idx_maxe_ngay` (`maxe`,`ngay`),
  ADD KEY `idx_hocsinh_lichtrinh` (`mahs`,`ngay`,`trangthai`);

--
-- Chỉ mục cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  ADD PRIMARY KEY (`maql`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`mataixe`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`mathongbao`),
  ADD KEY `idx_user_thoigian` (`user_id`,`thoigian`),
  ADD KEY `idx_loai` (`loai`);

--
-- Chỉ mục cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`matuyen`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_gmail` (`gmail`),
  ADD UNIQUE KEY `unique_sdt` (`sdt`),
  ADD KEY `idx_gmail` (`gmail`),
  ADD KEY `idx_sdt` (`sdt`),
  ADD KEY `idx_role` (`role`);

--
-- Chỉ mục cho bảng `vitri`
--
ALTER TABLE `vitri`
  ADD PRIMARY KEY (`mavitri`),
  ADD KEY `idx_maxe_thoigian` (`maxe`,`thoigian`);

--
-- Chỉ mục cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD PRIMARY KEY (`maxe`),
  ADD UNIQUE KEY `unique_biensoxe` (`biensoxe`),
  ADD KEY `maql` (`maql`),
  ADD KEY `idx_biensoxe` (`biensoxe`),
  ADD KEY `idx_trangthai` (`trangthai`),
  ADD KEY `idx_xebuyt_taixe` (`mataixe`,`trangthai`),
  ADD KEY `idx_xebuyt_taixe_trangthai` (`mataixe`,`trangthai`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  MODIFY `madiem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  MODIFY `mahs` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `malich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  MODIFY `maql` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `taixe`
--
ALTER TABLE `taixe`
  MODIFY `mataixe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `mathongbao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  MODIFY `matuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `vitri`
--
ALTER TABLE `vitri`
  MODIFY `mavitri` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  MODIFY `maxe` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  ADD CONSTRAINT `diemdung_ibfk_1` FOREIGN KEY (`matuyen`) REFERENCES `tuyenduong` (`matuyen`);

--
-- Các ràng buộc cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `fk_hocsinh_diem_den` FOREIGN KEY (`madiem_den`) REFERENCES `diemdung` (`madiem`),
  ADD CONSTRAINT `fk_hocsinh_diem_tra` FOREIGN KEY (`madiem_tra`) REFERENCES `diemdung` (`madiem`),
  ADD CONSTRAINT `fk_hocsinh_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Các ràng buộc cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD CONSTRAINT `lichtrinh_ibfk_1` FOREIGN KEY (`mahs`) REFERENCES `hocsinh` (`mahs`),
  ADD CONSTRAINT `lichtrinh_ibfk_2` FOREIGN KEY (`maxe`) REFERENCES `xebuyt` (`maxe`);

--
-- Các ràng buộc cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  ADD CONSTRAINT `quanlyxebuyt_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Các ràng buộc cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD CONSTRAINT `taixe_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Các ràng buộc cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `fk_thongbao_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Các ràng buộc cho bảng `vitri`
--
ALTER TABLE `vitri`
  ADD CONSTRAINT `vitri_ibfk_1` FOREIGN KEY (`maxe`) REFERENCES `xebuyt` (`maxe`);

--
-- Các ràng buộc cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD CONSTRAINT `xebuyt_ibfk_1` FOREIGN KEY (`mataixe`) REFERENCES `taixe` (`mataixe`),
  ADD CONSTRAINT `xebuyt_ibfk_2` FOREIGN KEY (`maql`) REFERENCES `quanlyxebuyt` (`maql`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
