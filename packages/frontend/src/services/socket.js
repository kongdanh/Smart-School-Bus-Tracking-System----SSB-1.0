import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return this.socket;

        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token; // Assuming token is stored in user object or separately

        this.socket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        if (!this.socket) {
            return this.connect();
        }
        return this.socket;
    }

    // Helper to join a room
    joinRoom(room) {
        if (this.socket) {
            this.socket.emit('join_room', room);
        }
    }

    // Helper to leave a room
    leaveRoom(room) {
        if (this.socket) {
            this.socket.emit('leave_room', room);
        }
    }
}

export default new SocketService();
