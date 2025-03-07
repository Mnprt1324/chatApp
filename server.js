const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

let onlineUsers = 0;

io.on('connection', (socket) => {
    onlineUsers++;
    io.emit('onlineUsers', onlineUsers);
    console.log(`A user connected. Online users: ${onlineUsers}`);
    
    socket.on('message', (data) => {
        io.emit('message', data);
    });
    
    socket.on('disconnect', () => {
        onlineUsers = Math.max(0, onlineUsers - 1); // Ensure onlineUsers never goes below 0
        io.emit('onlineUsers', onlineUsers);
        console.log(`User disconnected. Online users: ${onlineUsers}`);
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
