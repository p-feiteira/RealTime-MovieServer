// Server-side code
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

let currentVideoTime = 0;
let isVideoPlaying = false;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('currentTime', currentVideoTime);

  // When a user plays the video, update isVideoPlaying and broadcast 'play' event
  socket.on('videoPlay', () => {
    isVideoPlaying = true;
    socket.broadcast.emit('play');
  });

  socket.on('videoPause', () => {
    isVideoPlaying = false;
    socket.broadcast.emit('pause');
  });

  // When a user updates the time, broadcast the new time
  socket.on('updateTime', (data) => {
    currentVideoTime = data.time;
    socket.broadcast.emit('syncTime', { time: data.time });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
