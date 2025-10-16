-- CreateTable
CREATE TABLE `user` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userCode` VARCHAR(191) NOT NULL,
    `hoTen` VARCHAR(191) NULL,
    `soDienThoai` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `user_userCode_key`(`userCode`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quanlyxebuyt` (
    `quanLyId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `quanlyxebuyt_userId_key`(`userId`),
    PRIMARY KEY (`quanLyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taixe` (
    `taiXeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `hoTen` VARCHAR(191) NOT NULL,
    `trangThai` VARCHAR(191) NULL,

    UNIQUE INDEX `taixe_userId_key`(`userId`),
    PRIMARY KEY (`taiXeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phuhuynh` (
    `phuHuynhId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `phuhuynh_userId_key`(`userId`),
    PRIMARY KEY (`phuHuynhId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocsinh` (
    `hocSinhId` INTEGER NOT NULL AUTO_INCREMENT,
    `maHS` VARCHAR(191) NOT NULL,
    `hoTen` VARCHAR(191) NULL,
    `lop` VARCHAR(191) NULL,
    `diemDon` VARCHAR(191) NULL,
    `diemTra` VARCHAR(191) NULL,
    `phuHuynhId` INTEGER NULL,

    UNIQUE INDEX `hocsinh_maHS_key`(`maHS`),
    PRIMARY KEY (`hocSinhId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xebuyt` (
    `xeBuytId` INTEGER NOT NULL AUTO_INCREMENT,
    `maXe` VARCHAR(191) NOT NULL,
    `bienSo` VARCHAR(191) NULL,
    `sucChua` INTEGER NULL,
    `trangThai` VARCHAR(191) NULL,

    UNIQUE INDEX `xebuyt_maXe_key`(`maXe`),
    PRIMARY KEY (`xeBuytId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vitri` (
    `viTriId` INTEGER NOT NULL AUTO_INCREMENT,
    `xeBuytId` INTEGER NOT NULL,
    `vido` DOUBLE NULL,
    `kinhdo` DOUBLE NULL,
    `thoiGian` DATETIME(3) NULL,

    PRIMARY KEY (`viTriId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diemdung` (
    `diemDungId` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDiemDung` VARCHAR(191) NOT NULL,
    `diaChi` VARCHAR(191) NULL,

    PRIMARY KEY (`diemDungId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuyenduong` (
    `tuyenDuongId` INTEGER NOT NULL AUTO_INCREMENT,
    `maTuyen` VARCHAR(191) NOT NULL,
    `tenTuyen` VARCHAR(191) NULL,

    UNIQUE INDEX `tuyenduong_maTuyen_key`(`maTuyen`),
    PRIMARY KEY (`tuyenDuongId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuyenduong_diemdung` (
    `tuyenDuongId` INTEGER NOT NULL,
    `diemDungId` INTEGER NOT NULL,
    `thuTu` INTEGER NOT NULL,

    PRIMARY KEY (`tuyenDuongId`, `diemDungId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lichtrinh` (
    `lichTrinhId` INTEGER NOT NULL AUTO_INCREMENT,
    `maLich` VARCHAR(191) NOT NULL,
    `ngay` DATE NULL,
    `gioKhoiHanh` TIME(0) NULL,
    `gioKetThuc` TIME(0) NULL,
    `tuyenDuongId` INTEGER NULL,
    `taiXeId` INTEGER NULL,
    `xeBuytId` INTEGER NULL,

    UNIQUE INDEX `lichtrinh_maLich_key`(`maLich`),
    PRIMARY KEY (`lichTrinhId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thongbao` (
    `thongBaoId` INTEGER NOT NULL AUTO_INCREMENT,
    `phuHuynhId` INTEGER NULL,
    `noiDung` VARCHAR(191) NULL,
    `loai` VARCHAR(191) NULL,
    `thoiGianGui` DATETIME(3) NULL,

    PRIMARY KEY (`thongBaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quanlyxebuyt` ADD CONSTRAINT `quanlyxebuyt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taixe` ADD CONSTRAINT `taixe_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phuhuynh` ADD CONSTRAINT `phuhuynh_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocsinh` ADD CONSTRAINT `hocsinh_phuHuynhId_fkey` FOREIGN KEY (`phuHuynhId`) REFERENCES `phuhuynh`(`phuHuynhId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vitri` ADD CONSTRAINT `vitri_xeBuytId_fkey` FOREIGN KEY (`xeBuytId`) REFERENCES `xebuyt`(`xeBuytId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tuyenduong_diemdung` ADD CONSTRAINT `tuyenduong_diemdung_tuyenDuongId_fkey` FOREIGN KEY (`tuyenDuongId`) REFERENCES `tuyenduong`(`tuyenDuongId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tuyenduong_diemdung` ADD CONSTRAINT `tuyenduong_diemdung_diemDungId_fkey` FOREIGN KEY (`diemDungId`) REFERENCES `diemdung`(`diemDungId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtrinh` ADD CONSTRAINT `lichtrinh_tuyenDuongId_fkey` FOREIGN KEY (`tuyenDuongId`) REFERENCES `tuyenduong`(`tuyenDuongId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtrinh` ADD CONSTRAINT `lichtrinh_xeBuytId_fkey` FOREIGN KEY (`xeBuytId`) REFERENCES `xebuyt`(`xeBuytId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtrinh` ADD CONSTRAINT `lichtrinh_taiXeId_fkey` FOREIGN KEY (`taiXeId`) REFERENCES `taixe`(`taiXeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thongbao` ADD CONSTRAINT `thongbao_phuHuynhId_fkey` FOREIGN KEY (`phuHuynhId`) REFERENCES `phuhuynh`(`phuHuynhId`) ON DELETE CASCADE ON UPDATE CASCADE;
