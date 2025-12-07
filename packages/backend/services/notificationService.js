const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socket = require('../socket');

exports.sendNotification = async (userId, title, message, type = 'info') => {
    try {
        // 1. Find Parent ID if userId is a User ID
        // Assuming userId passed is the User ID (from auth)
        // We need to find the linked Parent profile to save to 'thongbao' table which uses 'phuHuynhId'
        // Or maybe 'thongbao' uses userId? Let's check schema.

        // Checking schema from previous context...
        // model thongbao { ... phuHuynhId Int ... }
        // So we need phuHuynhId.

        const parent = await prisma.phuhuynh.findUnique({
            where: { userId: parseInt(userId) }
        });

        if (!parent) {
            console.log(`User ${userId} is not a parent, skipping DB save for notification.`);
            // Still emit socket to user room though
        } else {
            // Save to DB
            await prisma.thongbao.create({
                data: {
                    phuhuynh: {
                        connect: { phuHuynhId: parent.phuHuynhId }
                    },
                    noiDung: `${title}: ${message}`,
                    loai: type,
                    daDoc: false,
                    thoiGianGui: new Date()
                }
            });
        }

        // 2. Emit Socket Event
        const io = socket.getIO();
        io.to(`user_${userId}`).emit('NEW_NOTIFICATION', {
            title,
            message,
            type,
            timestamp: new Date()
        });

        console.log(`Notification sent to User ${userId}: ${title}`);

    } catch (error) {
        console.error('Send notification error:', error);
    }
};

exports.broadcastToTrip = (tripId, event, data) => {
    try {
        const io = socket.getIO();
        io.to(`trip_${tripId}`).emit(event, data);
    } catch (error) {
        console.error('Broadcast error:', error);
    }
};
