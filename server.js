const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require("path");
const app = express();
const server = http.createServer(app);
 

// Serve static files
app.use(express.static('public'));

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update as needed)
    methods: ["GET", "POST"]
  }
});

// Track connected users
const users = {};

app.get("/terms", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "terms-condition.html"));
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining the chat
    socket.on('join', ({ username, gender }) => {
        users[socket.id] = { id: socket.id, username, gender: gender || 'Unknown' }; // Default to "Unknown" if gender is missing
        io.emit('updateUsers', Object.values(users)); // Broadcast updated user list
        socket.broadcast.emit('message', { username: 'System', text: `${username} has joined the chat.` });
    });

    // Handle sending messages
    socket.on('sendMessage', ({ text }) => {
        const user = users[socket.id];
        io.emit('message', { username: user.username, text });
    });

    // Handle private messages
    socket.on('privateMessage', ({ to, text }) => {
        const sender = users[socket.id];
        const recipientSocketId = Object.keys(users).find(id => users[id].username === to);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('privateMessage', { from: sender.username, text });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            delete users[socket.id];
            io.emit('updateUsers', Object.values(users)); // Broadcast updated user list
            io.emit('message', { username: 'System', text: `${user.username} has left the chat.` });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
