// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve your HTML file
app.use(express.static('public')); 

// Store all connected players
let players = {};

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);
    
    // Create a new player profile when they join
    players[socket.id] = { 
        x: 2000, // Spawn in middle of MAP_SIZE
        y: 2000, 
        health: 100,
        color: '#00bfff', // Default assault color
        angle: 0
    };

    // Listen for movement/aim updates from the client
    socket.on('playerInput', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
    });
});

// Broadcast the game state to ALL players 60 times a second
setInterval(() => {
    io.emit('gameState', players);
}, 1000 / 60);

http.listen(3000, () => {
    console.log('Server running on port 3000');
});