// backend/controller/studentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả học sinh
exports.getAllStudents = async (req, res) => {
    try {
        const students = await prisma.hocsinh.findMany({
            include: {
                phuhuynh: {
                    include: {
                        user: {
                            select: {
                                hoTen: true,
                                soDienThoai: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                hoTen: 'asc'
            }
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách học sinh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Lấy học sinh theo ID
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await prisma.hocsinh.findUnique({
            where: {
                hocSinhId: parseInt(id)
            },
            include: {
                phuhuynh: {
                    include: {
                        user: {
                            select: {
                                hoTen: true,
                                soDienThoai: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get student by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin học sinh'
        });
    }
};

// Thêm học sinh mới
exports.createStudent = async (req, res) => {
    try {
        const { maHS, hoTen, lop, diemDon, diemTra, phuHuynhId } = req.body;

        // Validate
        if (!maHS || !hoTen) {
            return res.status(400).json({
                success: false,
                message: 'Mã học sinh và họ tên là bắt buộc'
            });
        }

        // Kiểm tra trùng mã học sinh
        const existingStudent = await prisma.hocsinh.findUnique({
            where: { maHS }
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Mã học sinh đã tồn tại'
            });
        }

        // Nếu có phụ huynh, kiểm tra phụ huynh có tồn tại không
        if (phuHuynhId) {
            const parent = await prisma.phuhuynh.findUnique({
                where: { phuHuynhId: parseInt(phuHuynhId) }
            });

            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy phụ huynh'
                });
            }
        }

        const student = await prisma.hocsinh.create({
            data: {
                maHS,
                hoTen,
                lop,
                diemDon,
                diemTra,
                phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null
            },
            include: {
                phuhuynh: {
                    include: {
                        user: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm học sinh thành công',
            data: student
        });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm học sinh'
        });
    }
};

// Cập nhật học sinh
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { maHS, hoTen, lop, diemDon, diemTra, phuHuynhId } = req.body;

        // Kiểm tra học sinh có tồn tại không
        const existingStudent = await prisma.hocsinh.findUnique({
            where: { hocSinhId: parseInt(id) }
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        // Kiểm tra trùng mã học sinh (nếu đổi mã)
        if (maHS && maHS !== existingStudent.maHS) {
            const duplicateStudent = await prisma.hocsinh.findUnique({
                where: { maHS }
            });

            if (duplicateStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã học sinh đã tồn tại'
                });
            }
        }

        const student = await prisma.hocsinh.update({
            where: {
                hocSinhId: parseInt(id)
            },
            data: {
                maHS,
                hoTen,
                lop,
                diemDon,
                diemTra,
                phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null
            },
            include: {
                phuhuynh: {
                    include: {
                        user: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Cập nhật học sinh thành công',
            data: student
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật học sinh'
        });
    }
};

// Xóa học sinh
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await prisma.hocsinh.findUnique({
            where: { hocSinhId: parseInt(id) }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        await prisma.hocsinh.delete({
            where: { hocSinhId: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Xóa học sinh thành công'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa học sinh'
        });
    }
};

// Lấy học sinh theo phụ huynh
exports.getStudentsByParent = async (req, res) => {
    try {
        const { parentId } = req.params;

        const students = await prisma.hocsinh.findMany({
            where: {
                phuHuynhId: parseInt(parentId)
            },
            include: {
                phuhuynh: {
                    include: {
                        user: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get students by parent error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách học sinh của phụ huynh'
        });
    }
};

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});