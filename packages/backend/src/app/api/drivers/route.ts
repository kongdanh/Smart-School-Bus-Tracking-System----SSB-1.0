import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Hàm helper để chuyển đổi trạng thái từ DB sang màu sắc cho frontend
function getStatusColor(status: string | null): string {
    switch (status) {
        case 'Đang lái':
            return 'success';
        case 'Nghỉ phép':
            return 'warning';
        case 'Sẵn sàng':
        default:
            return 'info';
    }
}

export async function GET() {
    try {
        const driversFromDb = await prisma.taixe.findMany({
            include: {
                user: { // Lấy thông tin liên quan từ bảng user
                    select: {
                        soDienThoai: true,
                        email: true
                    }
                }
            }
        });

        // Chuyển đổi dữ liệu từ database sang cấu trúc mà frontend mong đợi
        const formattedDrivers = driversFromDb.map(driver => {
            // Tự động tạo avatar từ 2 chữ cái đầu của họ và tên
            const avatar = driver.hoTen.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

            return {
                id: `TX${String(driver.taiXeId).padStart(3, '0')}`, // Ví dụ: TX001
                name: driver.hoTen,
                avatar: avatar,
                phone: driver.user?.soDienThoai || 'Chưa cập nhật',
                
                // Lưu ý: Các thông tin này cần logic phức tạp hơn để lấy từ lịch trình
                // Tạm thời để giá trị mặc định
                busNumber: "Chưa phân công",
                route: "Chưa phân công",
                
                status: driver.trangThai || "Sẵn sàng",
                statusColor: getStatusColor(driver.trangThai),
                
                // Lưu ý: "Kinh nghiệm" không có trong schema, bạn cần thêm vào DB
                // hoặc tính toán nếu có trường ngày vào làm. Tạm thời để mặc định.
                experience: "N/A" 
            };
        });

        
        return NextResponse.json(formattedDrivers);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách tài xế:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}