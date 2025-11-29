// simulator.js - Chạy bằng lệnh: node simulator.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- CẤU HÌNH TỐC ĐỘ CAO (TURBO MODE) ---
const UPDATE_INTERVAL = 500; // Cập nhật cực nhanh (0.5 giây/lần)
const STEPS_BETWEEN_STOPS = 5; // Bước nhảy lớn (chỉ 5 bước là tới trạm kế)

async function runBus() {
    console.log("🚀 KHỞI ĐỘNG XE TỐC ĐỘ CAO (200km/h)...");

    // Tọa độ các điểm dừng chính
    const majorStops = [
        { lat: 10.7716, lng: 106.6995 }, // 1. Trường ABC
        { lat: 10.7876, lng: 106.7032 }, // 2. Thảo Cầm Viên
        { lat: 10.7932, lng: 106.6995 }, // 3. Chợ Tân Định
        { lat: 10.7997, lng: 106.7188 }, // 4. Hàng Xanh
        { lat: 10.7972, lng: 106.7570 }, // 5. Metro An Phú
        { lat: 10.8490, lng: 106.7628 }  // 6. Ngã tư Thủ Đức
    ];

    function generatePath(stops, steps) {
        let fullPath = [];
        for (let i = 0; i < stops.length - 1; i++) {
            const start = stops[i];
            const end = stops[i + 1];
            for (let j = 0; j < steps; j++) {
                const percent = j / steps;
                const lat = start.lat + (end.lat - start.lat) * percent;
                const lng = start.lng + (end.lng - start.lng) * percent;
                fullPath.push({ lat, lng });
            }
        }
        fullPath.push(stops[stops.length - 1]);
        return fullPath;
    }

    const detailedPath = generatePath(majorStops, STEPS_BETWEEN_STOPS);
    let currentStepIndex = 0;
    let direction = 1;

    setInterval(async () => {
        const point = detailedPath[currentStepIndex];

        // Nhiễu GPS cực nhỏ
        const currentLat = point.lat + (Math.random() - 0.5) * 0.00005;
        const currentLng = point.lng + (Math.random() - 0.5) * 0.00005;

        try {
            await prisma.vitri.create({
                data: {
                    xeBuytId: 1,
                    vido: currentLat,
                    kinhdo: currentLng,
                    thoiGian: new Date()
                }
            });

            // Tính % quãng đường
            const percent = Math.round((currentStepIndex / detailedPath.length) * 100);
            console.log(`🏎️ Speed 200km/h: [${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}] - ${percent}%`);

            currentStepIndex += direction;

            if (currentStepIndex >= detailedPath.length - 1) {
                console.log("🔄 Quay đầu xe...");
                direction = -1;
            } else if (currentStepIndex <= 0) {
                console.log("🔄 Xuất phát lại...");
                direction = 1;
            }

        } catch (err) {
            console.error("Lỗi:", err.message);
        }
    }, UPDATE_INTERVAL);
}

runBus();