// simulator.js - Chạy bằng lệnh: node simulator.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios'); // Cần cài axios: npm install axios
const prisma = new PrismaClient();

// --- CẤU HÌNH ---
const UPDATE_INTERVAL = 3000; // Cập nhật vị trí mỗi 3 giây
const BUS_ID = 1; // ID của xe bus muốn chạy

async function getRealRouteFromOSRM(waypoints) {
    try {
        // Tạo chuỗi toạ độ: lng,lat;lng,lat (OSRM cần longitude trước)
        const coordString = waypoints
            .map(p => `${p.lng},${p.lat}`)
            .join(';');

        // Gọi OSRM với option overview=full để lấy toàn bộ điểm uốn lượn
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
        console.log("🌍 Đang tải lộ trình thực tế từ OSRM...");

        const response = await axios.get(url);

        if (response.data.routes && response.data.routes.length > 0) {
            // OSRM trả về mảng [lng, lat], ta cần map ngược lại thành {lat, lng}
            const coordinates = response.data.routes[0].geometry.coordinates;
            return coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
        }
    } catch (error) {
        console.error("❌ Lỗi gọi OSRM:", error.message);
    }
    return null;
}

async function runBus() {
    console.log(`🚀 KHỞI ĐỘNG XE BUS ${BUS_ID} (CHẾ ĐỘ REAL-ROAD)...`);

    // 1. Các trạm dừng chính (Input)
    const majorStops = [
        { lat: 10.7716, lng: 106.6995 }, // Trường ABC
        { lat: 10.7876, lng: 106.7032 }, // Thảo Cầm Viên
        { lat: 10.7932, lng: 106.6995 }, // Chợ Tân Định
        { lat: 10.7997, lng: 106.7188 }, // Hàng Xanh
        { lat: 10.7972, lng: 106.7570 }, // Metro An Phú
        { lat: 10.8490, lng: 106.7628 }  // Thủ Đức
    ];

    // 2. Lấy đường đi thực tế (Uốn lượn)
    let realPath = await getRealRouteFromOSRM(majorStops);

    if (!realPath || realPath.length === 0) {
        console.log("⚠️ Không lấy được đường OSRM, dùng đường thẳng (Fallback)...");
        // Fallback: Tạo đường thẳng nếu mất mạng
        realPath = [];
        for (let i = 0; i < majorStops.length - 1; i++) {
            const start = majorStops[i];
            const end = majorStops[i + 1];
            for (let j = 0; j <= 10; j++) {
                realPath.push({
                    lat: start.lat + (end.lat - start.lat) * (j / 10),
                    lng: start.lng + (end.lng - start.lng) * (j / 10)
                });
            }
        }
    } else {
        console.log(`✅ Đã tải thành công lộ trình thực tế: ${realPath.length} điểm.`);
    }

    // 3. Bắt đầu chạy
    let currentIndex = 0;
    let direction = 1; // 1: đi xuôi, -1: đi ngược

    setInterval(async () => {
        const point = realPath[currentIndex];

        // Thêm nhiễu cực nhỏ để giống GPS thật (tránh trùng lặp hoàn toàn)
        const currentLat = point.lat + (Math.random() - 0.5) * 0.00002;
        const currentLng = point.lng + (Math.random() - 0.5) * 0.00002;

        try {
            await prisma.vitri.create({
                data: {
                    xeBuytId: BUS_ID,
                    vido: currentLat,
                    kinhdo: currentLng,
                    thoiGian: new Date()
                }
            });

            // Log tiến độ
            const percent = Math.round((currentIndex / realPath.length) * 100);
            console.log(`🚌 Bus ${BUS_ID} di chuyển: [${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}] (${percent}%)`);

            // Tăng giảm index để xe chạy đi chạy lại
            currentIndex += direction;

            if (currentIndex >= realPath.length) {
                console.log("🔄 Đến cuối bến, quay đầu...");
                direction = -1;
                currentIndex = realPath.length - 2;
            } else if (currentIndex < 0) {
                console.log("🔄 Về đầu bến, xuất phát lại...");
                direction = 1;
                currentIndex = 1;
            }

        } catch (err) {
            console.error("Lỗi update DB:", err.message);
        }
    }, UPDATE_INTERVAL);
}

runBus();