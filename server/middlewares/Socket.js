const http = require('http');
const socketIO = require('socket.io');
const express = require('express')
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors())

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

io.on

module.exports = { app ,server}