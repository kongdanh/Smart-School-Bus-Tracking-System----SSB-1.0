// packages/backend/src/app/api/driver/schedule/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const driverId = 1;
        const targetDate = new Date('2025-10-13');

        // Sử dụng tên model và tên quan hệ viết thường
        const schedules = await prisma.lichtrinh.findMany({
            where: {
                taiXeId: driverId,
                ngay: targetDate,
            },
            include: {
                tuyenduong: { // tên quan hệ cũng phải viết thường
                    select: {
                        tenTuyen: true,
                    },
                },
                xebuyt: { // tên quan hệ cũng phải viết thường
                    select: {
                        bienSo: true,
                    },
                },
            },
        });

        if (!schedules || schedules.length === 0) {
            return NextResponse.json({ message: `Không tìm thấy lịch trình.` }, { status: 404 });
        }

        return NextResponse.json(schedules);
    } catch (error) {
        console.error("Lỗi khi lấy lịch trình:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}