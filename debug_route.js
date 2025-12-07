
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRoute() {
    const LICH_TRINH_ID = 4;
    const schedule = await prisma.lichtrinh.findUnique({
        where: { lichTrinhId: LICH_TRINH_ID },
        include: {
            tuyenduong: {
                include: {
                    tuyenduong_diemdung: {
                        include: { diemdung: true },
                        orderBy: { thuTu: 'asc' }
                    }
                }
            }
        }
    });

    if (!schedule) {
        console.log("Schedule not found");
        return;
    }

    console.log(`Schedule ID: ${schedule.lichTrinhId}`);
    console.log(`Type: ${schedule.loai || 'N/A'}`); // Check type
    console.log(`Route Name: ${schedule.tuyenduong.tenTuyen}`);
    console.log("Stops:");
    schedule.tuyenduong.tuyenduong_diemdung.forEach(td => {
        console.log(`- [${td.thuTu}] ${td.diemdung.tenDiemDung} (${td.diemdung.vido}, ${td.diemdung.kinhdo})`);
    });
}

checkRoute()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
