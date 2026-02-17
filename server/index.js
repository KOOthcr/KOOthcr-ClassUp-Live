const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Health Check Route for Render
app.get('/', (req, res) => {
    res.send('ClassUp Server is Running! 🚀');
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity (or specify client URL)
        methods: ["GET", "POST"]
    }
});

// In-memory storage for room data (Encrypted State)
// Map<RoomID, { encryptedData: string, lastUpdated: number, hostId: string }>
const rooms = new Map();

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join Room
    // Client sends: { roomId: string, isHost: boolean }
    socket.on('join_room', ({ roomId, isHost }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId} (Host: ${isHost})`);

        // If room exists, send current encrypted state to the new user
        if (rooms.has(roomId)) {
            const roomData = rooms.get(roomId);
            socket.emit('sync_data', roomData.encryptedData);
        } else {
            // New room (first user is likely host)
            if (isHost) {
                rooms.set(roomId, { encryptedData: null, lastUpdated: Date.now(), hostId: socket.id });
            }
        }
    });

    // Update Room State (Sync Data)
    // Client sends: { roomId: string, encryptedData: string }
    socket.on('update_state', ({ roomId, encryptedData }) => {
        if (!roomId || !encryptedData) return;

        // Update server memory
        const room = rooms.get(roomId);
        if (room) {
            room.encryptedData = encryptedData;
            room.lastUpdated = Date.now();
            rooms.set(roomId, room);

            // Broadcast to everyone ELSE in the room
            socket.to(roomId).emit('sync_data', encryptedData);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
        // Optional: Clean up empty rooms logic
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
