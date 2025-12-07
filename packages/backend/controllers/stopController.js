const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả điểm dừng
exports.getAllStops = async (req, res) => {
    try {
        const stops = await prisma.diemdung.findMany({
            orderBy: {
                tenDiemDung: 'asc'
            }
        });
        res.json({
            success: true,
            data: stops
        });
    } catch (error) {
        console.error('Get all stops error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách điểm dừng'
        });
    }
};

// Tạo điểm dừng mới
exports.createStop = async (req, res) => {
    try {
        const { tenDiemDung, diaChi, vido, kinhdo } = req.body;

        if (!tenDiemDung) {
            return res.status(400).json({
                success: false,
                message: 'Tên điểm dừng là bắt buộc'
            });
        }

        const newStop = await prisma.diemdung.create({
            data: {
                tenDiemDung,
                diaChi,
                vido: vido ? parseFloat(vido) : null,
                kinhdo: kinhdo ? parseFloat(kinhdo) : null
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tạo điểm dừng thành công',
            data: newStop
        });
    } catch (error) {
        console.error('Create stop error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo điểm dừng'
        });
    }
};

// Cập nhật điểm dừng
exports.updateStop = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenDiemDung, diaChi, vido, kinhdo } = req.body;

        const updatedStop = await prisma.diemdung.update({
            where: { diemDungId: parseInt(id) },
            data: {
                tenDiemDung,
                diaChi,
                vido: vido ? parseFloat(vido) : null,
                kinhdo: kinhdo ? parseFloat(kinhdo) : null
            }
        });

        res.json({
            success: true,
            message: 'Cập nhật điểm dừng thành công',
            data: updatedStop
        });
    } catch (error) {
        console.error('Update stop error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật điểm dừng'
        });
    }
};

// Xóa điểm dừng
exports.deleteStop = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem điểm dừng có đang được sử dụng trong tuyến nào không
        const usage = await prisma.tuyenduong_diemdung.findFirst({
            where: { diemDungId: parseInt(id) }
        });

        if (usage) {
            return res.status(400).json({
                success: false,
                message: 'Điểm dừng đang được sử dụng trong tuyến đường, không thể xóa'
            });
        }

        await prisma.diemdung.delete({
            where: { diemDungId: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Xóa điểm dừng thành công'
        });
    } catch (error) {
        console.error('Delete stop error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa điểm dừng'
        });
    }
};
