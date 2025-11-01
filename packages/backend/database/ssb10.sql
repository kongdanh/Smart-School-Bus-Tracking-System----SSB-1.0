-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 01, 2025 lúc 08:08 AM
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
-- Cơ sở dữ liệu: `ssb10`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diemdung`
--

CREATE TABLE `diemdung` (
  `diemDungId` int(11) NOT NULL,
  `tenDiemDung` varchar(191) NOT NULL,
  `diaChi` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `diemdung`
--

INSERT INTO `diemdung` (`diemDungId`, `tenDiemDung`, `diaChi`) VALUES
(1, 'Điểm 1', 'Q.Bình Thạnh'),
(2, 'Điểm 2', 'Q.3'),
(3, 'Điểm 3', 'Q.1'),
(4, 'Điểm 4', 'Q.1'),
(5, 'Điểm 5', 'Q.1'),
(6, 'Điểm 6', 'Q.1'),
(7, 'Điểm 7', 'Q.3'),
(8, 'Điểm 8', 'Q.3'),
(9, 'Điểm 9', 'Q.Bình Thạnh'),
(10, 'Điểm 10', 'Q.2');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocsinh`
--

CREATE TABLE `hocsinh` (
  `hocSinhId` int(11) NOT NULL,
  `maHS` varchar(191) NOT NULL,
  `hoTen` varchar(191) DEFAULT NULL,
  `lop` varchar(191) DEFAULT NULL,
  `diemDon` varchar(191) DEFAULT NULL,
  `diemTra` varchar(191) DEFAULT NULL,
  `phuHuynhId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hocsinh`
--

INSERT INTO `hocsinh` (`hocSinhId`, `maHS`, `hoTen`, `lop`, `diemDon`, `diemTra`, `phuHuynhId`) VALUES
(1, 'HS001', 'Hoàng Gia An', '1A', 'Ngã tư Hàng Xanh', 'Cổng trường', 1),
(2, 'HS002', 'Bùi Minh Khôi', '1B', 'Vòng xoay Dân Chủ', 'Cổng trường', 2),
(3, 'HS003', 'Đặng Tuệ Nhi', '2A', 'Nhà thờ Đức Bà', 'Cổng trường', 3),
(4, 'HS004', 'Ngô Bảo Châu', '2C', 'Chợ Bến Thành', 'Cổng trường', 4),
(5, 'HS005', 'Dương Quốc Trung', '3B', 'Công viên Tao Đàn', 'Cổng trường', 5),
(6, 'HS006', 'Trần Gia Hân', '3A', 'Dinh Độc Lập', 'Cổng trường', 1),
(7, 'HS007', 'Nguyễn Ngọc Mai', '4D', 'Bảo tàng Chứng tích', 'Cổng trường', 2),
(8, 'HS008', 'Lê Tuấn Kiệt', '4A', 'Hồ Con Rùa', 'Cổng trường', 3),
(9, 'HS009', 'Phạm Anh Thư', '5B', 'Landmark 81', 'Cổng trường', 4),
(10, 'HS010', 'Võ Hoàng Yến', '5C', 'Cầu Sài Gòn', 'Cổng trường', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `lichTrinhId` int(11) NOT NULL,
  `maLich` varchar(191) NOT NULL,
  `ngay` date DEFAULT NULL,
  `gioKhoiHanh` time DEFAULT NULL,
  `gioKetThuc` time DEFAULT NULL,
  `tuyenDuongId` int(11) DEFAULT NULL,
  `taiXeId` int(11) DEFAULT NULL,
  `xeBuytId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lichtrinh`
--

INSERT INTO `lichtrinh` (`lichTrinhId`, `maLich`, `ngay`, `gioKhoiHanh`, `gioKetThuc`, `tuyenDuongId`, `taiXeId`, `xeBuytId`) VALUES
(1, 'LT001', '2025-10-13', '06:30:00', '07:30:00', 1, 1, 1),
(2, 'LT002', '2025-10-13', '06:45:00', '07:45:00', 2, 2, 2),
(3, 'LT003', '2025-10-13', '07:00:00', '08:00:00', 3, 3, 3),
(4, 'LT004', '2025-10-14', '06:30:00', '07:30:00', 1, 1, 4),
(5, 'LT005', '2025-10-14', '06:45:00', '07:45:00', 2, 2, 5),
(6, 'LT006', '2025-10-14', '07:00:00', '08:00:00', 3, 3, 6),
(7, 'LT007', '2025-10-15', '06:30:00', '07:30:00', 1, 1, 7),
(8, 'LT008', '2025-10-15', '06:45:00', '07:45:00', 4, 2, 8),
(9, 'LT009', '2025-10-15', '07:00:00', '08:00:00', 5, 3, 9),
(10, 'LT010', '2025-10-16', '06:30:00', '07:30:00', 1, 1, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `phuHuynhId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phuhuynh`
--

INSERT INTO `phuhuynh` (`phuHuynhId`, `userId`) VALUES
(1, 4),
(2, 5),
(3, 6),
(4, 7),
(5, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanlyxebuyt`
--

CREATE TABLE `quanlyxebuyt` (
  `quanLyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quanlyxebuyt`
--

INSERT INTO `quanlyxebuyt` (`quanLyId`, `userId`) VALUES
(1, 1),
(2, 2),
(3, 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taixe`
--

CREATE TABLE `taixe` (
  `taiXeId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `hoTen` varchar(191) NOT NULL,
  `trangThai` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `taixe`
--

INSERT INTO `taixe` (`taiXeId`, `userId`, `hoTen`, `trangThai`) VALUES
(1, 3, 'Phạm Hùng Dũng', 'Rảnh'),
(2, 9, 'Võ Anh Tuấn', 'Đang lái'),
(3, NULL, 'Đặng Minh Trí', 'Nghỉ phép'),
(4, NULL, 'Lê Văn Thiện', 'Rảnh'),
(5, NULL, 'Trần Quốc Toản', 'Rảnh'),
(6, NULL, 'Nguyễn Anh Dũng', 'Đang lái'),
(7, NULL, 'Hoàng Phúc', 'Rảnh'),
(8, NULL, 'Mai Văn Sơn', 'Rảnh'),
(9, NULL, 'Phan Thanh Bình', 'Nghỉ phép'),
(10, NULL, 'Bùi Tấn Trường', 'Rảnh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `thongBaoId` int(11) NOT NULL,
  `phuHuynhId` int(11) DEFAULT NULL,
  `noiDung` varchar(191) DEFAULT NULL,
  `loai` varchar(191) DEFAULT NULL,
  `thoiGianGui` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thongbao`
--

INSERT INTO `thongbao` (`thongBaoId`, `phuHuynhId`, `noiDung`, `loai`, `thoiGianGui`) VALUES
(1, 1, 'Xe sắp đến điểm đón.', 'Thông báo', '2025-10-11 19:17:47.000'),
(2, 2, 'Xe sẽ trễ khoảng 10 phút.', 'Cảnh báo', '2025-10-11 19:17:47.000'),
(3, 3, 'Học sinh đã lên xe an toàn.', 'Điểm danh', '2025-10-11 19:17:47.000'),
(4, 4, 'Học sinh đã được trả tại trường.', 'Điểm danh', '2025-10-11 19:17:47.000'),
(5, 5, 'Lịch trình tuần tới có thay đổi.', 'Thông báo', '2025-10-11 19:17:47.000'),
(6, 1, 'Nhắc nhở thanh toán phí xe buýt.', 'Thông báo', '2025-10-11 19:17:47.000'),
(7, 2, 'Xe đang gặp sự cố nhỏ.', 'Cảnh báo', '2025-10-11 19:17:47.000'),
(8, 3, 'Thay đổi tài xế cho tuyến A.', 'Thông báo', '2025-10-11 19:17:47.000'),
(9, 4, 'Xe đã đến trường.', 'Thông báo', '2025-10-11 19:17:47.000'),
(10, 5, 'Xe bắt đầu khởi hành.', 'Thông báo', '2025-10-11 19:17:47.000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `tuyenDuongId` int(11) NOT NULL,
  `maTuyen` varchar(191) NOT NULL,
  `tenTuyen` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong`
--

INSERT INTO `tuyenduong` (`tuyenDuongId`, `maTuyen`, `tenTuyen`) VALUES
(1, 'T01', 'Tuyến A'),
(2, 'T02', 'Tuyến B'),
(3, 'T03', 'Tuyến C'),
(4, 'T04', 'Tuyến D'),
(5, 'T05', 'Tuyến E');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong_diemdung`
--

CREATE TABLE `tuyenduong_diemdung` (
  `tuyenDuongId` int(11) NOT NULL,
  `diemDungId` int(11) NOT NULL,
  `thuTu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong_diemdung`
--

INSERT INTO `tuyenduong_diemdung` (`tuyenDuongId`, `diemDungId`, `thuTu`) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(2, 9, 1),
(2, 10, 2),
(3, 5, 3),
(3, 7, 2),
(3, 8, 1),
(4, 1, 1),
(4, 10, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userCode` varchar(191) NOT NULL,
  `hoTen` varchar(191) DEFAULT NULL,
  `soDienThoai` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`userId`, `userCode`, `hoTen`, `soDienThoai`, `email`, `password`) VALUES
(1, 'QL001', 'Trần Văn Quản Lý', '0901112221', 'quanly1@email.com', '123456'),
(2, 'QL002', 'Nguyễn Thị Điều Phối', '0901112222', 'quanly2@email.com', '123456'),
(3, 'TX001', 'Phạm Hùng Dũng', '0912223331', 'taixe1@email.com', '123456'),
(4, 'PH001', 'Hoàng Thị Lan', '0987654321', 'phuhuynh1@email.com', '123456'),
(5, 'PH002', 'Bùi Văn Nam', '0987654322', 'phuhuynh2@email.com', '123456'),
(6, 'PH003', 'Đặng Mỹ Lệ', '0987654323', 'phuhuynh3@email.com', '123456'),
(7, 'PH004', 'Ngô Thanh Tâm', '0987654324', 'phuhuynh4@email.com', '123456'),
(8, 'QL003', 'Lê Văn C', '0901112223', 'quanly3@email.com', '123456'),
(9, 'TX002', 'Võ Anh Tuấn', '0912223332', 'taixe2@email.com', '123456'),
(10, 'PH005', 'Dương Minh Long', '0987654325', 'phuhuynh5@email.com', '123456');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vitri`
--

CREATE TABLE `vitri` (
  `viTriId` int(11) NOT NULL,
  `xeBuytId` int(11) NOT NULL,
  `vido` double DEFAULT NULL,
  `kinhdo` double DEFAULT NULL,
  `thoiGian` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xebuyt`
--

CREATE TABLE `xebuyt` (
  `xeBuytId` int(11) NOT NULL,
  `maXe` varchar(191) NOT NULL,
  `bienSo` varchar(191) DEFAULT NULL,
  `sucChua` int(11) DEFAULT NULL,
  `trangThai` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `xebuyt`
--

INSERT INTO `xebuyt` (`xeBuytId`, `maXe`, `bienSo`, `sucChua`, `trangThai`) VALUES
(1, 'XE01', '51B-111.11', 29, 'Sẵn sàng'),
(2, 'XE02', '51B-222.22', 16, 'Sẵn sàng'),
(3, 'XE03', '51B-333.33', 16, 'Đang chạy'),
(4, 'XE04', '51B-444.44', 29, 'Bảo trì'),
(5, 'XE05', '51B-555.55', 16, 'Sẵn sàng'),
(6, 'XE06', '51B-666.66', 29, 'Sẵn sàng'),
(7, 'XE07', '51B-777.77', 16, 'Đang chạy'),
(8, 'XE08', '51B-888.88', 29, 'Sẵn sàng'),
(9, 'XE09', '51B-999.99', 16, 'Bảo trì'),
(10, 'XE10', '51B-000.00', 29, 'Sẵn sàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('16d8133e-ce1b-4e61-b2cd-ed58c0decbc8', '259932065b02bef8b88378d5fd18ea2bf53c4364ff8de0ab1b54d5d957fc2ebe', '2025-10-11 12:17:10.743', '20251011121710_init', NULL, NULL, '2025-10-11 12:17:10.125', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  ADD PRIMARY KEY (`diemDungId`);

--
-- Chỉ mục cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`hocSinhId`),
  ADD UNIQUE KEY `hocsinh_maHS_key` (`maHS`),
  ADD KEY `hocsinh_phuHuynhId_fkey` (`phuHuynhId`);

--
-- Chỉ mục cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`lichTrinhId`),
  ADD UNIQUE KEY `lichtrinh_maLich_key` (`maLich`),
  ADD KEY `lichtrinh_tuyenDuongId_fkey` (`tuyenDuongId`),
  ADD KEY `lichtrinh_xeBuytId_fkey` (`xeBuytId`),
  ADD KEY `lichtrinh_taiXeId_fkey` (`taiXeId`);

--
-- Chỉ mục cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`phuHuynhId`),
  ADD UNIQUE KEY `phuhuynh_userId_key` (`userId`);

--
-- Chỉ mục cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  ADD PRIMARY KEY (`quanLyId`),
  ADD UNIQUE KEY `quanlyxebuyt_userId_key` (`userId`);

--
-- Chỉ mục cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`taiXeId`),
  ADD UNIQUE KEY `taixe_userId_key` (`userId`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`thongBaoId`),
  ADD KEY `thongbao_phuHuynhId_fkey` (`phuHuynhId`);

--
-- Chỉ mục cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`tuyenDuongId`),
  ADD UNIQUE KEY `tuyenduong_maTuyen_key` (`maTuyen`);

--
-- Chỉ mục cho bảng `tuyenduong_diemdung`
--
ALTER TABLE `tuyenduong_diemdung`
  ADD PRIMARY KEY (`tuyenDuongId`,`diemDungId`),
  ADD KEY `tuyenduong_diemdung_diemDungId_fkey` (`diemDungId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `user_userCode_key` (`userCode`);

--
-- Chỉ mục cho bảng `vitri`
--
ALTER TABLE `vitri`
  ADD PRIMARY KEY (`viTriId`),
  ADD KEY `vitri_xeBuytId_fkey` (`xeBuytId`);

--
-- Chỉ mục cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD PRIMARY KEY (`xeBuytId`),
  ADD UNIQUE KEY `xebuyt_maXe_key` (`maXe`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `diemdung`
--
ALTER TABLE `diemdung`
  MODIFY `diemDungId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  MODIFY `hocSinhId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `lichTrinhId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  MODIFY `phuHuynhId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  MODIFY `quanLyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `taixe`
--
ALTER TABLE `taixe`
  MODIFY `taiXeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `thongBaoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  MODIFY `tuyenDuongId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `vitri`
--
ALTER TABLE `vitri`
  MODIFY `viTriId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  MODIFY `xeBuytId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `hocsinh_phuHuynhId_fkey` FOREIGN KEY (`phuHuynhId`) REFERENCES `phuhuynh` (`phuHuynhId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD CONSTRAINT `lichtrinh_taiXeId_fkey` FOREIGN KEY (`taiXeId`) REFERENCES `taixe` (`taiXeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lichtrinh_tuyenDuongId_fkey` FOREIGN KEY (`tuyenDuongId`) REFERENCES `tuyenduong` (`tuyenDuongId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lichtrinh_xeBuytId_fkey` FOREIGN KEY (`xeBuytId`) REFERENCES `xebuyt` (`xeBuytId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD CONSTRAINT `phuhuynh_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `quanlyxebuyt`
--
ALTER TABLE `quanlyxebuyt`
  ADD CONSTRAINT `quanlyxebuyt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD CONSTRAINT `taixe_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `thongbao_phuHuynhId_fkey` FOREIGN KEY (`phuHuynhId`) REFERENCES `phuhuynh` (`phuHuynhId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tuyenduong_diemdung`
--
ALTER TABLE `tuyenduong_diemdung`
  ADD CONSTRAINT `tuyenduong_diemdung_diemDungId_fkey` FOREIGN KEY (`diemDungId`) REFERENCES `diemdung` (`diemDungId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tuyenduong_diemdung_tuyenDuongId_fkey` FOREIGN KEY (`tuyenDuongId`) REFERENCES `tuyenduong` (`tuyenDuongId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `vitri`
--
ALTER TABLE `vitri`
  ADD CONSTRAINT `vitri_xeBuytId_fkey` FOREIGN KEY (`xeBuytId`) REFERENCES `xebuyt` (`xeBuytId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
