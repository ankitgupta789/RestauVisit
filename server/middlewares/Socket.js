const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors());

// Create an HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Create a Map to store email-to-socketId mapping
const emailSocketMap = new Map();

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Listen for join-order-room event
  socket.on('join-order-room', (restaurantEmail) => {
    socket.join(restaurantEmail);

    // Store the email and socket ID in the map
    emailSocketMap.set(restaurantEmail, socket.id);

    console.log(`Restaurant with email ${restaurantEmail} joined the order room.`);
    console.log(`Updated emailSocketMap:`, Array.from(emailSocketMap.entries()));
  });

  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove the disconnected socket ID from the map
    for (let [email, socketId] of emailSocketMap.entries()) {
      if (socketId === socket.id) {
        emailSocketMap.delete(email);
        console.log(`Removed ${email} from emailSocketMap.`);
        break;
      }
    }
  });

  // Example custom event
  socket.on('message', (msg) => {
    console.log(`Received message: ${msg}`);
  });
});

// Export the io instance and emailSocketMap for use in other files
module.exports = { io, app, server, emailSocketMap };
