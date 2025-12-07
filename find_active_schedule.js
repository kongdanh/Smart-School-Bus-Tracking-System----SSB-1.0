
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findSchedules() {
    const BUS_ID = 1;
    console.log(`Finding schedules for Bus ID: ${BUS_ID}...`);

    const schedules = await prisma.lichtrinh.findMany({
        where: {
            xeBuytId: BUS_ID
        },
        include: {
            tuyenduong: true,
            taixe: true
        },
        orderBy: {
            ngay: 'desc'
        },
        take: 5
    });

    if (schedules.length === 0) {
        console.log("No schedules found for this bus.");
    } else {
        console.log("Found schedules:");
        schedules.forEach(s => {
            console.log(`- ID: ${s.lichTrinhId} | Date: ${s.ngay.toISOString().split('T')[0]} | Status: ${s.trangThai} | Route: ${s.tuyenduong?.tenTuyen} | Driver: ${s.taixe?.hoTen}`);
        });
    }
}

findSchedules()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
