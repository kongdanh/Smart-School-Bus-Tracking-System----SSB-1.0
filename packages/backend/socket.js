const socketIo = require('socket.io');

let io;

exports.init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all origins for now, restrict in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join room based on user ID (for personal notifications)
        socket.on('join_user_room', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} joined user_${userId}`);
        });

        // Join room based on trip ID (for tracking)
        socket.on('join_trip_room', (tripId) => {
            socket.join(`trip_${tripId}`);
            console.log(`Socket ${socket.id} joined trip_${tripId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
